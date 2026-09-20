import { createHash } from 'node:crypto';
import { lstat, mkdir, readFile, writeFile } from 'node:fs/promises';
import { basename, dirname, extname, join, resolve } from 'node:path';
import { URL } from 'node:url';
import rehypeSanitize, { type Options as SanitizationSchema } from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import type { Element, Root } from 'hast';
import { unified } from 'unified';
import { visit } from 'unist-util-visit';
import type { TopicContentOutlineItem } from '../../contracts/runtime-catalog.ts';
import type { LoadedContentSource } from './load-content-source.ts';

export interface TransformedTopicContent {
  contentOutline: readonly TopicContentOutlineItem[];
  id: string;
  mainContentHtml: string | null;
}

const SUPPORTED_MARKDOWN_NODE_TYPES = new Set([
  'root',
  'blockquote',
  'paragraph',
  'heading',
  'text',
  'strong',
  'inlineCode',
  'code',
  'list',
  'listItem',
  'link',
  'table',
  'tableRow',
  'tableCell',
  'image',
]);

const SUPPORTED_IMAGE_EXTENSIONS = new Set(['.png', '.svg', '.webp']);

// The readable name is interpolated into a generated URL path, so it is restricted to
// characters that carry no meaning in a URL and need no percent-encoding.
const SUPPORTED_IMAGE_NAME_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._-]*$/;

const OVERFLOW_REGION_CLASS = 'topic-content-overflow';
const CALLOUT_CLASS = 'topic-callout';
const OVERFLOW_CONTEXT_MAX_LENGTH = 160;
const OVERFLOW_REGION_LABEL_PATTERN = /^(?=.{1,200}$)[^\r\n]+ (?:code block|table)(?: \d+)?$/u;
const HEADING_FRAGMENT_PREFIX = 'section-';

function elementText(node: Element): string {
  if (node.tagName === 'img' && typeof node.properties.alt === 'string') {
    return node.properties.alt;
  }

  return node.children
    .map((child) => {
      if (child.type === 'text') {
        return child.value;
      }

      return child.type === 'element' ? elementText(child) : '';
    })
    .join('');
}

function overflowContext(value: string, fallback: string): string {
  const normalized = value.replace(/\s+/gu, ' ').trim() || fallback;

  if (normalized.length <= OVERFLOW_CONTEXT_MAX_LENGTH) {
    return normalized;
  }

  return `${normalized.slice(0, OVERFLOW_CONTEXT_MAX_LENGTH - 1).trimEnd()}…`;
}

function headingFragmentBase(label: string): string {
  const readableFragment = label
    .normalize('NFKD')
    .toLowerCase()
    .replace(/\p{Mark}+/gu, '')
    .replace(/[^\p{Letter}\p{Number}]+/gu, '-')
    .replace(/^-+|-+$/gu, '');

  return `${HEADING_FRAGMENT_PREFIX}${readableFragment || 'section'}`;
}

function deriveContentOutline(tree: Root): readonly TopicContentOutlineItem[] {
  const outline: {
    children: TopicContentOutlineItem[];
    fragment: string;
    label: string;
  }[] = [];
  const usedFragments = new Set<string>();
  let currentSection: (typeof outline)[number] | undefined;

  visit(tree, 'element', (node) => {
    if (node.tagName !== 'h2' && node.tagName !== 'h3') {
      return;
    }

    if (node.tagName === 'h3' && currentSection === undefined) {
      return;
    }

    const label = elementText(node).replace(/\s+/gu, ' ').trim();

    if (label.length === 0) {
      if (node.tagName === 'h2') {
        currentSection = undefined;
      }

      return;
    }

    const baseFragment = headingFragmentBase(label);
    let fragment = baseFragment;
    let duplicateIndex = 2;

    while (usedFragments.has(fragment)) {
      fragment = `${baseFragment}-${duplicateIndex}`;
      duplicateIndex += 1;
    }

    usedFragments.add(fragment);
    const item: TopicContentOutlineItem = { children: [], fragment, label };

    if (node.tagName === 'h2') {
      const section = { ...item, children: [] };
      outline.push(section);
      currentSection = section;
    } else if (currentSection !== undefined) {
      currentSection.children.push(item);
    }
  });

  return outline;
}

function wrapOverflowContent(topicTitle: string) {
  return (tree: Root) => {
    const targets: {
      baseLabel: string;
      index: number;
      node: Element;
      parent: Root | Element;
    }[] = [];
    let currentContext = overflowContext(topicTitle, 'Topic');

    visit(tree, 'element', (node, index, parent) => {
      if (/^h[1-6]$/u.test(node.tagName)) {
        currentContext = overflowContext(elementText(node), topicTitle);
      }

      if (
        (node.tagName === 'pre' || node.tagName === 'table') &&
        index !== undefined &&
        parent !== undefined
      ) {
        const typeLabel = node.tagName === 'pre' ? 'code block' : 'table';
        targets.push({
          baseLabel: `${currentContext} ${typeLabel}`,
          index,
          node,
          parent,
        });
      }
    });

    const targetCounts = new Map<string, number>();
    const targetIndexes = new Map<string, number>();

    for (const { baseLabel } of targets) {
      targetCounts.set(baseLabel, (targetCounts.get(baseLabel) ?? 0) + 1);
    }

    for (const { baseLabel, index, node, parent } of targets) {
      const targetIndex = (targetIndexes.get(baseLabel) ?? 0) + 1;
      const accessibleLabel =
        targetCounts.get(baseLabel) === 1 ? baseLabel : `${baseLabel} ${targetIndex}`;

      targetIndexes.set(baseLabel, targetIndex);

      parent.children[index] = {
        type: 'element',
        tagName: 'div',
        properties: {
          ariaLabel: accessibleLabel,
          className: [OVERFLOW_REGION_CLASS],
          role: 'region',
          tabIndex: 0,
        },
        children: [node],
      };
    }
  };
}

function renderCallouts() {
  return (tree: Root) => {
    visit(tree, 'element', (node) => {
      if (node.tagName !== 'blockquote') {
        return;
      }

      node.tagName = 'div';
      node.properties = {
        ...node.properties,
        className: [CALLOUT_CLASS],
        role: 'note',
      };
    });
  };
}

export const HTML_SANITIZATION_SCHEMA: SanitizationSchema = {
  allowComments: false,
  allowDoctypes: false,
  ancestors: {
    tbody: ['table'],
    td: ['table'],
    th: ['table'],
    thead: ['table'],
    tr: ['table'],
  },
  attributes: {
    a: ['href'],
    code: [['className', /^language-.+$/]],
    div: [
      ['className', OVERFLOW_REGION_CLASS, CALLOUT_CLASS],
      ['role', 'region', 'note'],
      ['ariaLabel', OVERFLOW_REGION_LABEL_PATTERN],
      ['tabIndex', 0],
    ],
    img: ['alt', 'src'],
    ol: ['start'],
    td: ['align'],
    th: ['align'],
  },
  clobber: ['id', 'name'],
  clobberPrefix: 'user-content-',
  // An empty protocol list means "unchecked" rather than "none permitted", so both
  // attributes name the only protocol an authored document may reach.
  protocols: {
    href: ['https'],
    src: ['https'],
  },
  required: {},
  strip: ['script', 'style'],
  tagNames: [
    'a',
    'code',
    'div',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'img',
    'li',
    'ol',
    'p',
    'pre',
    'strong',
    'table',
    'tbody',
    'td',
    'th',
    'thead',
    'tr',
    'ul',
  ],
};

function toError(error: unknown): Error {
  return error instanceof Error ? error : new Error(String(error));
}

function isErrorWithCode(error: unknown, code: string): boolean {
  return error instanceof Error && 'code' in error && error.code === code;
}

function isAbsoluteHttpsUrl(value: string): boolean {
  // HTML sanitization matches the protocol case-sensitively and drops a mismatching
  // href without reporting it, so an uppercase scheme is rejected here instead of
  // becoming an anchor with no destination.
  if (!value.startsWith('https://')) {
    return false;
  }

  try {
    const url = new URL(value);

    return url.protocol === 'https:' && url.hostname.length > 0;
  } catch {
    return false;
  }
}

function isSameDirectoryRelativePath(value: string): boolean {
  if (/^[a-z][a-z\d+.-]*:/i.test(value)) {
    return false;
  }

  const filename = value.startsWith('./') ? value.slice(2) : value;

  return (
    filename.length > 0 &&
    filename !== '.' &&
    filename !== '..' &&
    !filename.includes('/') &&
    !filename.includes('\\')
  );
}

async function renderMarkdown(
  sourcePath: string,
  topicId: string,
  topicTitle: string,
  markdownBody: string,
  generatedRoot: string,
): Promise<Pick<TransformedTopicContent, 'contentOutline' | 'mainContentHtml'>> {
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(renderCallouts)
    .use(wrapOverflowContent, topicTitle)
    .use(rehypeSanitize, HTML_SANITIZATION_SCHEMA)
    .use(rehypeStringify);

  const markdownTree = processor.parse(markdownBody);
  const unsupportedMarkdownNodeTypes = new Set<string>();

  visit(markdownTree, (node) => {
    if (!SUPPORTED_MARKDOWN_NODE_TYPES.has(node.type)) {
      unsupportedMarkdownNodeTypes.add(node.type);
    }
  });

  const invalidLinkUrls: string[] = [];

  visit(markdownTree, 'link', (node) => {
    if (!isAbsoluteHttpsUrl(node.url)) {
      invalidLinkUrls.push(node.url);
    }
  });

  let containsRawHtml = false;

  visit(markdownTree, 'html', () => {
    containsRawHtml = true;
  });

  let containsTaskList = false;

  visit(markdownTree, 'listItem', (node) => {
    if (typeof node.checked === 'boolean') {
      containsTaskList = true;
    }
  });

  let containsStrikethrough = false;

  visit(markdownTree, 'delete', () => {
    containsStrikethrough = true;
  });

  let containsFootnotes = false;

  visit(markdownTree, (node) => {
    if (node.type === 'footnoteReference' || node.type === 'footnoteDefinition') {
      containsFootnotes = true;
    }
  });

  let containsNonTopLevelCallout = false;

  visit(markdownTree, 'blockquote', (_node, _index, parent) => {
    if (parent?.type !== 'root') {
      containsNonTopLevelCallout = true;
    }
  });

  if (containsRawHtml) {
    throw new Error(`${sourcePath}: Raw HTML is not supported`);
  }

  if (containsTaskList) {
    throw new Error(`${sourcePath}: Task lists are not supported`);
  }

  if (containsStrikethrough) {
    throw new Error(`${sourcePath}: Strikethrough is not supported`);
  }

  if (containsFootnotes) {
    throw new Error(`${sourcePath}: Footnotes are not supported`);
  }

  if (containsNonTopLevelCallout) {
    throw new Error(`${sourcePath}: Callouts must be top-level and cannot be nested`);
  }

  if (unsupportedMarkdownNodeTypes.size > 0) {
    const nodeTypes = [...unsupportedMarkdownNodeTypes].sort().join(', ');

    throw new Error(`${sourcePath}: Unsupported Markdown syntax: ${nodeTypes}`);
  }

  if (invalidLinkUrls.length > 0) {
    throw new Error(`${sourcePath}: Link must use an absolute HTTPS URL: ${invalidLinkUrls[0]}`);
  }

  const imageNodes: { alt?: string | null; url: string }[] = [];

  visit(markdownTree, 'image', (node) => {
    imageNodes.push(node);
  });

  for (const imageNode of imageNodes) {
    if (imageNode.alt?.trim().length === 0 || imageNode.alt == null) {
      throw new Error(
        `${sourcePath}: Image must have meaningful alternative text: ${imageNode.url}`,
      );
    }

    if (!isSameDirectoryRelativePath(imageNode.url)) {
      throw new Error(
        `${sourcePath}: Image must use a same-directory relative path: ${imageNode.url}`,
      );
    }

    const sourceExtension = extname(imageNode.url);
    const outputExtension = sourceExtension.toLowerCase();
    const readableName = basename(imageNode.url, sourceExtension);

    if (!SUPPORTED_IMAGE_EXTENSIONS.has(outputExtension)) {
      throw new Error(`${sourcePath}: Image type is not supported: ${imageNode.url}`);
    }

    if (!SUPPORTED_IMAGE_NAME_PATTERN.test(readableName)) {
      throw new Error(
        `${sourcePath}: Image file name must begin with an ASCII letter or digit and contain only ASCII letters, digits, dots, hyphens, and underscores: ${imageNode.url}`,
      );
    }

    // The recorded Topic path is already qualified, so a colocated image resolves
    // from that path alone: absolute paths as given, relative ones against the
    // working directory.
    const sourceImagePath = resolve(dirname(sourcePath), imageNode.url);
    let sourceImageStats;

    try {
      sourceImageStats = await lstat(sourceImagePath);
    } catch (error: unknown) {
      if (isErrorWithCode(error, 'ENOENT')) {
        throw new Error(`${sourcePath}: Image source file does not exist: ${imageNode.url}`, {
          cause: error,
        });
      }

      throw new Error(`${sourcePath}: Image source file could not be accessed: ${imageNode.url}`, {
        cause: error,
      });
    }

    if (sourceImageStats.isSymbolicLink()) {
      throw new Error(
        `${sourcePath}: Image source path must not be a symbolic link: ${imageNode.url}`,
      );
    }

    if (!sourceImageStats.isFile()) {
      throw new Error(`${sourcePath}: Image source path is not a file: ${imageNode.url}`);
    }

    let imageBytes;

    try {
      imageBytes = await readFile(sourceImagePath);
    } catch (error: unknown) {
      throw new Error(`${sourcePath}: Image source file could not be read: ${imageNode.url}`, {
        cause: error,
      });
    }

    const contentHash = createHash('sha256').update(imageBytes).digest('hex').slice(0, 12);
    const outputFilename = `${readableName}.${contentHash}${outputExtension}`;
    const outputDirectory = join(generatedRoot, 'assets', 'topics', topicId);

    try {
      await mkdir(outputDirectory, { recursive: true });
      await writeFile(join(outputDirectory, outputFilename), imageBytes);
    } catch (error: unknown) {
      throw new Error(
        `${sourcePath}: Image could not be written to generated output: ${imageNode.url}`,
        { cause: error },
      );
    }

    imageNode.url = `/assets/topics/${topicId}/${outputFilename}`;
  }

  const htmlTree = processor.runSync(markdownTree);
  const contentOutline = deriveContentOutline(htmlTree);

  return {
    contentOutline,
    mainContentHtml: String(processor.stringify(htmlTree)),
  };
}

export async function transformContent(
  contentSource: LoadedContentSource,
  generatedRoot: string,
): Promise<TransformedTopicContent[]> {
  const transformedTopics: TransformedTopicContent[] = [];
  const errors: Error[] = [];

  for (const topic of contentSource.topics) {
    if (topic.markdownBody.trim().length === 0) {
      transformedTopics.push({
        contentOutline: [],
        id: topic.id,
        mainContentHtml: null,
      });

      continue;
    }

    try {
      const transformedContent = await renderMarkdown(
        topic.sourcePath,
        topic.id,
        topic.title,
        topic.markdownBody,
        generatedRoot,
      );

      transformedTopics.push({
        ...transformedContent,
        id: topic.id,
      });
    } catch (error: unknown) {
      errors.push(toError(error));
    }
  }

  if (errors.length > 0) {
    throw new AggregateError(
      errors,
      `Content transformation failed with ${errors.length} error(s)`,
    );
  }

  return transformedTopics;
}

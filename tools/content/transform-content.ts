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
import type { LoadedContentSource } from './load-content-source.ts';

export interface TransformedTopicContent {
  id: string;
  mainContentHtml: string | null;
}

const SUPPORTED_MARKDOWN_NODE_TYPES = new Set([
  'root',
  'paragraph',
  'heading',
  'text',
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

function wrapOverflowContent() {
  return (tree: Root) => {
    const targets: { index: number; node: Element; parent: Root | Element }[] = [];

    visit(tree, 'element', (node, index, parent) => {
      if (
        (node.tagName === 'pre' || node.tagName === 'table') &&
        index !== undefined &&
        parent !== undefined
      ) {
        targets.push({ index, node, parent });
      }
    });

    for (const { index, node, parent } of targets) {
      const accessibleLabel = node.tagName === 'pre' ? 'Scrollable code block' : 'Scrollable table';

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
      ['className', OVERFLOW_REGION_CLASS],
      ['role', 'region'],
      ['ariaLabel', /^Scrollable (?:code block|table)$/],
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
  markdownBody: string,
  generatedRoot: string,
): Promise<string> {
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(wrapOverflowContent)
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

  return String(processor.stringify(htmlTree));
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
        id: topic.id,
        mainContentHtml: null,
      });

      continue;
    }

    try {
      transformedTopics.push({
        id: topic.id,
        mainContentHtml: await renderMarkdown(
          topic.sourcePath,
          topic.id,
          topic.markdownBody,
          generatedRoot,
        ),
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

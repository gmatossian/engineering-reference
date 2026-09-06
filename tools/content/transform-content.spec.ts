import { afterEach, describe, expect, it } from 'vitest';
import { mkdir, mkdtemp, readFile, readdir, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import rehypeSanitize from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';
import type { LoadedContentSource } from './load-content-source.ts';
import { HTML_SANITIZATION_SCHEMA, transformContent } from './transform-content.ts';

async function captureAggregateError(action: () => Promise<unknown>): Promise<AggregateError> {
  try {
    await action();
  } catch (error: unknown) {
    expect(error).toBeInstanceOf(AggregateError);

    return error as AggregateError;
  }

  throw new Error('Expected an AggregateError to be thrown');
}

describe('transformContent', () => {
  let generatedRoot: string | undefined;

  afterEach(async () => {
    if (generatedRoot !== undefined) {
      await rm(generatedRoot, {
        recursive: true,
        force: true,
      });
    }
  });

  it('renders a Markdown paragraph with strong emphasis as semantic HTML', async () => {
    const topicId = '11111111-1111-4111-8111-111111111111';

    generatedRoot = await mkdtemp(join(tmpdir(), 'engineering-reference-generated-'));

    const contentSource: LoadedContentSource = {
      catalog: {
        sourcePath: 'content/catalog.yaml',
        landingTopicIds: [topicId],
      },
      topics: [
        {
          sourcePath: 'content/topics/queue/topic.md',
          id: topicId,
          title: 'Queue',
          childTopicIds: [],
          markdownBody: 'Use **offer** when failure is expected.',
        },
      ],
    };

    await expect(transformContent(contentSource, generatedRoot)).resolves.toEqual([
      {
        id: topicId,
        mainContentHtml: '<p>Use <strong>offer</strong> when failure is expected.</p>',
      },
    ]);
  });

  it('represents a navigation-only Topic with null main content', async () => {
    const parentTopicId = '11111111-1111-4111-8111-111111111111';
    const childTopicId = '22222222-2222-4222-8222-222222222222';

    generatedRoot = await mkdtemp(join(tmpdir(), 'engineering-reference-generated-'));

    const contentSource: LoadedContentSource = {
      catalog: {
        sourcePath: 'content/catalog.yaml',
        landingTopicIds: [parentTopicId],
      },
      topics: [
        {
          sourcePath: 'content/topics/java/topic.md',
          id: parentTopicId,
          title: 'Java',
          childTopicIds: [childTopicId],
          markdownBody: '\n',
        },
        {
          sourcePath: 'content/topics/collections/topic.md',
          id: childTopicId,
          title: 'Collections',
          childTopicIds: [],
          markdownBody: 'Collections content.',
        },
      ],
    };

    await expect(transformContent(contentSource, generatedRoot)).resolves.toEqual([
      {
        id: parentTopicId,
        mainContentHtml: null,
      },
      {
        id: childTopicId,
        mainContentHtml: '<p>Collections content.</p>',
      },
    ]);
  });

  it('renders a GFM table as semantic HTML', async () => {
    const topicId = '11111111-1111-4111-8111-111111111111';

    generatedRoot = await mkdtemp(join(tmpdir(), 'engineering-reference-generated-'));

    const contentSource: LoadedContentSource = {
      catalog: {
        sourcePath: 'content/catalog.yaml',
        landingTopicIds: [topicId],
      },
      topics: [
        {
          sourcePath: 'content/topics/queue/topic.md',
          id: topicId,
          title: 'Queue',
          childTopicIds: [],
          markdownBody: ['| Operation | Complexity |', '| --- | --- |', '| offer | O(1) |'].join(
            '\n',
          ),
        },
      ],
    };

    await expect(transformContent(contentSource, generatedRoot)).resolves.toEqual([
      {
        id: topicId,
        mainContentHtml: [
          '<div aria-label="Scrollable table" class="topic-content-overflow" role="region" tabindex="0"><table>',
          '<thead>',
          '<tr>',
          '<th>Operation</th>',
          '<th>Complexity</th>',
          '</tr>',
          '</thead>',
          '<tbody>',
          '<tr>',
          '<td>offer</td>',
          '<td>O(1)</td>',
          '</tr>',
          '</tbody>',
          '</table></div>',
        ].join('\n'),
      },
    ]);
  });

  it('gives repeated overflow regions unique accessible names', async () => {
    const topicId = '11111111-1111-4111-8111-111111111111';

    generatedRoot = await mkdtemp(join(tmpdir(), 'engineering-reference-generated-'));

    const contentSource: LoadedContentSource = {
      catalog: {
        sourcePath: 'content/catalog.yaml',
        landingTopicIds: [topicId],
      },
      topics: [
        {
          sourcePath: 'content/topics/queue/topic.md',
          id: topicId,
          title: 'Queue',
          childTopicIds: [],
          markdownBody: [
            '| First |',
            '| --- |',
            '| A |',
            '',
            '| Second |',
            '| --- |',
            '| B |',
          ].join('\n'),
        },
      ],
    };

    const result = await transformContent(contentSource, generatedRoot);

    expect(result[0]?.mainContentHtml).toContain('aria-label="Scrollable table 1"');
    expect(result[0]?.mainContentHtml).toContain('aria-label="Scrollable table 2"');
  });

  it('rejects raw HTML', async () => {
    const topicId = '11111111-1111-4111-8111-111111111111';
    const sourcePath = 'content/topics/queue/topic.md';

    generatedRoot = await mkdtemp(join(tmpdir(), 'engineering-reference-generated-'));

    const contentSource: LoadedContentSource = {
      catalog: {
        sourcePath: 'content/catalog.yaml',
        landingTopicIds: [topicId],
      },
      topics: [
        {
          sourcePath,
          id: topicId,
          title: 'Queue',
          childTopicIds: [],
          markdownBody: '<div>Unsupported HTML</div>',
        },
      ],
    };

    const error = await captureAggregateError(() =>
      transformContent(contentSource, generatedRoot!),
    );

    expect(error.message).toBe('Content transformation failed with 1 error(s)');
    expect(error.errors).toHaveLength(1);
    expect((error.errors[0] as Error).message).toBe(`${sourcePath}: Raw HTML is not supported`);
  });

  it('rejects task lists', async () => {
    const topicId = '11111111-1111-4111-8111-111111111111';
    const sourcePath = 'content/topics/queue/topic.md';

    generatedRoot = await mkdtemp(join(tmpdir(), 'engineering-reference-generated-'));

    const contentSource: LoadedContentSource = {
      catalog: {
        sourcePath: 'content/catalog.yaml',
        landingTopicIds: [topicId],
      },
      topics: [
        {
          sourcePath,
          id: topicId,
          title: 'Queue',
          childTopicIds: [],
          markdownBody: '- [x] Understand queues',
        },
      ],
    };

    const error = await captureAggregateError(() =>
      transformContent(contentSource, generatedRoot!),
    );

    expect(error.errors).toHaveLength(1);
    expect((error.errors[0] as Error).message).toBe(`${sourcePath}: Task lists are not supported`);
  });

  it('rejects strikethrough', async () => {
    const topicId = '11111111-1111-4111-8111-111111111111';
    const sourcePath = 'content/topics/queue/topic.md';

    generatedRoot = await mkdtemp(join(tmpdir(), 'engineering-reference-generated-'));

    const contentSource: LoadedContentSource = {
      catalog: {
        sourcePath: 'content/catalog.yaml',
        landingTopicIds: [topicId],
      },
      topics: [
        {
          sourcePath,
          id: topicId,
          title: 'Queue',
          childTopicIds: [],
          markdownBody: '~~Obsolete queue advice~~',
        },
      ],
    };

    const error = await captureAggregateError(() =>
      transformContent(contentSource, generatedRoot!),
    );

    expect(error.errors).toHaveLength(1);
    expect((error.errors[0] as Error).message).toBe(
      `${sourcePath}: Strikethrough is not supported`,
    );
  });

  it('rejects footnotes', async () => {
    const topicId = '11111111-1111-4111-8111-111111111111';
    const sourcePath = 'content/topics/queue/topic.md';

    generatedRoot = await mkdtemp(join(tmpdir(), 'engineering-reference-generated-'));

    const contentSource: LoadedContentSource = {
      catalog: {
        sourcePath: 'content/catalog.yaml',
        landingTopicIds: [topicId],
      },
      topics: [
        {
          sourcePath,
          id: topicId,
          title: 'Queue',
          childTopicIds: [],
          markdownBody: [
            'Queue ordering matters.[^ordering]',
            '',
            '[^ordering]: Usually FIFO.',
          ].join('\n'),
        },
      ],
    };

    const error = await captureAggregateError(() =>
      transformContent(contentSource, generatedRoot!),
    );

    expect(error.errors).toHaveLength(1);
    expect((error.errors[0] as Error).message).toBe(`${sourcePath}: Footnotes are not supported`);
  });

  it('rejects Markdown outside the supported syntax allowlist', async () => {
    const topicId = '11111111-1111-4111-8111-111111111111';
    const sourcePath = 'content/topics/queue/topic.md';

    generatedRoot = await mkdtemp(join(tmpdir(), 'engineering-reference-generated-'));

    const contentSource: LoadedContentSource = {
      catalog: {
        sourcePath: 'content/catalog.yaml',
        landingTopicIds: [topicId],
      },
      topics: [
        {
          sourcePath,
          id: topicId,
          title: 'Queue',
          childTopicIds: [],
          markdownBody: '> Queues are often FIFO.',
        },
      ],
    };

    const error = await captureAggregateError(() =>
      transformContent(contentSource, generatedRoot!),
    );

    expect(error.errors).toHaveLength(1);
    expect((error.errors[0] as Error).message).toBe(
      `${sourcePath}: Unsupported Markdown syntax: blockquote`,
    );
  });

  it('rejects non-HTTPS links', async () => {
    const topicId = '11111111-1111-4111-8111-111111111111';
    const sourcePath = 'content/topics/queue/topic.md';

    generatedRoot = await mkdtemp(join(tmpdir(), 'engineering-reference-generated-'));

    const contentSource: LoadedContentSource = {
      catalog: {
        sourcePath: 'content/catalog.yaml',
        landingTopicIds: [topicId],
      },
      topics: [
        {
          sourcePath,
          id: topicId,
          title: 'Queue',
          childTopicIds: [],
          markdownBody: '[Queue reference](http://example.com/queue)',
        },
      ],
    };

    const error = await captureAggregateError(() =>
      transformContent(contentSource, generatedRoot!),
    );

    expect(error.errors).toHaveLength(1);
    expect((error.errors[0] as Error).message).toBe(
      `${sourcePath}: Link must use an absolute HTTPS URL: http://example.com/queue`,
    );
  });

  it('renders an absolute HTTPS link', async () => {
    const topicId = '11111111-1111-4111-8111-111111111111';

    generatedRoot = await mkdtemp(join(tmpdir(), 'engineering-reference-generated-'));

    const contentSource: LoadedContentSource = {
      catalog: {
        sourcePath: 'content/catalog.yaml',
        landingTopicIds: [topicId],
      },
      topics: [
        {
          sourcePath: 'content/topics/queue/topic.md',
          id: topicId,
          title: 'Queue',
          childTopicIds: [],
          markdownBody: '[Queue reference](https://example.com/queue)',
        },
      ],
    };

    await expect(transformContent(contentSource, generatedRoot)).resolves.toEqual([
      {
        id: topicId,
        mainContentHtml: '<p><a href="https://example.com/queue">Queue reference</a></p>',
      },
    ]);
  });

  it('copies a local image with a content hash and rewrites its URL', async () => {
    const topicId = '11111111-1111-4111-8111-111111111111';
    const svg = '<svg xmlns="http://www.w3.org/2000/svg"></svg>\n';
    const expectedFilename = 'queue-operations.7b3bba3ed45b.svg';

    generatedRoot = await mkdtemp(join(tmpdir(), 'engineering-reference-generated-'));

    const topicDirectory = join(generatedRoot, 'content', 'topics', 'queue');
    const outputRoot = join(generatedRoot, '.generated');

    await mkdir(topicDirectory, { recursive: true });
    await writeFile(join(topicDirectory, 'queue-operations.svg'), svg);

    const contentSource: LoadedContentSource = {
      catalog: {
        sourcePath: join(generatedRoot, 'content', 'catalog.yaml'),
        landingTopicIds: [topicId],
      },
      topics: [
        {
          sourcePath: join(topicDirectory, 'topic.md'),
          id: topicId,
          title: 'Queue',
          childTopicIds: [],
          markdownBody: '![Elements entering and leaving a queue](queue-operations.svg)',
        },
      ],
    };

    await expect(transformContent(contentSource, outputRoot)).resolves.toEqual([
      {
        id: topicId,
        mainContentHtml: `<p><img src="/assets/topics/${topicId}/${expectedFilename}" alt="Elements entering and leaving a queue"></p>`,
      },
    ]);

    await expect(
      readFile(join(outputRoot, 'assets', 'topics', topicId, expectedFilename), 'utf8'),
    ).resolves.toBe(svg);
  });

  it('reports the Topic source when a generated image cannot be written', async () => {
    const topicId = '11111111-1111-4111-8111-111111111111';

    generatedRoot = await mkdtemp(join(tmpdir(), 'engineering-reference-generated-'));

    const topicDirectory = join(generatedRoot, 'content', 'topics', 'queue');
    const sourcePath = join(topicDirectory, 'topic.md');
    const outputRoot = join(generatedRoot, 'blocked-output');

    await mkdir(topicDirectory, { recursive: true });
    await writeFile(
      join(topicDirectory, 'queue-operations.svg'),
      '<svg xmlns="http://www.w3.org/2000/svg"></svg>\n',
    );
    await writeFile(outputRoot, 'not a directory');

    const contentSource: LoadedContentSource = {
      catalog: {
        sourcePath: 'content/catalog.yaml',
        landingTopicIds: [topicId],
      },
      topics: [
        {
          sourcePath,
          id: topicId,
          title: 'Queue',
          childTopicIds: [],
          markdownBody: '![Queue operations](./queue-operations.svg)',
        },
      ],
    };

    const error = await captureAggregateError(() => transformContent(contentSource, outputRoot));

    expect(error.errors).toHaveLength(1);
    expect((error.errors[0] as Error).message).toBe(
      `${sourcePath}: Image could not be written to generated output: ./queue-operations.svg`,
    );
  });

  it('rejects an image without meaningful alternative text', async () => {
    const topicId = '11111111-1111-4111-8111-111111111111';

    generatedRoot = await mkdtemp(join(tmpdir(), 'engineering-reference-generated-'));

    const topicDirectory = join(generatedRoot, 'content', 'topics', 'queue');
    const sourcePath = join(topicDirectory, 'topic.md');
    const outputRoot = join(generatedRoot, '.generated');

    await mkdir(topicDirectory, { recursive: true });
    await writeFile(
      join(topicDirectory, 'queue-operations.svg'),
      '<svg xmlns="http://www.w3.org/2000/svg"></svg>\n',
    );

    const contentSource: LoadedContentSource = {
      catalog: {
        sourcePath: join(generatedRoot, 'content', 'catalog.yaml'),
        landingTopicIds: [topicId],
      },
      topics: [
        {
          sourcePath,
          id: topicId,
          title: 'Queue',
          childTopicIds: [],
          markdownBody: '![](./queue-operations.svg)',
        },
      ],
    };

    const error = await captureAggregateError(() => transformContent(contentSource, outputRoot));

    expect(error.errors).toHaveLength(1);
    expect((error.errors[0] as Error).message).toBe(
      `${sourcePath}: Image must have meaningful alternative text: ./queue-operations.svg`,
    );
  });

  it('rejects a remote image', async () => {
    const topicId = '11111111-1111-4111-8111-111111111111';
    const sourcePath = 'content/topics/queue/topic.md';

    generatedRoot = await mkdtemp(join(tmpdir(), 'engineering-reference-generated-'));

    const contentSource: LoadedContentSource = {
      catalog: {
        sourcePath: 'content/catalog.yaml',
        landingTopicIds: [topicId],
      },
      topics: [
        {
          sourcePath,
          id: topicId,
          title: 'Queue',
          childTopicIds: [],
          markdownBody: '![Queue operations](https://example.com/queue-operations.svg)',
        },
      ],
    };

    const error = await captureAggregateError(() =>
      transformContent(contentSource, generatedRoot!),
    );

    expect(error.errors).toHaveLength(1);
    expect((error.errors[0] as Error).message).toBe(
      `${sourcePath}: Image must use a same-directory relative path: https://example.com/queue-operations.svg`,
    );
  });

  it('renders the complete supported structural Markdown subset without heading IDs', async () => {
    const topicId = '11111111-1111-4111-8111-111111111111';

    generatedRoot = await mkdtemp(join(tmpdir(), 'engineering-reference-generated-'));

    const contentSource: LoadedContentSource = {
      catalog: {
        sourcePath: 'content/catalog.yaml',
        landingTopicIds: [topicId],
      },
      topics: [
        {
          sourcePath: 'content/topics/queue/topic.md',
          id: topicId,
          title: 'Queue',
          childTopicIds: [],
          markdownBody: [
            '## Queue operations',
            '',
            'Use `offer`.',
            '',
            '```java',
            'queue.offer(item);',
            '```',
            '',
            '1. Check capacity',
            '2. Add item',
            '',
            '- FIFO',
            '- Bounded',
          ].join('\n'),
        },
      ],
    };

    await expect(transformContent(contentSource, generatedRoot)).resolves.toEqual([
      {
        id: topicId,
        mainContentHtml: [
          '<h2>Queue operations</h2>',
          '<p>Use <code>offer</code>.</p>',
          '<div aria-label="Scrollable code block" class="topic-content-overflow" role="region" tabindex="0"><pre><code class="language-java">queue.offer(item);',
          '</code></pre></div>',
          '<ol>',
          '<li>Check capacity</li>',
          '<li>Add item</li>',
          '</ol>',
          '<ul>',
          '<li>FIFO</li>',
          '<li>Bounded</li>',
          '</ul>',
        ].join('\n'),
      },
    ]);
  });

  it('rejects internal, relative, route, data, and unsafe-protocol links', async () => {
    const topicId = '11111111-1111-4111-8111-111111111111';
    const sourcePath = 'content/topics/queue/topic.md';
    const invalidUrls = [
      'topic:22222222-2222-4222-8222-222222222222',
      './queue-details.md',
      '/topics/22222222-2222-4222-8222-222222222222',
      'data:text/plain,queue',
      'javascript:void',
    ];

    generatedRoot = await mkdtemp(join(tmpdir(), 'engineering-reference-generated-'));

    for (const invalidUrl of invalidUrls) {
      const contentSource: LoadedContentSource = {
        catalog: {
          sourcePath: 'content/catalog.yaml',
          landingTopicIds: [topicId],
        },
        topics: [
          {
            sourcePath,
            id: topicId,
            title: 'Queue',
            childTopicIds: [],
            markdownBody: `[Queue reference](${invalidUrl})`,
          },
        ],
      };

      const error = await captureAggregateError(() =>
        transformContent(contentSource, generatedRoot!),
      );

      expect(error.errors).toHaveLength(1);
      expect((error.errors[0] as Error).message).toBe(
        `${sourcePath}: Link must use an absolute HTTPS URL: ${invalidUrl}`,
      );
    }
  });

  it('rejects absolute, data, parent-directory, and nested image paths', async () => {
    const topicId = '11111111-1111-4111-8111-111111111111';
    const sourcePath = 'content/topics/queue/topic.md';
    const invalidPaths = [
      '/queue-operations.svg',
      'data:image/svg+xml;base64,PHN2Zz48L3N2Zz4=',
      '../queue-operations.svg',
      './images/queue-operations.svg',
    ];

    generatedRoot = await mkdtemp(join(tmpdir(), 'engineering-reference-generated-'));

    for (const invalidPath of invalidPaths) {
      const contentSource: LoadedContentSource = {
        catalog: {
          sourcePath: 'content/catalog.yaml',
          landingTopicIds: [topicId],
        },
        topics: [
          {
            sourcePath,
            id: topicId,
            title: 'Queue',
            childTopicIds: [],
            markdownBody: `![Queue operations](${invalidPath})`,
          },
        ],
      };

      const error = await captureAggregateError(() =>
        transformContent(contentSource, generatedRoot!),
      );

      expect(error.errors).toHaveLength(1);
      expect((error.errors[0] as Error).message).toBe(
        `${sourcePath}: Image must use a same-directory relative path: ${invalidPath}`,
      );
    }
  });

  it('rejects an unsupported image type', async () => {
    const topicId = '11111111-1111-4111-8111-111111111111';

    generatedRoot = await mkdtemp(join(tmpdir(), 'engineering-reference-generated-'));

    const topicDirectory = join(generatedRoot, 'content', 'topics', 'queue');
    const sourcePath = join(topicDirectory, 'topic.md');
    const outputRoot = join(generatedRoot, '.generated');

    await mkdir(topicDirectory, { recursive: true });
    await writeFile(join(topicDirectory, 'queue-operations.gif'), 'GIF fixture');

    const contentSource: LoadedContentSource = {
      catalog: {
        sourcePath: 'content/catalog.yaml',
        landingTopicIds: [topicId],
      },
      topics: [
        {
          sourcePath,
          id: topicId,
          title: 'Queue',
          childTopicIds: [],
          markdownBody: '![Queue operations](./queue-operations.gif)',
        },
      ],
    };

    const error = await captureAggregateError(() => transformContent(contentSource, outputRoot));

    expect(error.errors).toHaveLength(1);
    expect((error.errors[0] as Error).message).toBe(
      `${sourcePath}: Image type is not supported: ./queue-operations.gif`,
    );
  });

  it('rejects an image whose source file does not exist', async () => {
    const topicId = '11111111-1111-4111-8111-111111111111';

    generatedRoot = await mkdtemp(join(tmpdir(), 'engineering-reference-generated-'));

    const topicDirectory = join(generatedRoot, 'content', 'topics', 'queue');
    const sourcePath = join(topicDirectory, 'topic.md');

    await mkdir(topicDirectory, { recursive: true });

    const contentSource: LoadedContentSource = {
      catalog: {
        sourcePath: 'content/catalog.yaml',
        landingTopicIds: [topicId],
      },
      topics: [
        {
          sourcePath,
          id: topicId,
          title: 'Queue',
          childTopicIds: [],
          markdownBody: '![Queue operations](./missing.svg)',
        },
      ],
    };

    const error = await captureAggregateError(() =>
      transformContent(contentSource, join(generatedRoot!, '.generated')),
    );

    expect(error.errors).toHaveLength(1);
    expect((error.errors[0] as Error).message).toBe(
      `${sourcePath}: Image source file does not exist: ./missing.svg`,
    );
  });

  it('rejects a symbolic-link image source', async () => {
    const topicId = '11111111-1111-4111-8111-111111111111';

    generatedRoot = await mkdtemp(join(tmpdir(), 'engineering-reference-generated-'));

    const topicDirectory = join(generatedRoot, 'content', 'topics', 'queue');
    const sourcePath = join(topicDirectory, 'topic.md');
    const outsideImagePath = join(generatedRoot, 'outside.svg');

    await mkdir(topicDirectory, { recursive: true });
    await writeFile(outsideImagePath, '<svg xmlns="http://www.w3.org/2000/svg"></svg>\n');
    await symlink(outsideImagePath, join(topicDirectory, 'queue-operations.svg'));

    const contentSource: LoadedContentSource = {
      catalog: {
        sourcePath: 'content/catalog.yaml',
        landingTopicIds: [topicId],
      },
      topics: [
        {
          sourcePath,
          id: topicId,
          title: 'Queue',
          childTopicIds: [],
          markdownBody: '![Queue operations](./queue-operations.svg)',
        },
      ],
    };

    const error = await captureAggregateError(() =>
      transformContent(contentSource, join(generatedRoot!, '.generated')),
    );

    expect(error.errors).toHaveLength(1);
    expect((error.errors[0] as Error).message).toBe(
      `${sourcePath}: Image source path must not be a symbolic link: ./queue-operations.svg`,
    );
  });

  it('accepts PNG and WebP image extensions', async () => {
    const topicId = '11111111-1111-4111-8111-111111111111';
    const supportedImages = [
      { extension: 'png', bytes: 'PNG fixture', hash: '73dfe4fd008f' },
      { extension: 'webp', bytes: 'WebP fixture', hash: '8639b2c3b93a' },
    ];

    generatedRoot = await mkdtemp(join(tmpdir(), 'engineering-reference-generated-'));

    const topicDirectory = join(generatedRoot, 'content', 'topics', 'queue');
    const sourcePath = join(topicDirectory, 'topic.md');
    const outputRoot = join(generatedRoot, '.generated');

    await mkdir(topicDirectory, { recursive: true });

    for (const image of supportedImages) {
      const sourceFilename = `queue-operations.${image.extension}`;
      const outputFilename = `queue-operations.${image.hash}.${image.extension}`;

      await writeFile(join(topicDirectory, sourceFilename), image.bytes);

      const contentSource: LoadedContentSource = {
        catalog: {
          sourcePath: 'content/catalog.yaml',
          landingTopicIds: [topicId],
        },
        topics: [
          {
            sourcePath,
            id: topicId,
            title: 'Queue',
            childTopicIds: [],
            markdownBody: `![Queue operations](./${sourceFilename})`,
          },
        ],
      };

      await expect(transformContent(contentSource, outputRoot)).resolves.toEqual([
        {
          id: topicId,
          mainContentHtml: `<p><img src="/assets/topics/${topicId}/${outputFilename}" alt="Queue operations"></p>`,
        },
      ]);

      await expect(
        readFile(join(outputRoot, 'assets', 'topics', topicId, outputFilename), 'utf8'),
      ).resolves.toBe(image.bytes);
    }
  });

  it('aggregates independent transformation errors from multiple Topics', async () => {
    const firstTopicId = '11111111-1111-4111-8111-111111111111';
    const secondTopicId = '22222222-2222-4222-8222-222222222222';
    const firstSourcePath = 'content/topics/queue/topic.md';
    const secondSourcePath = 'content/topics/stack/topic.md';

    generatedRoot = await mkdtemp(join(tmpdir(), 'engineering-reference-generated-'));

    const contentSource: LoadedContentSource = {
      catalog: {
        sourcePath: 'content/catalog.yaml',
        landingTopicIds: [firstTopicId, secondTopicId],
      },
      topics: [
        {
          sourcePath: firstSourcePath,
          id: firstTopicId,
          title: 'Queue',
          childTopicIds: [],
          markdownBody: '<div>Raw HTML</div>',
        },
        {
          sourcePath: secondSourcePath,
          id: secondTopicId,
          title: 'Stack',
          childTopicIds: [],
          markdownBody: '[Stack reference](http://example.com/stack)',
        },
      ],
    };

    const error = await captureAggregateError(() =>
      transformContent(contentSource, generatedRoot!),
    );

    expect(error.message).toBe('Content transformation failed with 2 error(s)');
    expect(
      error.errors.map((item: unknown) => (item instanceof Error ? item.message : String(item))),
    ).toEqual([
      `${firstSourcePath}: Raw HTML is not supported`,
      `${secondSourcePath}: Link must use an absolute HTTPS URL: http://example.com/stack`,
    ]);
  });

  it('rejects a link whose scheme is not lowercase https', async () => {
    const topicId = '11111111-1111-4111-8111-111111111111';
    const sourcePath = 'content/topics/queue/topic.md';

    generatedRoot = await mkdtemp(join(tmpdir(), 'engineering-reference-generated-'));

    const contentSource: LoadedContentSource = {
      catalog: {
        sourcePath: 'content/catalog.yaml',
        landingTopicIds: [topicId],
      },
      topics: [
        {
          sourcePath,
          id: topicId,
          title: 'Queue',
          childTopicIds: [],
          markdownBody: '[Queue reference](HTTPS://EXAMPLE.COM/queue)',
        },
      ],
    };

    const error = await captureAggregateError(() =>
      transformContent(contentSource, generatedRoot!),
    );

    expect(error.errors).toHaveLength(1);
    expect((error.errors[0] as Error).message).toBe(
      `${sourcePath}: Link must use an absolute HTTPS URL: HTTPS://EXAMPLE.COM/queue`,
    );
  });

  it('rejects an image file name that would not survive URL interpolation', async () => {
    const topicId = '11111111-1111-4111-8111-111111111111';
    const unsafeNames = ['queue#operations.svg', 'queue?operations.svg', 'queue operations.svg'];

    generatedRoot = await mkdtemp(join(tmpdir(), 'engineering-reference-generated-'));

    const topicDirectory = join(generatedRoot, 'content', 'topics', 'queue');
    const sourcePath = join(topicDirectory, 'topic.md');
    const outputRoot = join(generatedRoot, '.generated');

    await mkdir(topicDirectory, { recursive: true });

    for (const unsafeName of unsafeNames) {
      await writeFile(
        join(topicDirectory, unsafeName),
        '<svg xmlns="http://www.w3.org/2000/svg"></svg>\n',
      );

      const contentSource: LoadedContentSource = {
        catalog: {
          sourcePath: 'content/catalog.yaml',
          landingTopicIds: [topicId],
        },
        topics: [
          {
            sourcePath,
            id: topicId,
            title: 'Queue',
            childTopicIds: [],
            markdownBody: `![Queue operations](<./${unsafeName}>)`,
          },
        ],
      };

      const error = await captureAggregateError(() => transformContent(contentSource, outputRoot));

      expect(error.errors).toHaveLength(1);
      expect((error.errors[0] as Error).message).toBe(
        `${sourcePath}: Image file name must begin with an ASCII letter or digit and contain only ASCII letters, digits, dots, hyphens, and underscores: ./${unsafeName}`,
      );
    }
  });

  it('accepts a readable image name containing dots, hyphens, and underscores', async () => {
    const topicId = '11111111-1111-4111-8111-111111111111';
    const sourceFilename = 'queue-operations.dark_mode.svg';
    const outputFilename = 'queue-operations.dark_mode.7b3bba3ed45b.svg';

    generatedRoot = await mkdtemp(join(tmpdir(), 'engineering-reference-generated-'));

    const topicDirectory = join(generatedRoot, 'content', 'topics', 'queue');
    const sourcePath = join(topicDirectory, 'topic.md');
    const outputRoot = join(generatedRoot, '.generated');

    await mkdir(topicDirectory, { recursive: true });
    await writeFile(
      join(topicDirectory, sourceFilename),
      '<svg xmlns="http://www.w3.org/2000/svg"></svg>\n',
    );

    const contentSource: LoadedContentSource = {
      catalog: {
        sourcePath: 'content/catalog.yaml',
        landingTopicIds: [topicId],
      },
      topics: [
        {
          sourcePath,
          id: topicId,
          title: 'Queue',
          childTopicIds: [],
          markdownBody: `![Queue operations](./${sourceFilename})`,
        },
      ],
    };

    await expect(transformContent(contentSource, outputRoot)).resolves.toEqual([
      {
        id: topicId,
        mainContentHtml: `<p><img src="/assets/topics/${topicId}/${outputFilename}" alt="Queue operations"></p>`,
      },
    ]);
  });

  it('produces identical HTML and asset output on repeated transformation', async () => {
    const topicId = '11111111-1111-4111-8111-111111111111';
    const svg = '<svg xmlns="http://www.w3.org/2000/svg"></svg>\n';
    const expectedFilename = 'queue-operations.7b3bba3ed45b.svg';

    generatedRoot = await mkdtemp(join(tmpdir(), 'engineering-reference-generated-'));

    const topicDirectory = join(generatedRoot, 'content', 'topics', 'queue');
    const sourcePath = join(topicDirectory, 'topic.md');
    const firstOutputRoot = join(generatedRoot, 'first-output');
    const secondOutputRoot = join(generatedRoot, 'second-output');

    await mkdir(topicDirectory, { recursive: true });
    await writeFile(join(topicDirectory, 'queue-operations.svg'), svg);

    const contentSource: LoadedContentSource = {
      catalog: {
        sourcePath: 'content/catalog.yaml',
        landingTopicIds: [topicId],
      },
      topics: [
        {
          sourcePath,
          id: topicId,
          title: 'Queue',
          childTopicIds: [],
          markdownBody: '![Elements entering and leaving a queue](./queue-operations.svg)',
        },
      ],
    };

    const firstResult = await transformContent(contentSource, firstOutputRoot);
    const secondResult = await transformContent(contentSource, secondOutputRoot);
    const firstAssetDirectory = join(firstOutputRoot, 'assets', 'topics', topicId);
    const secondAssetDirectory = join(secondOutputRoot, 'assets', 'topics', topicId);

    expect(secondResult).toEqual(firstResult);
    await expect(readdir(firstAssetDirectory)).resolves.toEqual([expectedFilename]);
    await expect(readdir(secondAssetDirectory)).resolves.toEqual([expectedFilename]);
    await expect(readFile(join(firstAssetDirectory, expectedFilename))).resolves.toEqual(
      await readFile(join(secondAssetDirectory, expectedFilename)),
    );
  });
});

describe('HTML_SANITIZATION_SCHEMA', () => {
  // Markdown validation normally rejects these documents before conversion. This
  // exercises the sanitization boundary on its own, so it keeps protecting the
  // generated HTML even if an upstream check is changed.
  function sanitize(markdown: string): string {
    return String(
      unified()
        .use(remarkParse)
        .use(remarkRehype)
        .use(rehypeSanitize, HTML_SANITIZATION_SCHEMA)
        .use(rehypeStringify)
        .processSync(markdown),
    );
  }

  it('keeps a generated site-relative image source', () => {
    expect(sanitize('![Queue operations](/assets/topics/queue/diagram.abc123def456.svg)')).toBe(
      '<p><img src="/assets/topics/queue/diagram.abc123def456.svg" alt="Queue operations"></p>',
    );
  });

  it.each([
    { protocol: 'data', url: 'data:image/svg+xml;base64,PHN2Zz48L3N2Zz4=' },
    { protocol: 'javascript', url: 'javascript:alert(1)' },
  ])('removes a $protocol image source', ({ url }) => {
    expect(sanitize(`![Queue operations](${url})`)).toBe('<p><img alt="Queue operations"></p>');
  });

  it('keeps an absolute HTTPS link', () => {
    expect(sanitize('[Queue reference](https://example.com/queue)')).toBe(
      '<p><a href="https://example.com/queue">Queue reference</a></p>',
    );
  });

  it.each([
    { protocol: 'javascript', url: 'javascript:alert(1)' },
    // The protocol comparison is case-sensitive, which is why Markdown validation
    // rejects an uppercase scheme rather than emitting an anchor with no destination.
    { protocol: 'uppercase HTTPS', url: 'HTTPS://EXAMPLE.COM/queue' },
  ])('removes a $protocol link destination', ({ url }) => {
    expect(sanitize(`[Queue reference](${url})`)).toBe('<p><a>Queue reference</a></p>');
  });
});

import { afterEach, describe, expect, it } from 'vitest';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { chdir, cwd } from 'node:process';
import { loadContentSource } from './load-content-source.ts';
import { transformContent } from './transform-content.ts';
import { validateContentGraph } from './validate-content-graph.ts';

const javaTopicId = '11111111-1111-4111-8111-111111111111';
const queueTopicId = '33333333-3333-4333-8333-333333333333';
const svg = '<svg xmlns="http://www.w3.org/2000/svg"></svg>\n';
const assetFilename = 'queue-operations.7b3bba3ed45b.svg';

const expectedTransformedTopics = [
  {
    contentOutline: [],
    id: javaTopicId,
    mainContentHtml: null,
  },
  {
    contentOutline: [],
    id: queueTopicId,
    mainContentHtml: [
      '<p>A queue processes elements in a defined order.</p>',
      `<p><img src="/assets/topics/${queueTopicId}/${assetFilename}" alt="Elements entering and leaving a queue"></p>`,
    ].join('\n'),
  },
];

async function writeContentTree(sourceRoot: string): Promise<void> {
  const javaDirectory = join(sourceRoot, 'topics', 'java');
  const queueDirectory = join(sourceRoot, 'topics', 'queue');

  await mkdir(javaDirectory, { recursive: true });
  await mkdir(queueDirectory, { recursive: true });

  await writeFile(
    join(sourceRoot, 'catalog.yaml'),
    ['landingTopicIds:', `  - "${javaTopicId}"`, ''].join('\n'),
  );

  await writeFile(
    join(javaDirectory, 'topic.md'),
    [
      '---',
      `id: "${javaTopicId}"`,
      'title: "Java"',
      'summary: "Core language and platform concepts."',
      'iconKey: "java"',
      'domains:',
      '  - "java"',
      'kind: "area"',
      'childTopicIds:',
      `  - "${queueTopicId}"`,
      'relatedTopicIds: []',
      '---',
      '',
    ].join('\n'),
  );

  await writeFile(
    join(queueDirectory, 'topic.md'),
    [
      '---',
      `id: "${queueTopicId}"`,
      'title: "Queue"',
      'domains:',
      '  - "java"',
      '  - "collections"',
      'kind: "concept"',
      'childTopicIds: []',
      'relatedTopicIds: []',
      '---',
      '',
      'A queue processes elements in a defined order.',
      '',
      '![Elements entering and leaving a queue](./queue-operations.svg)',
      '',
    ].join('\n'),
  );

  await writeFile(join(queueDirectory, 'queue-operations.svg'), svg);
}

describe('content pipeline', () => {
  const originalWorkingDirectory = cwd();
  let temporaryRoot: string | undefined;

  afterEach(async () => {
    chdir(originalWorkingDirectory);

    if (temporaryRoot !== undefined) {
      await rm(temporaryRoot, {
        recursive: true,
        force: true,
      });
    }
  });

  it('loads, graph-validates, and transforms an authored content tree', async () => {
    temporaryRoot = await mkdtemp(join(tmpdir(), 'engineering-reference-pipeline-'));

    const sourceRoot = join(temporaryRoot, 'content');
    const generatedRoot = join(temporaryRoot, '.generated');

    await writeContentTree(sourceRoot);

    const contentSource = validateContentGraph(await loadContentSource(sourceRoot));

    expect(contentSource.catalog.landingTopicIds).toEqual([javaTopicId]);
    expect(contentSource.topics.map((topic) => topic.title)).toEqual(['Java', 'Queue']);
    expect(contentSource.topics[0]).toMatchObject({
      summary: 'Core language and platform concepts.',
      iconKey: 'java',
    });

    await expect(transformContent(contentSource, generatedRoot)).resolves.toEqual(
      expectedTransformedTopics,
    );

    await expect(
      readFile(join(generatedRoot, 'assets', 'topics', queueTopicId, assetFilename), 'utf8'),
    ).resolves.toBe(svg);
  });

  // A generator run from the repository root passes a relative source root, so
  // discovery records relative Topic paths. Those must resolve against the working
  // directory rather than being joined to a source root a second time.
  it('loads and transforms through a relative source root', async () => {
    temporaryRoot = await mkdtemp(join(tmpdir(), 'engineering-reference-pipeline-'));

    await writeContentTree(join(temporaryRoot, 'content'));

    chdir(temporaryRoot);

    const contentSource = validateContentGraph(await loadContentSource('content'));

    expect(contentSource.topics.map((topic) => topic.sourcePath)).toEqual([
      join('content', 'topics', 'java', 'topic.md'),
      join('content', 'topics', 'queue', 'topic.md'),
    ]);

    await expect(transformContent(contentSource, '.generated')).resolves.toEqual(
      expectedTransformedTopics,
    );

    await expect(
      readFile(
        join(temporaryRoot, '.generated', 'assets', 'topics', queueTopicId, assetFilename),
        'utf8',
      ),
    ).resolves.toBe(svg);
  });

  it('reports a Topic directory without topic.md rather than skipping it silently', async () => {
    temporaryRoot = await mkdtemp(join(tmpdir(), 'engineering-reference-pipeline-'));

    const sourceRoot = join(temporaryRoot, 'content');
    const incompleteDirectory = join(sourceRoot, 'topics', 'incomplete');

    await writeContentTree(sourceRoot);
    await mkdir(incompleteDirectory, { recursive: true });
    await writeFile(join(incompleteDirectory, 'diagram.svg'), svg);

    let thrownError: unknown;

    try {
      await loadContentSource(sourceRoot);
    } catch (error: unknown) {
      thrownError = error;
    }

    expect(thrownError).toBeInstanceOf(AggregateError);
    expect(
      (thrownError as AggregateError).errors.map((error: unknown) =>
        error instanceof Error ? error.message : String(error),
      ),
    ).toEqual([`${incompleteDirectory}: Topic directory does not contain topic.md`]);
  });

  it('accepts a Topic that no landing Topic can reach', async () => {
    temporaryRoot = await mkdtemp(join(tmpdir(), 'engineering-reference-pipeline-'));

    const sourceRoot = join(temporaryRoot, 'content');
    const orphanDirectory = join(sourceRoot, 'topics', 'orphan');

    await writeContentTree(sourceRoot);
    await mkdir(orphanDirectory, { recursive: true });

    await writeFile(
      join(orphanDirectory, 'topic.md'),
      [
        '---',
        'id: "55555555-5555-4555-8555-555555555555"',
        'title: "Orphan"',
        'domains:',
        '  - "java"',
        'kind: "concept"',
        'childTopicIds: []',
        'relatedTopicIds: []',
        '---',
        '',
        'Orphan content.',
        '',
      ].join('\n'),
    );

    const contentSource = await loadContentSource(sourceRoot);

    expect(contentSource.topics.map((topic) => topic.title)).toEqual(['Java', 'Orphan', 'Queue']);

    expect(validateContentGraph(contentSource)).toBe(contentSource);
  });
});

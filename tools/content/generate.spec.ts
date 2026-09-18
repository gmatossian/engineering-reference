import { createHash } from 'node:crypto';
import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, relative } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import type {
  RuntimeCatalog,
  TopicDomainKey,
  TopicIconKey,
  TopicKindKey,
} from '../../contracts/runtime-catalog.ts';
import type { LoadedContentSource } from './load-content-source.ts';
import { createRuntimeCatalog, generateContent, serializeRuntimeCatalog } from './generate.ts';

const javaTopicId = 'd3ef7c8b-ee6b-48f5-9039-2aa94d03c19c';
const collectionsTopicId = 'c29c5725-0b1f-480d-88f4-5c9d3b7f0dc5';
const queueTopicId = '8cbea92a-606e-4ed3-839c-c7fff67f0909';
const complexityTopicId = 'bf417331-9329-42b4-9517-351ef6af3b85';
const imageBytes = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"></svg>\n');

async function writeTopic(
  sourceRoot: string,
  directoryName: string,
  metadata: {
    id: string;
    title: string;
    summary?: string;
    iconKey?: TopicIconKey;
    domains: readonly TopicDomainKey[];
    kind: TopicKindKey;
    childTopicIds: readonly string[];
    relatedTopicIds: readonly string[];
  },
  markdownBody = '',
): Promise<void> {
  const topicDirectory = join(sourceRoot, 'topics', directoryName);

  await mkdir(topicDirectory, { recursive: true });
  await writeFile(
    join(topicDirectory, 'topic.md'),
    [
      '---',
      `id: "${metadata.id}"`,
      `title: "${metadata.title}"`,
      ...(metadata.summary === undefined ? [] : [`summary: "${metadata.summary}"`]),
      ...(metadata.iconKey === undefined ? [] : [`iconKey: "${metadata.iconKey}"`]),
      'domains:',
      ...metadata.domains.map((domain) => `  - "${domain}"`),
      `kind: "${metadata.kind}"`,
      ...(metadata.childTopicIds.length === 0
        ? ['childTopicIds: []']
        : [
            'childTopicIds:',
            ...metadata.childTopicIds.map((childTopicId) => `  - "${childTopicId}"`),
          ]),
      ...(metadata.relatedTopicIds.length === 0
        ? ['relatedTopicIds: []']
        : [
            'relatedTopicIds:',
            ...metadata.relatedTopicIds.map((relatedTopicId) => `  - "${relatedTopicId}"`),
          ]),
      '---',
      markdownBody,
    ].join('\n'),
  );
}

async function writeContentFixture(sourceRoot: string): Promise<void> {
  await mkdir(sourceRoot, { recursive: true });
  await writeFile(
    join(sourceRoot, 'catalog.yaml'),
    ['landingTopicIds:', `  - "${javaTopicId}"`, ''].join('\n'),
  );

  await writeTopic(sourceRoot, 'java', {
    id: javaTopicId,
    title: 'Java',
    summary: 'Core language and platform concepts.',
    iconKey: 'java',
    domains: ['java'],
    kind: 'area',
    childTopicIds: [collectionsTopicId],
    relatedTopicIds: [],
  });
  await writeTopic(
    sourceRoot,
    'collections',
    {
      id: collectionsTopicId,
      title: 'Collections',
      iconKey: 'collection',
      domains: ['collections', 'java'],
      kind: 'concept',
      childTopicIds: [queueTopicId],
      relatedTopicIds: [],
    },
    '\nCollections group objects.\n',
  );
  await writeTopic(
    sourceRoot,
    'queue',
    {
      id: queueTopicId,
      title: 'Queue',
      iconKey: 'queue',
      domains: ['algorithms-data-structures', 'collections', 'java'],
      kind: 'concept',
      childTopicIds: [complexityTopicId],
      relatedTopicIds: [javaTopicId, collectionsTopicId],
    },
    '\n![Queue operations](./queue.svg)\n',
  );
  await writeFile(join(sourceRoot, 'topics', 'queue', 'queue.svg'), imageBytes);
  await writeTopic(
    sourceRoot,
    'queue-complexity',
    {
      id: complexityTopicId,
      title: 'Complexity',
      domains: ['algorithms-data-structures', 'collections'],
      kind: 'concept',
      childTopicIds: [],
      relatedTopicIds: [queueTopicId],
    },
    '\n| Operation | Complexity |\n| --- | --- |\n| `offer` | O(1) |\n',
  );
}

async function readOutputTree(root: string): Promise<Record<string, string>> {
  const output: Record<string, string> = {};

  async function visit(directory: string): Promise<void> {
    const entries = await readdir(directory, { withFileTypes: true });

    entries.sort((left, right) => left.name.localeCompare(right.name));

    for (const entry of entries) {
      const entryPath = join(directory, entry.name);

      if (entry.isDirectory()) {
        await visit(entryPath);
      } else {
        output[relative(root, entryPath)] = (await readFile(entryPath)).toString('base64');
      }
    }
  }

  await visit(root);

  return output;
}

describe('createRuntimeCatalog', () => {
  it('orders derived Topic and reverse-parent indexes by title and then UUID', () => {
    const alphaLowId = '11111111-1111-4111-8111-111111111111';
    const alphaHighId = '22222222-2222-4222-8222-222222222222';
    const childId = '33333333-3333-4333-8333-333333333333';
    const zuluId = '44444444-4444-4444-8444-444444444444';
    const topics: LoadedContentSource['topics'] = [
      {
        sourcePath: 'content/topics/zulu/topic.md',
        id: zuluId,
        title: 'Zulu',
        domains: ['java'],
        kind: 'concept',
        childTopicIds: [childId],
        relatedTopicIds: [],
        markdownBody: 'Zulu content.',
      },
      {
        sourcePath: 'content/topics/alpha-high/topic.md',
        id: alphaHighId,
        title: 'alpha',
        domains: ['java'],
        kind: 'concept',
        childTopicIds: [childId],
        relatedTopicIds: [],
        markdownBody: 'Alpha content.',
      },
      {
        sourcePath: 'content/topics/child/topic.md',
        id: childId,
        title: 'Child',
        domains: ['java'],
        kind: 'concept',
        childTopicIds: [],
        relatedTopicIds: [],
        markdownBody: 'Child content.',
      },
      {
        sourcePath: 'content/topics/alpha-low/topic.md',
        id: alphaLowId,
        title: 'Alpha',
        domains: ['java'],
        kind: 'concept',
        childTopicIds: [childId],
        relatedTopicIds: [],
        markdownBody: 'Alpha content.',
      },
    ];
    const contentSource: LoadedContentSource = {
      catalog: {
        sourcePath: 'content/catalog.yaml',
        landingTopicIds: [alphaLowId],
      },
      topics,
    };
    const transformedTopics = topics.map((topic) => ({
      id: topic.id,
      mainContentHtml: `<p>${topic.title}</p>`,
    }));

    const catalog = createRuntimeCatalog(contentSource, transformedTopics);

    expect(catalog.allTopicIds).toEqual([alphaLowId, alphaHighId, childId, zuluId]);
    expect(catalog.topicIdsByDomain.java).toEqual([alphaLowId, alphaHighId, childId, zuluId]);
    expect(catalog.parentTopicIdsById[childId]).toEqual([alphaLowId, alphaHighId, zuluId]);
  });
});

describe('generateContent', () => {
  let temporaryRoot: string | undefined;

  afterEach(async () => {
    if (temporaryRoot !== undefined) {
      await rm(temporaryRoot, { recursive: true, force: true });
    }
  });

  it('emits the complete canonical runtime catalog and content-hashed assets', async () => {
    temporaryRoot = await mkdtemp(join(tmpdir(), 'engineering-reference-generator-'));
    const sourceRoot = join(temporaryRoot, 'content');
    const generatedRoot = join(temporaryRoot, '.generated');

    await writeContentFixture(sourceRoot);

    const runtimeCatalog = await generateContent(sourceRoot, generatedRoot);
    const catalogJson = await readFile(join(generatedRoot, 'catalog.json'), 'utf8');
    const parsedCatalog = JSON.parse(catalogJson) as RuntimeCatalog;
    const imageHash = createHash('sha256').update(imageBytes).digest('hex').slice(0, 12);
    const imageFilename = `queue.${imageHash}.svg`;

    expect(catalogJson).toBe(serializeRuntimeCatalog(runtimeCatalog));
    expect(Object.keys(parsedCatalog.topicsById)).toEqual([
      queueTopicId,
      complexityTopicId,
      collectionsTopicId,
      javaTopicId,
    ]);
    expect(parsedCatalog.landingTopicIds).toEqual([javaTopicId]);
    expect(parsedCatalog.allTopicIds).toEqual([
      collectionsTopicId,
      complexityTopicId,
      javaTopicId,
      queueTopicId,
    ]);
    expect(parsedCatalog.topicIdsByDomain).toEqual({
      java: [collectionsTopicId, javaTopicId, queueTopicId],
      collections: [collectionsTopicId, complexityTopicId, queueTopicId],
      concurrency: [],
      persistence: [],
      databases: [],
      http: [],
      'system-design': [],
      'algorithms-data-structures': [complexityTopicId, queueTopicId],
    });
    expect(parsedCatalog.topicIdsByKind).toEqual({
      area: [javaTopicId],
      concept: [collectionsTopicId, complexityTopicId, queueTopicId],
      operations: [],
      'decision-aid': [],
      exercise: [],
      pattern: [],
    });
    expect(parsedCatalog.parentTopicIdsById).toEqual({
      [queueTopicId]: [collectionsTopicId],
      [complexityTopicId]: [queueTopicId],
      [collectionsTopicId]: [javaTopicId],
      [javaTopicId]: [],
    });
    expect(parsedCatalog.topicsById[javaTopicId]).toEqual({
      title: 'Java',
      summary: 'Core language and platform concepts.',
      iconKey: 'java',
      domains: ['java'],
      kind: 'area',
      mainContentHtml: null,
      childTopicIds: [collectionsTopicId],
      relatedTopicIds: [],
    });
    expect(parsedCatalog.topicsById[queueTopicId]).toMatchObject({
      summary: null,
      iconKey: 'queue',
      domains: ['java', 'collections', 'algorithms-data-structures'],
      kind: 'concept',
      relatedTopicIds: [javaTopicId, collectionsTopicId],
    });
    expect(parsedCatalog.topicsById[complexityTopicId]).toMatchObject({
      summary: null,
      iconKey: null,
    });
    expect(parsedCatalog.topicsById[queueTopicId]?.mainContentHtml).toContain(
      `/assets/topics/${queueTopicId}/${imageFilename}`,
    );
    await expect(
      readFile(join(generatedRoot, 'assets', 'topics', queueTopicId, imageFilename)),
    ).resolves.toEqual(imageBytes);
  });

  it('emits byte-identical output trees for identical source', async () => {
    temporaryRoot = await mkdtemp(join(tmpdir(), 'engineering-reference-generator-'));
    const sourceRoot = join(temporaryRoot, 'content');
    const firstGeneratedRoot = join(temporaryRoot, 'first', '.generated');
    const secondGeneratedRoot = join(temporaryRoot, 'second', '.generated');

    await writeContentFixture(sourceRoot);
    await generateContent(sourceRoot, firstGeneratedRoot);
    await generateContent(sourceRoot, secondGeneratedRoot);

    expect(await readOutputTree(secondGeneratedRoot)).toEqual(
      await readOutputTree(firstGeneratedRoot),
    );
  });

  it('removes stale files when replacing a successful output tree', async () => {
    temporaryRoot = await mkdtemp(join(tmpdir(), 'engineering-reference-generator-'));
    const sourceRoot = join(temporaryRoot, 'content');
    const generatedRoot = join(temporaryRoot, '.generated');

    await writeContentFixture(sourceRoot);
    await generateContent(sourceRoot, generatedRoot);
    await writeFile(join(generatedRoot, 'stale.json'), '{}\n');

    await generateContent(sourceRoot, generatedRoot);

    await expect(readFile(join(generatedRoot, 'stale.json'))).rejects.toMatchObject({
      code: 'ENOENT',
    });
  });

  it('preserves the last successful output tree when later generation fails', async () => {
    temporaryRoot = await mkdtemp(join(tmpdir(), 'engineering-reference-generator-'));
    const sourceRoot = join(temporaryRoot, 'content');
    const generatedRoot = join(temporaryRoot, '.generated');

    await writeContentFixture(sourceRoot);
    await generateContent(sourceRoot, generatedRoot);

    const successfulOutput = await readOutputTree(generatedRoot);

    await writeTopic(
      sourceRoot,
      'queue',
      {
        id: queueTopicId,
        title: 'Queue',
        domains: ['java'],
        kind: 'concept',
        childTopicIds: [complexityTopicId],
        relatedTopicIds: [],
      },
      ['', '![Queue operations](./queue.svg)', '', '![Missing diagram](./missing.svg)', ''].join(
        '\n',
      ),
    );

    await expect(generateContent(sourceRoot, generatedRoot)).rejects.toThrow(
      'Content transformation failed',
    );
    expect(await readOutputTree(generatedRoot)).toEqual(successfulOutput);
    expect(
      (await readdir(temporaryRoot)).filter(
        (entry) =>
          entry.startsWith('..generated.staging-') || entry.startsWith('..generated.backup-'),
      ),
    ).toEqual([]);
  });
});

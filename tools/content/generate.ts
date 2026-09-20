import { randomUUID } from 'node:crypto';
import { lstat, mkdir, mkdtemp, rename, rm, writeFile } from 'node:fs/promises';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import {
  TOPIC_DOMAIN_KEYS,
  TOPIC_KIND_KEYS,
  type RuntimeCatalog,
  type RuntimeTopic,
  type TopicDomainKey,
  type TopicKindKey,
} from '../../contracts/runtime-catalog.ts';
import type { LoadedContentSource } from './load-content-source.ts';
import { loadContentSource } from './load-content-source.ts';
import type { TransformedTopicContent } from './transform-content.ts';
import { transformContent } from './transform-content.ts';
import { validateContentGraph } from './validate-content-graph.ts';

function isErrorWithCode(error: unknown, code: string): boolean {
  return error instanceof Error && 'code' in error && error.code === code;
}

function compareInCodePointOrder(left: string, right: string): number {
  const leftCodePoints = Array.from(left, (character) => character.codePointAt(0) ?? -1);
  const rightCodePoints = Array.from(right, (character) => character.codePointAt(0) ?? -1);
  const sharedLength = Math.min(leftCodePoints.length, rightCodePoints.length);

  for (let index = 0; index < sharedLength; index += 1) {
    const difference = leftCodePoints[index] - rightCodePoints[index];

    if (difference !== 0) {
      return difference;
    }
  }

  return leftCodePoints.length - rightCodePoints.length;
}

function compareTopicsByTitleThenId(
  left: LoadedContentSource['topics'][number],
  right: LoadedContentSource['topics'][number],
): number {
  const titleComparison = compareInCodePointOrder(
    left.title.toLowerCase(),
    right.title.toLowerCase(),
  );

  return titleComparison === 0 ? compareInCodePointOrder(left.id, right.id) : titleComparison;
}

function createCompleteIndex<Key extends string>(
  keys: readonly Key[],
  topics: LoadedContentSource['topics'],
  includes: (topic: LoadedContentSource['topics'][number], key: Key) => boolean,
): Record<Key, readonly string[]> {
  const index = {} as Record<Key, readonly string[]>;

  for (const key of keys) {
    index[key] = topics.filter((topic) => includes(topic, key)).map((topic) => topic.id);
  }

  return index;
}

export function createRuntimeCatalog(
  contentSource: LoadedContentSource,
  transformedTopics: readonly TransformedTopicContent[],
): RuntimeCatalog {
  const transformedTopicById = new Map(transformedTopics.map((topic) => [topic.id, topic]));

  const topicsById: Record<string, RuntimeTopic> = {};
  const topicsInCanonicalOrder = [...contentSource.topics].sort((left, right) =>
    compareInCodePointOrder(left.id, right.id),
  );
  const topicsInTitleOrder = [...contentSource.topics].sort(compareTopicsByTitleThenId);
  const domainOrder = new Map<TopicDomainKey, number>(
    TOPIC_DOMAIN_KEYS.map((domain, index) => [domain, index]),
  );

  for (const topic of topicsInCanonicalOrder) {
    const transformedTopic = transformedTopicById.get(topic.id);

    if (transformedTopic === undefined) {
      throw new Error(`Missing transformed content for Topic ${topic.id}`);
    }

    topicsById[topic.id] = {
      title: topic.title,
      summary: topic.summary ?? null,
      iconKey: topic.iconKey ?? null,
      domains: [...topic.domains].sort(
        (left, right) => (domainOrder.get(left) ?? -1) - (domainOrder.get(right) ?? -1),
      ),
      kind: topic.kind,
      mainContentHtml: transformedTopic.mainContentHtml,
      contentOutline: transformedTopic.contentOutline,
      childTopicIds: [...topic.childTopicIds],
      relatedTopicIds: [...topic.relatedTopicIds],
    };
  }

  const parentTopicsByChildId = new Map<string, LoadedContentSource['topics']>();

  for (const parentTopic of contentSource.topics) {
    for (const childTopicId of parentTopic.childTopicIds) {
      const parents = parentTopicsByChildId.get(childTopicId) ?? [];

      parents.push(parentTopic);
      parentTopicsByChildId.set(childTopicId, parents);
    }
  }

  const parentTopicIdsById: Record<string, readonly string[]> = {};

  for (const topic of topicsInCanonicalOrder) {
    parentTopicIdsById[topic.id] = [...(parentTopicsByChildId.get(topic.id) ?? [])]
      .sort(compareTopicsByTitleThenId)
      .map((parentTopic) => parentTopic.id);
  }

  return {
    landingTopicIds: [...contentSource.catalog.landingTopicIds],
    allTopicIds: topicsInTitleOrder.map((topic) => topic.id),
    topicIdsByDomain: createCompleteIndex<TopicDomainKey>(
      TOPIC_DOMAIN_KEYS,
      topicsInTitleOrder,
      (topic, domain) => topic.domains.includes(domain),
    ),
    topicIdsByKind: createCompleteIndex<TopicKindKey>(
      TOPIC_KIND_KEYS,
      topicsInTitleOrder,
      (topic, kind) => topic.kind === kind,
    ),
    parentTopicIdsById,
    topicsById,
  };
}

export function serializeRuntimeCatalog(runtimeCatalog: RuntimeCatalog): string {
  return `${JSON.stringify(runtimeCatalog, null, 2)}\n`;
}

async function pathExists(path: string): Promise<boolean> {
  try {
    await lstat(path);
    return true;
  } catch (error: unknown) {
    if (isErrorWithCode(error, 'ENOENT')) {
      return false;
    }

    throw error;
  }
}

async function replaceGeneratedOutput(stagingRoot: string, generatedRoot: string): Promise<void> {
  const backupRoot = join(
    dirname(generatedRoot),
    `.${basename(generatedRoot)}.backup-${randomUUID()}`,
  );
  const hadPreviousOutput = await pathExists(generatedRoot);

  if (hadPreviousOutput) {
    await rename(generatedRoot, backupRoot);
  }

  try {
    await rename(stagingRoot, generatedRoot);
  } catch (replacementError: unknown) {
    if (!hadPreviousOutput) {
      throw replacementError;
    }

    try {
      await rename(backupRoot, generatedRoot);
    } catch (restorationError: unknown) {
      throw new AggregateError(
        [replacementError, restorationError],
        'Generated output replacement and restoration both failed',
        { cause: restorationError },
      );
    }

    throw replacementError;
  }

  if (hadPreviousOutput) {
    try {
      await rm(backupRoot, { recursive: true, force: true });
    } catch (cleanupError: unknown) {
      try {
        await rename(generatedRoot, stagingRoot);
        await rename(backupRoot, generatedRoot);
      } catch (restorationError: unknown) {
        throw new AggregateError(
          [cleanupError, restorationError],
          'Generated output cleanup and restoration both failed',
          { cause: restorationError },
        );
      }

      throw cleanupError;
    }
  }
}

export async function generateContent(
  sourceRoot: string,
  generatedRoot: string,
): Promise<RuntimeCatalog> {
  const generatedParent = dirname(generatedRoot);

  await mkdir(generatedParent, { recursive: true });

  const stagingRoot = await mkdtemp(join(generatedParent, `.${basename(generatedRoot)}.staging-`));
  let stagingOutputExists = true;

  try {
    const contentSource = validateContentGraph(await loadContentSource(sourceRoot));

    await mkdir(join(stagingRoot, 'assets'), { recursive: true });

    const transformedTopics = await transformContent(contentSource, stagingRoot);
    const runtimeCatalog = createRuntimeCatalog(contentSource, transformedTopics);

    await writeFile(join(stagingRoot, 'catalog.json'), serializeRuntimeCatalog(runtimeCatalog));
    await replaceGeneratedOutput(stagingRoot, generatedRoot);
    stagingOutputExists = false;

    return runtimeCatalog;
  } finally {
    if (stagingOutputExists) {
      await rm(stagingRoot, { recursive: true, force: true });
    }
  }
}

function isDirectExecution(): boolean {
  const executedPath = process.argv[1];

  return (
    executedPath !== undefined && pathToFileURL(resolve(executedPath)).href === import.meta.url
  );
}

if (isDirectExecution()) {
  const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
  const sourceRoot = process.env['ENGINEERING_REFERENCE_CONTENT_ROOT'];

  await generateContent(
    sourceRoot === undefined ? join(projectRoot, 'content') : resolve(projectRoot, sourceRoot),
    join(projectRoot, '.generated'),
  );
}

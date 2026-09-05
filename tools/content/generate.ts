import { randomUUID } from 'node:crypto';
import { lstat, mkdir, mkdtemp, rename, rm, writeFile } from 'node:fs/promises';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import type { RuntimeCatalog, RuntimeTopic } from '../../contracts/runtime-catalog.ts';
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

export function createRuntimeCatalog(
  contentSource: LoadedContentSource,
  transformedTopics: readonly TransformedTopicContent[],
): RuntimeCatalog {
  const mainContentHtmlByTopicId = new Map(
    transformedTopics.map((topic) => [topic.id, topic.mainContentHtml]),
  );

  const topicsById: Record<string, RuntimeTopic> = {};
  const topicsInCanonicalOrder = [...contentSource.topics].sort((left, right) =>
    compareInCodePointOrder(left.id, right.id),
  );

  for (const topic of topicsInCanonicalOrder) {
    if (!mainContentHtmlByTopicId.has(topic.id)) {
      throw new Error(`Missing transformed content for Topic ${topic.id}`);
    }

    topicsById[topic.id] = {
      title: topic.title,
      mainContentHtml: mainContentHtmlByTopicId.get(topic.id) ?? null,
      childTopicIds: [...topic.childTopicIds],
    };
  }

  return {
    landingTopicIds: [...contentSource.catalog.landingTopicIds],
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

  await generateContent(join(projectRoot, 'content'), join(projectRoot, '.generated'));
}

import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { discoverTopicSourcePaths } from './discover-topic-source-paths.ts';
import type { ParsedCatalogSource } from './parse-catalog-source.ts';
import { parseCatalogSource } from './parse-catalog-source.ts';
import { parseTopicSource } from './parse-topic-source.ts';
import type { TopicSource } from './validate-topic-source.ts';
import { validateTopicSource } from './validate-topic-source.ts';

function toError(error: unknown): Error {
  return error instanceof Error ? error : new Error(String(error));
}

export interface LoadedContentSource {
  catalog: ParsedCatalogSource;
  topics: TopicSource[];
}

export async function loadContentSource(sourceRoot: string): Promise<LoadedContentSource> {
  const errors: Error[] = [];

  const catalogPath = join(sourceRoot, 'catalog.yaml');
  let catalog: ParsedCatalogSource | undefined;

  try {
    const catalogText = await readFile(catalogPath, 'utf8');
    catalog = parseCatalogSource(catalogPath, catalogText);
  } catch (error: unknown) {
    errors.push(toError(error));
  }

  let topicPaths: string[] = [];

  try {
    topicPaths = await discoverTopicSourcePaths(sourceRoot);
  } catch (error: unknown) {
    errors.push(toError(error));
  }

  const topics: TopicSource[] = [];

  for (const topicPath of topicPaths) {
    try {
      const sourceText = await readFile(topicPath, 'utf8');
      const parsedSource = parseTopicSource(topicPath, sourceText);

      topics.push(validateTopicSource(topicPath, parsedSource));
    } catch (error: unknown) {
      errors.push(toError(error));
    }
  }

  if (catalog === undefined || errors.length > 0) {
    throw new AggregateError(
      errors,
      `Content source loading failed with ${errors.length} error(s)`,
    );
  }

  return {
    catalog,
    topics,
  };
}

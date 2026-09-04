import { readdir } from 'node:fs/promises';
import { join } from 'node:path';

function compareInCodePointOrder(left: string, right: string): number {
  if (left < right) {
    return -1;
  }

  if (left > right) {
    return 1;
  }

  return 0;
}

export async function discoverTopicSourcePaths(sourceRoot: string): Promise<string[]> {
  const topicsRoot = join(sourceRoot, 'topics');
  const entries = await readdir(topicsRoot, {
    withFileTypes: true,
  });

  const directoryNames = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort(compareInCodePointOrder);

  const topicSourcePaths: string[] = [];

  for (const directoryName of directoryNames) {
    const topicDirectory = join(topicsRoot, directoryName);
    const topicDirectoryEntries = await readdir(topicDirectory, {
      withFileTypes: true,
    });

    const containsTopicSource = topicDirectoryEntries.some(
      (entry) => entry.isFile() && entry.name === 'topic.md',
    );

    if (containsTopicSource) {
      topicSourcePaths.push(join(topicDirectory, 'topic.md'));
    }
  }

  return topicSourcePaths;
}

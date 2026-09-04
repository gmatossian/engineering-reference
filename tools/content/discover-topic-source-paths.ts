import { readdir } from 'node:fs/promises';
import { join } from 'node:path';

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

export interface DiscoveredTopicSources {
  topicSourcePaths: string[];
  errors: Error[];
}

export async function discoverTopicSourcePaths(
  sourceRoot: string,
): Promise<DiscoveredTopicSources> {
  const topicsRoot = join(sourceRoot, 'topics');
  const entries = await readdir(topicsRoot, {
    withFileTypes: true,
  });

  const directoryNames = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort(compareInCodePointOrder);

  const topicSourcePaths: string[] = [];
  const errors: Error[] = [];

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
    } else {
      // Every directory under content/topics is a Topic. Reporting the omission here
      // keeps the diagnostic on the directory rather than surfacing later as an
      // unresolved reference from some other Topic.
      errors.push(new Error(`${topicDirectory}: Topic directory does not contain topic.md`));
    }
  }

  return {
    topicSourcePaths,
    errors,
  };
}

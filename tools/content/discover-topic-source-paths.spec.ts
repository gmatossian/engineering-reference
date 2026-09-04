import { afterEach, describe, expect, it } from 'vitest';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { discoverTopicSourcePaths } from './discover-topic-source-paths.ts';

describe('discoverTopicSourcePaths', () => {
  let temporaryRoot: string | undefined;

  afterEach(async () => {
    if (temporaryRoot !== undefined) {
      await rm(temporaryRoot, {
        recursive: true,
        force: true,
      });
    }
  });

  it('discovers Topic files in deterministic code-point order', async () => {
    // UTF-16 comparison reverses these two relative to Unicode code-point order.
    const privateUseDirectory = '\uE000';
    const supplementaryDirectory = '\u{10000}';

    temporaryRoot = await mkdtemp(join(tmpdir(), 'engineering-reference-content-'));

    await mkdir(join(temporaryRoot, 'topics', 'zeta'), {
      recursive: true,
    });
    await mkdir(join(temporaryRoot, 'topics', 'alpha'), {
      recursive: true,
    });
    await mkdir(join(temporaryRoot, 'topics', privateUseDirectory), {
      recursive: true,
    });
    await mkdir(join(temporaryRoot, 'topics', supplementaryDirectory), {
      recursive: true,
    });

    await writeFile(join(temporaryRoot, 'topics', 'zeta', 'topic.md'), '');
    await writeFile(join(temporaryRoot, 'topics', 'alpha', 'topic.md'), '');
    await writeFile(join(temporaryRoot, 'topics', privateUseDirectory, 'topic.md'), '');
    await writeFile(join(temporaryRoot, 'topics', supplementaryDirectory, 'topic.md'), '');
    await writeFile(join(temporaryRoot, 'topics', 'README.md'), '');

    await expect(discoverTopicSourcePaths(temporaryRoot)).resolves.toEqual({
      topicSourcePaths: [
        join(temporaryRoot, 'topics', 'alpha', 'topic.md'),
        join(temporaryRoot, 'topics', 'zeta', 'topic.md'),
        join(temporaryRoot, 'topics', privateUseDirectory, 'topic.md'),
        join(temporaryRoot, 'topics', supplementaryDirectory, 'topic.md'),
      ],
      errors: [],
    });
  });

  it('reports every Topic directory that does not contain topic.md', async () => {
    temporaryRoot = await mkdtemp(join(tmpdir(), 'engineering-reference-content-'));

    await mkdir(join(temporaryRoot, 'topics', 'queue'), { recursive: true });
    await mkdir(join(temporaryRoot, 'topics', 'stack'), { recursive: true });
    await mkdir(join(temporaryRoot, 'topics', 'tree'), { recursive: true });

    await writeFile(join(temporaryRoot, 'topics', 'queue', 'topic.md'), '');
    // A misnamed source file must not be mistaken for an intentionally empty directory.
    await writeFile(join(temporaryRoot, 'topics', 'stack', 'Topic.md'), '');
    await writeFile(join(temporaryRoot, 'topics', 'tree', 'diagram.svg'), '');

    const discovered = await discoverTopicSourcePaths(temporaryRoot);

    expect(discovered.topicSourcePaths).toEqual([
      join(temporaryRoot, 'topics', 'queue', 'topic.md'),
    ]);
    expect(discovered.errors.map((error) => error.message)).toEqual([
      `${join(temporaryRoot, 'topics', 'stack')}: Topic directory does not contain topic.md`,
      `${join(temporaryRoot, 'topics', 'tree')}: Topic directory does not contain topic.md`,
    ]);
  });
});

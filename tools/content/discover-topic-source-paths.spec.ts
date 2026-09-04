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

    await expect(discoverTopicSourcePaths(temporaryRoot)).resolves.toEqual([
      join(temporaryRoot, 'topics', 'alpha', 'topic.md'),
      join(temporaryRoot, 'topics', 'zeta', 'topic.md'),
      join(temporaryRoot, 'topics', privateUseDirectory, 'topic.md'),
      join(temporaryRoot, 'topics', supplementaryDirectory, 'topic.md'),
    ]);
  });
});

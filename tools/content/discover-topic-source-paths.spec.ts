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
    temporaryRoot = await mkdtemp(join(tmpdir(), 'engineering-reference-content-'));

    await mkdir(join(temporaryRoot, 'topics', 'zeta'), {
      recursive: true,
    });
    await mkdir(join(temporaryRoot, 'topics', 'alpha'), {
      recursive: true,
    });

    await writeFile(join(temporaryRoot, 'topics', 'zeta', 'topic.md'), '');
    await writeFile(join(temporaryRoot, 'topics', 'alpha', 'topic.md'), '');
    await writeFile(join(temporaryRoot, 'topics', 'README.md'), '');

    await expect(discoverTopicSourcePaths(temporaryRoot)).resolves.toEqual([
      join(temporaryRoot, 'topics', 'alpha', 'topic.md'),
      join(temporaryRoot, 'topics', 'zeta', 'topic.md'),
    ]);
  });
});

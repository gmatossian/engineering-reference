import { afterEach, describe, expect, it } from 'vitest';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { loadContentSource } from './load-content-source.ts';

describe('loadContentSource', () => {
  let temporaryRoot: string | undefined;

  afterEach(async () => {
    if (temporaryRoot !== undefined) {
      await rm(temporaryRoot, {
        recursive: true,
        force: true,
      });
    }
  });

  it('loads a validated catalog and its Topic sources', async () => {
    const topicId = '11111111-1111-4111-8111-111111111111';

    temporaryRoot = await mkdtemp(join(tmpdir(), 'engineering-reference-content-'));

    const topicDirectory = join(temporaryRoot, 'topics', 'queue');
    const catalogPath = join(temporaryRoot, 'catalog.yaml');
    const topicPath = join(topicDirectory, 'topic.md');

    await mkdir(topicDirectory, { recursive: true });

    await writeFile(catalogPath, ['landingTopicIds:', `  - "${topicId}"`, ''].join('\n'));

    await writeFile(
      topicPath,
      [
        '---',
        `id: "${topicId}"`,
        'title: "Queue"',
        'childTopicIds: []',
        '---',
        '',
        'Queue content.',
        '',
      ].join('\n'),
    );

    await expect(loadContentSource(temporaryRoot)).resolves.toEqual({
      catalog: {
        sourcePath: catalogPath,
        landingTopicIds: [topicId],
      },
      topics: [
        {
          sourcePath: topicPath,
          id: topicId,
          title: 'Queue',
          childTopicIds: [],
          markdownBody: '\nQueue content.\n',
        },
      ],
    });
  });

  it('aggregates errors from independently invalid Topic files', async () => {
    temporaryRoot = await mkdtemp(join(tmpdir(), 'engineering-reference-content-'));

    const alphaDirectory = join(temporaryRoot, 'topics', 'alpha');
    const zetaDirectory = join(temporaryRoot, 'topics', 'zeta');
    const alphaPath = join(alphaDirectory, 'topic.md');
    const zetaPath = join(zetaDirectory, 'topic.md');

    await mkdir(alphaDirectory, { recursive: true });
    await mkdir(zetaDirectory, { recursive: true });

    await writeFile(join(temporaryRoot, 'catalog.yaml'), 'landingTopicIds: []\n');

    await writeFile(
      alphaPath,
      [
        '---',
        'id: "invalid-alpha-id"',
        'title: "Alpha"',
        'childTopicIds: []',
        '---',
        '',
        'Alpha content.',
        '',
      ].join('\n'),
    );

    await writeFile(
      zetaPath,
      [
        '---',
        'id: "invalid-zeta-id"',
        'title: "Zeta"',
        'childTopicIds: []',
        '---',
        '',
        'Zeta content.',
        '',
      ].join('\n'),
    );

    let thrownError: unknown;

    try {
      await loadContentSource(temporaryRoot);
    } catch (error: unknown) {
      thrownError = error;
    }

    expect(thrownError).toBeInstanceOf(AggregateError);

    const aggregateError = thrownError as AggregateError;
    const messages = aggregateError.errors.map((error: unknown) =>
      error instanceof Error ? error.message : String(error),
    );

    expect(messages).toEqual([
      expect.stringContaining(`${alphaPath}: Invalid Topic metadata: id:`),
      expect.stringContaining(`${zetaPath}: Invalid Topic metadata: id:`),
    ]);
  });

  it('aggregates catalog and Topic errors in one run', async () => {
    temporaryRoot = await mkdtemp(join(tmpdir(), 'engineering-reference-content-'));

    const topicDirectory = join(temporaryRoot, 'topics', 'queue');
    const catalogPath = join(temporaryRoot, 'catalog.yaml');
    const topicPath = join(topicDirectory, 'topic.md');

    await mkdir(topicDirectory, { recursive: true });

    await writeFile(catalogPath, ['landingTopicIds:', '  - "invalid-catalog-id"', ''].join('\n'));

    await writeFile(
      topicPath,
      [
        '---',
        'id: "invalid-topic-id"',
        'title: "Queue"',
        'childTopicIds: []',
        '---',
        '',
        'Queue content.',
        '',
      ].join('\n'),
    );

    let thrownError: unknown;

    try {
      await loadContentSource(temporaryRoot);
    } catch (error: unknown) {
      thrownError = error;
    }

    expect(thrownError).toBeInstanceOf(AggregateError);

    const aggregateError = thrownError as AggregateError;
    const messages = aggregateError.errors.map((error: unknown) =>
      error instanceof Error ? error.message : String(error),
    );

    expect(messages).toEqual([
      expect.stringContaining(`${catalogPath}: Invalid catalog: landingTopicIds.0:`),
      expect.stringContaining(`${topicPath}: Invalid Topic metadata: id:`),
    ]);
  });
});

import { describe, expect, it } from 'vitest';
import type { ParsedTopicSource } from './parse-topic-source.ts';
import { validateTopicSource } from './validate-topic-source.ts';

describe('validateTopicSource', () => {
  it('returns a flat, typed Topic source record', () => {
    const sourcePath = 'content/topics/queue/topic.md';
    const parsedSource: ParsedTopicSource = {
      metadata: {
        id: '11111111-1111-4111-8111-111111111111',
        title: ' Queue ',
        childTopicIds: ['22222222-2222-4222-8222-222222222222'],
      },
      markdownBody: '\nQueue content.\n',
    };

    expect(validateTopicSource(sourcePath, parsedSource)).toEqual({
      sourcePath,
      id: '11111111-1111-4111-8111-111111111111',
      title: 'Queue',
      childTopicIds: ['22222222-2222-4222-8222-222222222222'],
      markdownBody: '\nQueue content.\n',
    });
  });

  it('reports the source path and field when metadata is invalid', () => {
    const sourcePath = 'content/topics/queue/topic.md';
    const parsedSource: ParsedTopicSource = {
      metadata: {
        id: 'not-a-uuid',
        title: 'Queue',
        childTopicIds: [],
      },
      markdownBody: '\nQueue content.\n',
    };

    expect(() => validateTopicSource(sourcePath, parsedSource)).toThrow(
      `${sourcePath}: Invalid Topic metadata: id:`,
    );
  });

  it('rejects a Topic with neither meaningful content nor children', () => {
    const sourcePath = 'content/topics/empty/topic.md';
    const parsedSource: ParsedTopicSource = {
      metadata: {
        id: '11111111-1111-4111-8111-111111111111',
        title: 'Empty Topic',
        childTopicIds: [],
      },
      markdownBody: ' \n\t',
    };

    expect(() => validateTopicSource(sourcePath, parsedSource)).toThrow(
      `${sourcePath}: Topic must have meaningful Markdown content or at least one child Topic`,
    );
  });

  it.each([
    {
      shape: 'navigation-only',
      childTopicIds: ['22222222-2222-4222-8222-222222222222'],
      markdownBody: '',
    },
    {
      shape: 'content-only',
      childTopicIds: [],
      markdownBody: 'Queue content.',
    },
  ])('accepts a $shape Topic', ({ childTopicIds, markdownBody }) => {
    const parsedSource: ParsedTopicSource = {
      metadata: {
        id: '11111111-1111-4111-8111-111111111111',
        title: 'Queue',
        childTopicIds,
      },
      markdownBody,
    };

    expect(() => validateTopicSource('content/topics/queue/topic.md', parsedSource)).not.toThrow();
  });
});

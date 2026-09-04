import { describe, expect, it } from 'vitest';
import { parseTopicSource } from './parse-topic-source.ts';

describe('parseTopicSource', () => {
  it('parses front matter and preserves the Markdown body exactly', () => {
    const source = [
      '---',
      'id: "11111111-1111-4111-8111-111111111111"',
      'title: "Queue"',
      'childTopicIds: []',
      '---',
      '',
      'Queue content.',
      '',
    ].join('\n');

    expect(parseTopicSource('content/topics/queue/topic.md', source)).toEqual({
      metadata: {
        id: '11111111-1111-4111-8111-111111111111',
        title: 'Queue',
        childTopicIds: [],
      },
      markdownBody: '\nQueue content.\n',
    });
  });

  it('accepts CRLF line endings without changing the Markdown body', () => {
    const source = [
      '---',
      'id: "11111111-1111-4111-8111-111111111111"',
      'title: "Queue"',
      'childTopicIds: []',
      '---',
      '',
      'Queue content.',
      '',
    ].join('\r\n');

    expect(parseTopicSource('content/topics/queue/topic.md', source)).toEqual({
      metadata: {
        id: '11111111-1111-4111-8111-111111111111',
        title: 'Queue',
        childTopicIds: [],
      },
      markdownBody: '\r\nQueue content.\r\n',
    });
  });

  it('includes the source path when YAML front matter is malformed', () => {
    const sourcePath = 'content/topics/queue/topic.md';
    const source = ['---', 'id: [not valid YAML', '---', ''].join('\n');

    expect(() => parseTopicSource(sourcePath, source)).toThrow(
      `${sourcePath}: Invalid YAML front matter`,
    );
  });

  it('accepts a closing delimiter at the end of the file', () => {
    const source = [
      '---',
      'id: "11111111-1111-4111-8111-111111111111"',
      'title: "Java"',
      'childTopicIds:',
      '  - "22222222-2222-4222-8222-222222222222"',
      '---',
    ].join('\n');

    expect(parseTopicSource('content/topics/java/topic.md', source)).toEqual({
      metadata: {
        id: '11111111-1111-4111-8111-111111111111',
        title: 'Java',
        childTopicIds: ['22222222-2222-4222-8222-222222222222'],
      },
      markdownBody: '',
    });
  });

  it('rejects text before the opening front-matter delimiter', () => {
    const sourcePath = 'content/topics/queue/topic.md';
    const source = [
      'Unexpected text',
      '---',
      'id: "11111111-1111-4111-8111-111111111111"',
      'title: "Queue"',
      'childTopicIds: []',
      '---',
    ].join('\n');

    expect(() => parseTopicSource(sourcePath, source)).toThrow(
      `${sourcePath}: Topic source must begin with a front-matter delimiter`,
    );
  });

  it('requires a standalone closing front-matter delimiter', () => {
    const sourcePath = 'content/topics/queue/topic.md';
    const source = [
      '---',
      'id: "11111111-1111-4111-8111-111111111111"',
      'title: "Queue"',
      'childTopicIds: []',
      '---not-a-delimiter',
    ].join('\n');

    expect(() => parseTopicSource(sourcePath, source)).toThrow(
      `${sourcePath}: Topic source is missing its closing front-matter delimiter`,
    );
  });
});

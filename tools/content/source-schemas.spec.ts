import { describe, expect, it } from 'vitest';
import { catalogSourceSchema, topicMetadataSchema } from './source-schemas.ts';

const topicId = '11111111-1111-4111-8111-111111111111';
const childTopicId = '22222222-2222-4222-8222-222222222222';
const requiredClassification = {
  status: 'accepted' as const,
  domains: ['java', 'collections'],
  kind: 'concept',
  relatedTopicIds: [] as string[],
};

describe('catalogSourceSchema', () => {
  it('accepts an ordered list of Topic UUIDs', () => {
    expect(
      catalogSourceSchema.parse({
        landingTopicIds: [topicId, childTopicId],
      }),
    ).toEqual({
      landingTopicIds: [topicId, childTopicId],
    });
  });

  it('rejects invalid UUIDs', () => {
    expect(
      catalogSourceSchema.safeParse({
        landingTopicIds: ['not-a-uuid'],
      }).success,
    ).toBe(false);
  });

  it('rejects unknown properties', () => {
    expect(
      catalogSourceSchema.safeParse({
        landingTopicIds: [],
        unexpected: true,
      }).success,
    ).toBe(false);
  });
});

describe('topicMetadataSchema', () => {
  it('accepts Topic metadata and normalizes text whitespace', () => {
    expect(
      topicMetadataSchema.parse({
        id: topicId,
        title: ' Queue ',
        summary: ' Queue operations and implementation trade-offs. ',
        iconKey: 'queue',
        ...requiredClassification,
        childTopicIds: [childTopicId],
      }),
    ).toEqual({
      id: topicId,
      title: 'Queue',
      summary: 'Queue operations and implementation trade-offs.',
      iconKey: 'queue',
      ...requiredClassification,
      childTopicIds: [childTopicId],
    });
  });

  it.each(['draft', 'accepted'])('accepts explicit %s status', (status) => {
    expect(
      topicMetadataSchema.parse({
        id: topicId,
        title: 'Queue',
        ...requiredClassification,
        status,
        childTopicIds: [],
      }).status,
    ).toBe(status);
  });

  it.each([undefined, 'published', null])('rejects missing or unsupported status %s', (status) => {
    const result = topicMetadataSchema.safeParse({
      id: topicId,
      title: 'Queue',
      ...requiredClassification,
      status,
      childTopicIds: [],
    });
    expect(result.success).toBe(false);
    if (!result.success)
      expect(result.error.issues.some((issue) => issue.path[0] === 'status')).toBe(true);
  });

  it('allows optional presentation metadata to be omitted', () => {
    expect(
      topicMetadataSchema.parse({
        id: topicId,
        title: 'Queue',
        ...requiredClassification,
        childTopicIds: [],
      }),
    ).toEqual({
      id: topicId,
      title: 'Queue',
      ...requiredClassification,
      childTopicIds: [],
    });
  });

  it('rejects an unsupported icon key', () => {
    expect(
      topicMetadataSchema.safeParse({
        id: topicId,
        title: 'Queue',
        iconKey: 'custom-file.svg',
        ...requiredClassification,
        childTopicIds: [],
      }).success,
    ).toBe(false);
  });

  it.each([
    { description: 'blank', summary: '   ' },
    { description: 'multiline', summary: 'First line\nSecond line' },
    { description: 'longer than 160 characters', summary: 'a'.repeat(161) },
  ])('rejects a $description summary', ({ summary }) => {
    expect(
      topicMetadataSchema.safeParse({
        id: topicId,
        title: 'Queue',
        summary,
        ...requiredClassification,
        childTopicIds: [],
      }).success,
    ).toBe(false);
  });

  it('rejects a whitespace-only title', () => {
    expect(
      topicMetadataSchema.safeParse({
        id: topicId,
        title: '   ',
        ...requiredClassification,
        childTopicIds: [],
      }).success,
    ).toBe(false);
  });

  it('requires childTopicIds even when there are no children', () => {
    expect(
      topicMetadataSchema.safeParse({
        id: topicId,
        title: 'Queue',
        ...requiredClassification,
      }).success,
    ).toBe(false);
  });

  it('rejects unknown properties', () => {
    expect(
      topicMetadataSchema.safeParse({
        id: topicId,
        title: 'Queue',
        ...requiredClassification,
        childTopicIds: [],
        unexpected: true,
      }).success,
    ).toBe(false);
  });

  it.each([
    { description: 'missing domains', metadata: { kind: 'concept', relatedTopicIds: [] } },
    {
      description: 'empty domains',
      metadata: { domains: [], kind: 'concept', relatedTopicIds: [] },
    },
    {
      description: 'duplicate domains',
      metadata: { domains: ['java', 'java'], kind: 'concept', relatedTopicIds: [] },
    },
    {
      description: 'unsupported domain',
      metadata: { domains: ['frontend'], kind: 'concept', relatedTopicIds: [] },
    },
    {
      description: 'unsupported kind',
      metadata: { domains: ['java'], kind: 'tutorial', relatedTopicIds: [] },
    },
    { description: 'missing relatedTopicIds', metadata: { domains: ['java'], kind: 'concept' } },
  ])('rejects $description', ({ metadata }) => {
    expect(
      topicMetadataSchema.safeParse({
        id: topicId,
        title: 'Queue',
        childTopicIds: [],
        status: 'accepted',
        ...metadata,
      }).success,
    ).toBe(false);
  });
});

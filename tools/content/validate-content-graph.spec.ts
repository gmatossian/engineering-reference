import { describe, expect, it } from 'vitest';
import type { LoadedContentSource } from './load-content-source.ts';
import { validateContentGraph } from './validate-content-graph.ts';

const defaultTopicClassification = {
  domains: ['java'] as 'java'[],
  kind: 'concept' as const,
  relatedTopicIds: [] as string[],
};

function captureAggregateError(action: () => unknown): AggregateError {
  try {
    action();
  } catch (error: unknown) {
    expect(error).toBeInstanceOf(AggregateError);

    return error as AggregateError;
  }

  throw new Error('Expected an AggregateError to be thrown');
}

describe('validateContentGraph', () => {
  it('returns a valid content source unchanged', () => {
    const topicId = '11111111-1111-4111-8111-111111111111';

    const contentSource: LoadedContentSource = {
      catalog: {
        sourcePath: 'content/catalog.yaml',
        landingTopicIds: [topicId],
      },
      topics: [
        {
          sourcePath: 'content/topics/java/topic.md',
          ...defaultTopicClassification,
          id: topicId,
          title: 'Java',
          summary: 'Java language concepts.',
          childTopicIds: [],
          markdownBody: '\nJava content.\n',
        },
      ],
    };

    expect(validateContentGraph(contentSource)).toBe(contentSource);
  });

  it('requires every landing Topic to define a summary', () => {
    const topicId = '11111111-1111-4111-8111-111111111111';
    const sourcePath = 'content/topics/java/topic.md';

    const contentSource: LoadedContentSource = {
      catalog: {
        sourcePath: 'content/catalog.yaml',
        landingTopicIds: [topicId],
      },
      topics: [
        {
          sourcePath,
          ...defaultTopicClassification,
          id: topicId,
          title: 'Java',
          childTopicIds: [],
          markdownBody: '\nJava content.\n',
        },
      ],
    };

    const error = captureAggregateError(() => validateContentGraph(contentSource));

    expect(error.errors).toHaveLength(1);
    expect((error.errors[0] as Error).message).toBe(
      `${sourcePath}: Landing Topic ${topicId} must define a summary`,
    );
  });

  it('accepts a valid parent-child tree', () => {
    const parentId = '11111111-1111-4111-8111-111111111111';
    const childId = '22222222-2222-4222-8222-222222222222';

    const contentSource: LoadedContentSource = {
      catalog: {
        sourcePath: 'content/catalog.yaml',
        landingTopicIds: [parentId],
      },
      topics: [
        {
          sourcePath: 'content/topics/java/topic.md',
          ...defaultTopicClassification,
          id: parentId,
          title: 'Java',
          summary: 'Java language concepts.',
          childTopicIds: [childId],
          markdownBody: '',
        },
        {
          sourcePath: 'content/topics/collections/topic.md',
          ...defaultTopicClassification,
          id: childId,
          title: 'Collections',
          childTopicIds: [],
          markdownBody: '\nCollections content.\n',
        },
      ],
    };

    expect(validateContentGraph(contentSource)).toBe(contentSource);
  });

  it('rejects duplicate Topic UUIDs and identifies every conflicting source path', () => {
    const duplicateId = '11111111-1111-4111-8111-111111111111';
    const firstSourcePath = 'content/topics/java/topic.md';
    const secondSourcePath = 'content/topics/concurrency/topic.md';

    const contentSource: LoadedContentSource = {
      catalog: {
        sourcePath: 'content/catalog.yaml',
        landingTopicIds: [duplicateId],
      },
      topics: [
        {
          sourcePath: firstSourcePath,
          ...defaultTopicClassification,
          id: duplicateId,
          title: 'Java',
          childTopicIds: [],
          markdownBody: '\nJava content.\n',
        },
        {
          sourcePath: secondSourcePath,
          ...defaultTopicClassification,
          id: duplicateId,
          title: 'Concurrency',
          childTopicIds: [],
          markdownBody: '\nConcurrency content.\n',
        },
      ],
    };

    const error = captureAggregateError(() => validateContentGraph(contentSource));
    const errors = error.errors;

    expect(errors).toHaveLength(1);
    expect(errors[0]).toBeInstanceOf(Error);
    expect((errors[0] as Error).message).toContain(duplicateId);
    expect((errors[0] as Error).message).toContain(firstSourcePath);
    expect((errors[0] as Error).message).toContain(secondSourcePath);
  });

  it('rejects duplicate landing Topic references', () => {
    const topicId = '11111111-1111-4111-8111-111111111111';
    const catalogPath = 'content/catalog.yaml';

    const contentSource: LoadedContentSource = {
      catalog: {
        sourcePath: catalogPath,
        landingTopicIds: [topicId, topicId],
      },
      topics: [
        {
          sourcePath: 'content/topics/java/topic.md',
          ...defaultTopicClassification,
          id: topicId,
          title: 'Java',
          summary: 'Java language concepts.',
          childTopicIds: [],
          markdownBody: '\nJava content.\n',
        },
      ],
    };

    const error = captureAggregateError(() => validateContentGraph(contentSource));
    const errors = error.errors;

    expect(errors).toHaveLength(1);
    expect(errors[0]).toBeInstanceOf(Error);
    expect((errors[0] as Error).message).toContain('Duplicate landing Topic reference');
    expect((errors[0] as Error).message).toContain(topicId);
    expect((errors[0] as Error).message).toContain(catalogPath);
  });

  it('rejects a landing Topic reference that does not resolve', () => {
    const missingTopicId = '11111111-1111-4111-8111-111111111111';
    const catalogPath = 'content/catalog.yaml';

    const contentSource: LoadedContentSource = {
      catalog: {
        sourcePath: catalogPath,
        landingTopicIds: [missingTopicId],
      },
      topics: [],
    };

    const error = captureAggregateError(() => validateContentGraph(contentSource));
    const errors = error.errors;

    expect(errors).toHaveLength(1);
    expect(errors[0]).toBeInstanceOf(Error);
    expect((errors[0] as Error).message).toContain('Missing landing Topic reference');
    expect((errors[0] as Error).message).toContain(missingTopicId);
    expect((errors[0] as Error).message).toContain(catalogPath);
  });

  it('rejects duplicate child Topic references', () => {
    const parentId = '11111111-1111-4111-8111-111111111111';
    const childId = '22222222-2222-4222-8222-222222222222';
    const parentSourcePath = 'content/topics/java/topic.md';

    const contentSource: LoadedContentSource = {
      catalog: {
        sourcePath: 'content/catalog.yaml',
        landingTopicIds: [parentId],
      },
      topics: [
        {
          sourcePath: parentSourcePath,
          ...defaultTopicClassification,
          id: parentId,
          title: 'Java',
          summary: 'Java language concepts.',
          childTopicIds: [childId, childId],
          markdownBody: '',
        },
        {
          sourcePath: 'content/topics/collections/topic.md',
          ...defaultTopicClassification,
          id: childId,
          title: 'Collections',
          childTopicIds: [],
          markdownBody: '\nCollections content.\n',
        },
      ],
    };

    const error = captureAggregateError(() => validateContentGraph(contentSource));
    const errors = error.errors;

    expect(errors).toHaveLength(1);
    expect(errors[0]).toBeInstanceOf(Error);
    expect((errors[0] as Error).message).toContain('Duplicate child Topic reference');
    expect((errors[0] as Error).message).toContain(parentSourcePath);
    expect((errors[0] as Error).message).toContain(parentId);
    expect((errors[0] as Error).message).toContain(childId);
  });

  it('rejects a child Topic reference that does not resolve', () => {
    const parentId = '11111111-1111-4111-8111-111111111111';
    const missingChildId = '22222222-2222-4222-8222-222222222222';
    const parentSourcePath = 'content/topics/java/topic.md';

    const contentSource: LoadedContentSource = {
      catalog: {
        sourcePath: 'content/catalog.yaml',
        landingTopicIds: [parentId],
      },
      topics: [
        {
          sourcePath: parentSourcePath,
          ...defaultTopicClassification,
          id: parentId,
          title: 'Java',
          summary: 'Java language concepts.',
          childTopicIds: [missingChildId],
          markdownBody: '',
        },
      ],
    };

    const error = captureAggregateError(() => validateContentGraph(contentSource));
    const errors = error.errors;

    expect(errors).toHaveLength(1);
    expect(errors[0]).toBeInstanceOf(Error);
    expect((errors[0] as Error).message).toContain('Missing child Topic reference');
    expect((errors[0] as Error).message).toContain(parentSourcePath);
    expect((errors[0] as Error).message).toContain(parentId);
    expect((errors[0] as Error).message).toContain(missingChildId);
  });

  it('rejects a direct self-reference', () => {
    const topicId = '11111111-1111-4111-8111-111111111111';
    const sourcePath = 'content/topics/java/topic.md';

    const contentSource: LoadedContentSource = {
      catalog: {
        sourcePath: 'content/catalog.yaml',
        landingTopicIds: [topicId],
      },
      topics: [
        {
          sourcePath,
          ...defaultTopicClassification,
          id: topicId,
          title: 'Java',
          summary: 'Java language concepts.',
          childTopicIds: [topicId],
          markdownBody: '',
        },
      ],
    };

    const error = captureAggregateError(() => validateContentGraph(contentSource));
    const errors = error.errors;

    expect(errors).toHaveLength(1);
    expect(errors[0]).toBeInstanceOf(Error);
    expect((errors[0] as Error).message).toContain('Self-reference');
    expect((errors[0] as Error).message).toContain(sourcePath);
    expect((errors[0] as Error).message).toContain(topicId);
  });

  it('rejects an indirect cycle and identifies its Topics', () => {
    const javaId = '11111111-1111-4111-8111-111111111111';
    const collectionsId = '22222222-2222-4222-8222-222222222222';
    const javaSourcePath = 'content/topics/java/topic.md';
    const collectionsSourcePath = 'content/topics/collections/topic.md';

    const contentSource: LoadedContentSource = {
      catalog: {
        sourcePath: 'content/catalog.yaml',
        landingTopicIds: [javaId],
      },
      topics: [
        {
          sourcePath: javaSourcePath,
          ...defaultTopicClassification,
          id: javaId,
          title: 'Java',
          summary: 'Java language concepts.',
          childTopicIds: [collectionsId],
          markdownBody: '',
        },
        {
          sourcePath: collectionsSourcePath,
          ...defaultTopicClassification,
          id: collectionsId,
          title: 'Collections',
          childTopicIds: [javaId],
          markdownBody: '',
        },
      ],
    };

    const error = captureAggregateError(() => validateContentGraph(contentSource));
    const errors = error.errors;

    expect(errors).toHaveLength(1);
    expect(errors[0]).toBeInstanceOf(Error);

    const message = (errors[0] as Error).message;

    expect(message).toContain('Indirect cycle');
    expect(message).toContain(javaId);
    expect(message).toContain(collectionsId);
    expect(message).toContain(javaSourcePath);
    expect(message).toContain(collectionsSourcePath);
  });

  it('accepts a DAG in which multiple parents share a child Topic', () => {
    const javaId = '11111111-1111-4111-8111-111111111111';
    const collectionsId = '22222222-2222-4222-8222-222222222222';
    const concurrencyId = '33333333-3333-4333-8333-333333333333';
    const concurrentHashMapId = '44444444-4444-4444-8444-444444444444';

    const contentSource: LoadedContentSource = {
      catalog: {
        sourcePath: 'content/catalog.yaml',
        landingTopicIds: [javaId],
      },
      topics: [
        {
          sourcePath: 'content/topics/java/topic.md',
          ...defaultTopicClassification,
          id: javaId,
          title: 'Java',
          summary: 'Java language concepts.',
          childTopicIds: [collectionsId, concurrencyId],
          markdownBody: '',
        },
        {
          sourcePath: 'content/topics/collections/topic.md',
          ...defaultTopicClassification,
          id: collectionsId,
          title: 'Collections',
          childTopicIds: [concurrentHashMapId],
          markdownBody: '',
        },
        {
          sourcePath: 'content/topics/concurrency/topic.md',
          ...defaultTopicClassification,
          id: concurrencyId,
          title: 'Concurrency',
          childTopicIds: [concurrentHashMapId],
          markdownBody: '',
        },
        {
          sourcePath: 'content/topics/concurrent-hash-map/topic.md',
          ...defaultTopicClassification,
          id: concurrentHashMapId,
          title: 'ConcurrentHashMap',
          childTopicIds: [],
          markdownBody: '\nConcurrentHashMap content.\n',
        },
      ],
    };

    const originalContentSource = structuredClone(contentSource);

    expect(validateContentGraph(contentSource)).toBe(contentSource);
    expect(contentSource).toEqual(originalContentSource);
  });

  it('accepts a Topic that is unreachable from every landing Topic', () => {
    const landingTopicId = '11111111-1111-4111-8111-111111111111';
    const unreachableTopicId = '22222222-2222-4222-8222-222222222222';

    const contentSource: LoadedContentSource = {
      catalog: {
        sourcePath: 'content/catalog.yaml',
        landingTopicIds: [landingTopicId],
      },
      topics: [
        {
          sourcePath: 'content/topics/java/topic.md',
          ...defaultTopicClassification,
          id: landingTopicId,
          title: 'Java',
          summary: 'Java language concepts.',
          childTopicIds: [],
          markdownBody: '\nJava content.\n',
        },
        {
          sourcePath: 'content/topics/orphan/topic.md',
          ...defaultTopicClassification,
          id: unreachableTopicId,
          title: 'Orphan',
          childTopicIds: [],
          markdownBody: '\nOrphan content.\n',
        },
      ],
    };

    expect(validateContentGraph(contentSource)).toBe(contentSource);
  });

  it.each([
    {
      description: 'missing',
      relatedTopicIds: ['33333333-3333-4333-8333-333333333333'],
      expectedMessage: 'Missing Related Topic reference',
    },
    {
      description: 'duplicate',
      relatedTopicIds: [
        '22222222-2222-4222-8222-222222222222',
        '22222222-2222-4222-8222-222222222222',
      ],
      expectedMessage: 'Duplicate Related Topic reference',
    },
    {
      description: 'self-referential',
      relatedTopicIds: ['11111111-1111-4111-8111-111111111111'],
      expectedMessage: 'Self-reference in Related Topics',
    },
  ])('rejects a $description Related Topic reference', ({ relatedTopicIds, expectedMessage }) => {
    const topicId = '11111111-1111-4111-8111-111111111111';
    const relatedTopicId = '22222222-2222-4222-8222-222222222222';
    const contentSource: LoadedContentSource = {
      catalog: {
        sourcePath: 'content/catalog.yaml',
        landingTopicIds: [topicId],
      },
      topics: [
        {
          sourcePath: 'content/topics/topic/topic.md',
          ...defaultTopicClassification,
          id: topicId,
          title: 'Topic',
          summary: 'Topic summary.',
          childTopicIds: [],
          relatedTopicIds,
          markdownBody: 'Topic content.',
        },
        {
          sourcePath: 'content/topics/related/topic.md',
          ...defaultTopicClassification,
          id: relatedTopicId,
          title: 'Related',
          childTopicIds: [],
          markdownBody: 'Related content.',
        },
      ],
    };

    const error = captureAggregateError(() => validateContentGraph(contentSource));

    expect(error.errors).toHaveLength(1);
    expect((error.errors[0] as Error).message).toContain(expectedMessage);
  });

  it('allows directed Related Topic cycles without changing authored order', () => {
    const firstTopicId = '11111111-1111-4111-8111-111111111111';
    const secondTopicId = '22222222-2222-4222-8222-222222222222';
    const thirdTopicId = '33333333-3333-4333-8333-333333333333';
    const contentSource: LoadedContentSource = {
      catalog: {
        sourcePath: 'content/catalog.yaml',
        landingTopicIds: [firstTopicId],
      },
      topics: [
        {
          sourcePath: 'content/topics/first/topic.md',
          ...defaultTopicClassification,
          id: firstTopicId,
          title: 'First',
          summary: 'First summary.',
          childTopicIds: [],
          relatedTopicIds: [thirdTopicId, secondTopicId],
          markdownBody: 'First content.',
        },
        {
          sourcePath: 'content/topics/second/topic.md',
          ...defaultTopicClassification,
          id: secondTopicId,
          title: 'Second',
          childTopicIds: [],
          relatedTopicIds: [firstTopicId],
          markdownBody: 'Second content.',
        },
        {
          sourcePath: 'content/topics/third/topic.md',
          ...defaultTopicClassification,
          id: thirdTopicId,
          title: 'Third',
          childTopicIds: [],
          markdownBody: 'Third content.',
        },
      ],
    };

    const originalContentSource = structuredClone(contentSource);

    expect(validateContentGraph(contentSource)).toBe(contentSource);
    expect(contentSource).toEqual(originalContentSource);
  });

  it('rejects a catalog that lists no landing Topic', () => {
    const catalogPath = 'content/catalog.yaml';

    const contentSource: LoadedContentSource = {
      catalog: {
        sourcePath: catalogPath,
        landingTopicIds: [],
      },
      topics: [],
    };

    const error = captureAggregateError(() => validateContentGraph(contentSource));
    const errors = error.errors;

    expect(errors).toHaveLength(1);
    expect(errors[0]).toBeInstanceOf(Error);
    expect((errors[0] as Error).message).toBe(
      `${catalogPath}: Catalog must list at least one landing Topic`,
    );
  });

  it('reports independent graph errors together', () => {
    const rootId = '11111111-1111-4111-8111-111111111111';
    const missingLandingId = '22222222-2222-4222-8222-222222222222';
    const missingChildId = '33333333-3333-4333-8333-333333333333';

    const contentSource: LoadedContentSource = {
      catalog: {
        sourcePath: 'content/catalog.yaml',
        landingTopicIds: [rootId, missingLandingId],
      },
      topics: [
        {
          sourcePath: 'content/topics/java/topic.md',
          ...defaultTopicClassification,
          id: rootId,
          title: 'Java',
          summary: 'Java language concepts.',
          childTopicIds: [missingChildId],
          markdownBody: '',
        },
      ],
    };

    const error = captureAggregateError(() => validateContentGraph(contentSource));

    expect(error.message).toBe('Catalog graph validation failed with 2 error(s)');
    expect(error.errors).toHaveLength(2);

    const messages = error.errors.map((item: unknown) => {
      expect(item).toBeInstanceOf(Error);

      return (item as Error).message;
    });

    expect(messages.join('\n')).toContain('Missing landing Topic reference');
    expect(messages.join('\n')).toContain('Missing child Topic reference');
  });
});

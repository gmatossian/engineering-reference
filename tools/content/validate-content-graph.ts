import type { LoadedContentSource } from './load-content-source.ts';
import type { TopicSource } from './validate-topic-source.ts';

function findIndirectCycleErrors(topicsById: ReadonlyMap<string, TopicSource[]>): Error[] {
  const errors: Error[] = [];
  const visitingTopicIds = new Set<string>();
  const visitedTopicIds = new Set<string>();
  const traversalPath: TopicSource[] = [];

  function visit(topic: TopicSource): void {
    if (visitedTopicIds.has(topic.id)) {
      return;
    }

    visitingTopicIds.add(topic.id);
    traversalPath.push(topic);

    for (const childTopicId of new Set(topic.childTopicIds)) {
      if (childTopicId === topic.id) {
        continue;
      }

      const matchingChildren = topicsById.get(childTopicId);

      if (matchingChildren?.length !== 1) {
        continue;
      }

      const childTopic = matchingChildren[0];

      if (visitingTopicIds.has(childTopicId)) {
        const cycleStartIndex = traversalPath.findIndex(
          (pathTopic) => pathTopic.id === childTopicId,
        );
        const cycleTopics = traversalPath.slice(cycleStartIndex);
        const cycleDescription = [...cycleTopics, childTopic]
          .map((cycleTopic) => `${cycleTopic.id} (${cycleTopic.sourcePath})`)
          .join(' -> ');

        errors.push(new Error(`Indirect cycle detected: ${cycleDescription}`));
        continue;
      }

      visit(childTopic);
    }

    traversalPath.pop();
    visitingTopicIds.delete(topic.id);
    visitedTopicIds.add(topic.id);
  }

  for (const matchingTopics of topicsById.values()) {
    if (matchingTopics.length === 1) {
      visit(matchingTopics[0]);
    }
  }

  return errors;
}

function findUnreachableTopicErrors(
  contentSource: LoadedContentSource,
  topicsById: ReadonlyMap<string, TopicSource[]>,
): Error[] {
  const reachableTopicIds = new Set<string>();

  function visit(topicId: string): void {
    if (reachableTopicIds.has(topicId)) {
      return;
    }

    const matchingTopics = topicsById.get(topicId);

    if (matchingTopics?.length !== 1) {
      return;
    }

    const topic = matchingTopics[0];

    reachableTopicIds.add(topicId);

    for (const childTopicId of topic.childTopicIds) {
      visit(childTopicId);
    }
  }

  for (const landingTopicId of contentSource.catalog.landingTopicIds) {
    visit(landingTopicId);
  }

  const errors: Error[] = [];

  for (const matchingTopics of topicsById.values()) {
    if (matchingTopics.length !== 1) {
      continue;
    }

    const topic = matchingTopics[0];

    if (!reachableTopicIds.has(topic.id)) {
      errors.push(new Error(`${topic.sourcePath}: Unreachable Topic ${topic.id}`));
    }
  }

  return errors;
}

export function validateContentGraph(contentSource: LoadedContentSource): LoadedContentSource {
  const topicsById = new Map<string, TopicSource[]>();
  const errors: Error[] = [];

  for (const topic of contentSource.topics) {
    const matchingTopics = topicsById.get(topic.id) ?? [];

    matchingTopics.push(topic);
    topicsById.set(topic.id, matchingTopics);
  }

  for (const [topicId, matchingTopics] of topicsById) {
    if (matchingTopics.length > 1) {
      const sourcePaths = matchingTopics.map((topic) => topic.sourcePath).join(', ');

      errors.push(new Error(`Duplicate Topic UUID ${topicId}: ${sourcePaths}`));
    }
  }

  if (contentSource.catalog.landingTopicIds.length === 0) {
    errors.push(
      new Error(
        `${contentSource.catalog.sourcePath}: Catalog must list at least one landing Topic`,
      ),
    );
  }

  const seenLandingTopicIds = new Set<string>();
  const duplicateLandingTopicIds = new Set<string>();

  for (const topicId of contentSource.catalog.landingTopicIds) {
    if (seenLandingTopicIds.has(topicId)) {
      duplicateLandingTopicIds.add(topicId);
    } else {
      seenLandingTopicIds.add(topicId);
    }
  }

  for (const topicId of duplicateLandingTopicIds) {
    errors.push(
      new Error(
        `${contentSource.catalog.sourcePath}: Duplicate landing Topic reference ${topicId}`,
      ),
    );
  }

  for (const topicId of seenLandingTopicIds) {
    if (!topicsById.has(topicId)) {
      errors.push(
        new Error(
          `${contentSource.catalog.sourcePath}: Missing landing Topic reference ${topicId}`,
        ),
      );
    }
  }

  for (const topic of contentSource.topics) {
    const seenChildTopicIds = new Set<string>();
    const duplicateChildTopicIds = new Set<string>();

    for (const childTopicId of topic.childTopicIds) {
      if (seenChildTopicIds.has(childTopicId)) {
        duplicateChildTopicIds.add(childTopicId);
      } else {
        seenChildTopicIds.add(childTopicId);
      }
    }

    if (seenChildTopicIds.has(topic.id)) {
      errors.push(new Error(`${topic.sourcePath}: Self-reference in Topic ${topic.id}`));
    }

    for (const childTopicId of duplicateChildTopicIds) {
      errors.push(
        new Error(
          `${topic.sourcePath}: Duplicate child Topic reference ${childTopicId} in Topic ${topic.id}`,
        ),
      );
    }

    for (const childTopicId of seenChildTopicIds) {
      if (!topicsById.has(childTopicId)) {
        errors.push(
          new Error(
            `${topic.sourcePath}: Missing child Topic reference ${childTopicId} in Topic ${topic.id}`,
          ),
        );
      }
    }
  }

  errors.push(...findIndirectCycleErrors(topicsById));
  errors.push(...findUnreachableTopicErrors(contentSource, topicsById));

  if (errors.length > 0) {
    throw new AggregateError(
      errors,
      `Catalog graph validation failed with ${errors.length} error(s)`,
    );
  }

  return contentSource;
}

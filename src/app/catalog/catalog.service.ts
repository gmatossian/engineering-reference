import { Injectable } from '@angular/core';
import type {
  RuntimeCatalog,
  RuntimeTopic,
  TopicDomainKey,
  TopicIconKey,
  TopicKindKey,
} from '../../../contracts/runtime-catalog';
import {
  TOPIC_DOMAIN_KEYS,
  TOPIC_DOMAIN_LABELS,
  TOPIC_KIND_KEYS,
  TOPIC_KIND_LABELS,
} from '../../../contracts/runtime-catalog';
import generatedCatalog from '../../../.generated/catalog.json';

export interface TopicSummary {
  readonly id: string;
  readonly title: string;
  readonly summary: string | null;
  readonly iconKey: TopicIconKey | null;
}

export interface CatalogOption<Key extends string> {
  readonly key: Key;
  readonly label: string;
}

export interface TopicBrowseCriteria {
  readonly query: string;
  readonly domain: TopicDomainKey | null;
  readonly kind: TopicKindKey | null;
}

export interface TopicBrowseResult extends TopicSummary {
  readonly domains: readonly CatalogOption<TopicDomainKey>[];
  readonly domainLabel: string;
  readonly kind: CatalogOption<TopicKindKey>;
}

export interface TopicResultSection {
  readonly key: string;
  readonly label: string | null;
  readonly topics: readonly TopicBrowseResult[];
}

export interface TopicBrowseView {
  readonly criteria: TopicBrowseCriteria;
  readonly resultCount: number;
  readonly sections: readonly TopicResultSection[];
}

export interface TopicHierarchyNode extends TopicSummary {
  readonly children: readonly TopicHierarchyNode[];
}

export type TopicPath = readonly TopicSummary[];

const TOPIC_KIND_GROUP_LABELS: Readonly<Record<Exclude<TopicKindKey, 'area'>, string>> = {
  concept: 'Concepts',
  operations: 'Operations',
  'decision-aid': 'Decision aids',
  exercise: 'Exercises',
  pattern: 'Patterns and techniques',
};

const compareText = (left: string, right: string): number =>
  left.localeCompare(right, undefined, { sensitivity: 'base' });

@Injectable({ providedIn: 'root' })
export class CatalogService {
  // The generator validates this trusted build artifact. JSON imports widen
  // string literals, so restore the shared contract at the consumer boundary.
  private readonly catalog = generatedCatalog as RuntimeCatalog;

  getLandingTopics(): readonly TopicSummary[] {
    return this.catalog.landingTopicIds.map((id) => this.getRequiredSummary(id));
  }

  getDomainOptions(): readonly CatalogOption<TopicDomainKey>[] {
    return TOPIC_DOMAIN_KEYS.map((key) => ({ key, label: TOPIC_DOMAIN_LABELS[key] }));
  }

  getDomainTopicCount(domain: TopicDomainKey): number {
    return this.catalog.topicIdsByDomain[domain].length;
  }

  getKindOptions(): readonly CatalogOption<TopicKindKey>[] {
    return TOPIC_KIND_KEYS.map((key) => ({ key, label: TOPIC_KIND_LABELS[key] }));
  }

  normalizeBrowseCriteria(criteria: {
    readonly query?: string | null;
    readonly domain?: string | null;
    readonly kind?: string | null;
  }): TopicBrowseCriteria {
    return {
      query: criteria.query?.trim() ?? '',
      domain: TOPIC_DOMAIN_KEYS.includes(criteria.domain as TopicDomainKey)
        ? (criteria.domain as TopicDomainKey)
        : null,
      kind: TOPIC_KIND_KEYS.includes(criteria.kind as TopicKindKey)
        ? (criteria.kind as TopicKindKey)
        : null,
    };
  }

  getTopicBrowseView(criteria: TopicBrowseCriteria): TopicBrowseView {
    const matchingTopics = this.getMatchingTopics(criteria);
    const shouldSeparateOverviews =
      criteria.domain !== null && criteria.query === '' && criteria.kind === null;

    if (!shouldSeparateOverviews) {
      return {
        criteria,
        resultCount: matchingTopics.length,
        sections: [{ key: 'results', label: null, topics: matchingTopics }],
      };
    }

    const overviewTopics = matchingTopics.filter((topic) => topic.kind.key === 'area');
    const remainingTopics = matchingTopics.filter((topic) => topic.kind.key !== 'area');
    const sections: TopicResultSection[] = [];

    if (overviewTopics.length > 0) {
      sections.push({ key: 'overviews', label: 'Overviews', topics: overviewTopics });
    }

    if (criteria.domain === 'system-design') {
      for (const kind of TOPIC_KIND_KEYS) {
        if (kind === 'area') {
          continue;
        }

        const topics = remainingTopics.filter((topic) => topic.kind.key === kind);
        if (topics.length > 0) {
          sections.push({ key: kind, label: TOPIC_KIND_GROUP_LABELS[kind], topics });
        }
      }
    } else if (remainingTopics.length > 0) {
      sections.push({ key: 'results', label: null, topics: remainingTopics });
    }

    return {
      criteria,
      resultCount: matchingTopics.length,
      sections,
    };
  }

  getTopic(id: string): RuntimeTopic | undefined {
    if (!Object.hasOwn(this.catalog.topicsById, id)) {
      return undefined;
    }

    return this.catalog.topicsById[id];
  }

  getChildTopics(topic: RuntimeTopic): readonly TopicSummary[] {
    return topic.childTopicIds.map((id) => this.getRequiredSummary(id));
  }

  getTopicDomains(topic: RuntimeTopic): readonly CatalogOption<TopicDomainKey>[] {
    return topic.domains.map((key) => ({ key, label: TOPIC_DOMAIN_LABELS[key] }));
  }

  getTopicKind(topic: RuntimeTopic): CatalogOption<TopicKindKey> {
    return { key: topic.kind, label: TOPIC_KIND_LABELS[topic.kind] };
  }

  getHierarchyRoots(): readonly TopicHierarchyNode[] {
    return this.getRootTopicIds().map((id) => this.buildHierarchyNode(id));
  }

  getTopicPaths(topicId: string): readonly TopicPath[] {
    if (this.getTopic(topicId) === undefined) {
      return [];
    }

    const paths: TopicPath[] = [];

    for (const rootId of this.getRootTopicIds()) {
      this.collectTopicPaths(rootId, topicId, [], paths);
    }

    return paths;
  }

  private getMatchingTopics(criteria: TopicBrowseCriteria): readonly TopicBrowseResult[] {
    const foldedQuery = criteria.query.toLocaleLowerCase();

    return this.catalog.allTopicIds
      .map((id) => this.getRequiredBrowseResult(id))
      .filter(
        (topic) =>
          (criteria.domain === null || topic.domains.some(({ key }) => key === criteria.domain)) &&
          (criteria.kind === null || topic.kind.key === criteria.kind) &&
          (foldedQuery === '' || topic.title.toLocaleLowerCase().includes(foldedQuery)),
      )
      .sort((left, right) => {
        if (foldedQuery !== '') {
          const rankDifference =
            this.getSearchRank(left.title, foldedQuery) -
            this.getSearchRank(right.title, foldedQuery);
          if (rankDifference !== 0) {
            return rankDifference;
          }
        }

        return compareText(left.title, right.title) || left.id.localeCompare(right.id);
      });
  }

  private getSearchRank(title: string, foldedQuery: string): number {
    const foldedTitle = title.toLocaleLowerCase();
    if (foldedTitle === foldedQuery) {
      return 0;
    }

    return foldedTitle.startsWith(foldedQuery) ? 1 : 2;
  }

  private getRequiredBrowseResult(id: string): TopicBrowseResult {
    const topic = this.getTopic(id);

    if (topic === undefined) {
      throw new Error(`Generated catalog references unknown Topic ${id}`);
    }

    const domains = this.getTopicDomains(topic);

    return {
      ...this.getRequiredSummary(id),
      domains,
      domainLabel: domains.map(({ label }) => label).join(', '),
      kind: this.getTopicKind(topic),
    };
  }

  private getRootTopicIds(): readonly string[] {
    const rootIds = this.catalog.allTopicIds.filter(
      (id) => this.catalog.parentTopicIdsById[id]?.length === 0,
    );
    const rootIdSet = new Set(rootIds);
    const orderedLandingRoots = this.catalog.landingTopicIds.filter((id) => rootIdSet.has(id));
    const landingRootSet = new Set(orderedLandingRoots);
    const remainingRoots = rootIds
      .filter((id) => !landingRootSet.has(id))
      .sort((leftId, rightId) => {
        const left = this.getRequiredSummary(leftId);
        const right = this.getRequiredSummary(rightId);
        return compareText(left.title, right.title) || left.id.localeCompare(right.id);
      });

    return [...orderedLandingRoots, ...remainingRoots];
  }

  private buildHierarchyNode(id: string): TopicHierarchyNode {
    const topic = this.getTopic(id);

    if (topic === undefined) {
      throw new Error(`Generated catalog references unknown Topic ${id}`);
    }

    return {
      ...this.getRequiredSummary(id),
      children: topic.childTopicIds.map((childId) => this.buildHierarchyNode(childId)),
    };
  }

  private collectTopicPaths(
    currentId: string,
    targetId: string,
    ancestors: readonly TopicSummary[],
    paths: TopicPath[],
  ): void {
    const current = this.getRequiredSummary(currentId);
    const path = [...ancestors, current];

    if (currentId === targetId) {
      paths.push(path);
      return;
    }

    const topic = this.getTopic(currentId);
    if (topic === undefined) {
      return;
    }

    for (const childId of topic.childTopicIds) {
      this.collectTopicPaths(childId, targetId, path, paths);
    }
  }

  private getRequiredSummary(id: string): TopicSummary {
    const topic = this.getTopic(id);

    if (topic === undefined) {
      throw new Error(`Generated catalog references unknown Topic ${id}`);
    }

    return {
      id,
      title: topic.title,
      summary: topic.summary,
      iconKey: topic.iconKey,
    };
  }
}

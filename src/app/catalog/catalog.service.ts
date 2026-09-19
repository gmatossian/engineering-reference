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
  readonly hierarchyRoots: readonly TopicBrowseHierarchyNode[];
  readonly mode: 'hierarchy' | 'results';
  readonly resultCount: number;
  readonly resultHeading: string | null;
  readonly sections: readonly TopicResultSection[];
}

export interface TopicHierarchyNode extends TopicSummary {
  readonly children: readonly TopicHierarchyNode[];
}

export interface TopicBrowseHierarchyNode extends TopicBrowseResult {
  readonly children: readonly TopicBrowseHierarchyNode[];
  readonly matchesDomain: boolean;
  readonly matchingTopicCount: number;
}

export type TopicPath = readonly TopicSummary[];

const TOPIC_KIND_RESULT_LABELS: Readonly<Record<TopicKindKey, string>> = {
  area: 'Overviews',
  concept: 'Concepts',
  operations: 'Operations',
  'decision-aid': 'Decision aids',
  exercise: 'Exercises',
  pattern: 'Patterns',
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
    const shouldShowHierarchy = criteria.query === '' && criteria.kind === null;

    if (shouldShowHierarchy) {
      return {
        criteria,
        hierarchyRoots: this.getBrowseHierarchy(criteria.domain),
        mode: 'hierarchy',
        resultCount: matchingTopics.length,
        resultHeading: null,
        sections: [],
      };
    }

    return {
      criteria,
      hierarchyRoots: [],
      mode: 'results',
      resultCount: matchingTopics.length,
      resultHeading: this.getResultHeading(criteria),
      sections: [{ key: 'results', label: null, topics: matchingTopics }],
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

  getRelatedTopics(topic: RuntimeTopic): readonly TopicBrowseResult[] {
    return topic.relatedTopicIds.map((id) => this.getRequiredBrowseResult(id));
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

  getBrowseHierarchy(domain: TopicDomainKey | null): readonly TopicBrowseHierarchyNode[] {
    return this.getRootTopicIds().flatMap((id) => {
      const result = this.buildDomainHierarchyNode(id, domain);
      return result === null ? [] : [result.node];
    });
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

  private getResultHeading(criteria: TopicBrowseCriteria): string | null {
    if (criteria.query === '' && criteria.kind === null) {
      return null;
    }

    const domainLabel = criteria.domain === null ? null : TOPIC_DOMAIN_LABELS[criteria.domain];
    const kindLabel = criteria.kind === null ? null : TOPIC_KIND_RESULT_LABELS[criteria.kind];
    const domainSuffix = domainLabel === null ? '' : ` in ${domainLabel}`;

    if (criteria.query !== '' && kindLabel !== null) {
      return `${kindLabel} matching “${criteria.query}”${domainSuffix}`;
    }

    if (criteria.query !== '') {
      return `Results for “${criteria.query}”${domainSuffix}`;
    }

    return `${kindLabel}${domainSuffix}`;
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

  private buildDomainHierarchyNode(
    id: string,
    domain: TopicDomainKey | null,
  ): { readonly matchingIds: ReadonlySet<string>; readonly node: TopicBrowseHierarchyNode } | null {
    const topic = this.getTopic(id);

    if (topic === undefined) {
      throw new Error(`Generated catalog references unknown Topic ${id}`);
    }

    const childResults = topic.childTopicIds
      .map((childId) => this.buildDomainHierarchyNode(childId, domain))
      .filter(
        (
          result,
        ): result is {
          readonly matchingIds: ReadonlySet<string>;
          readonly node: TopicBrowseHierarchyNode;
        } => result !== null,
      );
    const matchesDomain = domain === null || topic.domains.includes(domain);

    if (!matchesDomain && childResults.length === 0) {
      return null;
    }

    const matchingIds = new Set<string>();
    if (matchesDomain) {
      matchingIds.add(id);
    }
    for (const child of childResults) {
      for (const matchingId of child.matchingIds) {
        matchingIds.add(matchingId);
      }
    }

    return {
      matchingIds,
      node: {
        ...this.getRequiredBrowseResult(id),
        children: childResults.map(({ node }) => node),
        matchesDomain,
        matchingTopicCount: matchingIds.size,
      },
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

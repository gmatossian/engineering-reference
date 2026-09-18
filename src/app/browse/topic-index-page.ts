import { Component, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import type { TopicKindKey } from '../../../contracts/runtime-catalog';
import { CatalogService } from '../catalog/catalog.service';
import type { TopicBrowseCriteria } from '../catalog/catalog.service';
import { TopicResultList } from './topic-result-list';

const TOPIC_KIND_FILTER_LABELS: Readonly<Record<TopicKindKey, string>> = {
  area: 'Overviews',
  concept: 'Concepts',
  operations: 'Operations',
  'decision-aid': 'Decision aids',
  exercise: 'Exercises',
  pattern: 'Patterns',
};

@Component({
  imports: [TopicResultList],
  selector: 'app-topic-index-page',
  styleUrl: './topic-index-page.css',
  templateUrl: './topic-index-page.html',
})
export class TopicIndexPage {
  private readonly catalogService = inject(CatalogService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly queryParameters = toSignal(this.route.queryParamMap, {
    initialValue: this.route.snapshot.queryParamMap,
  });

  protected readonly domainOptions = this.catalogService.getDomainOptions();
  protected readonly kindOptions = this.catalogService
    .getKindOptions()
    .map(({ key }) => ({ key, label: TOPIC_KIND_FILTER_LABELS[key] }));
  protected readonly criteria = computed(() => {
    const parameters = this.queryParameters();
    return this.catalogService.normalizeBrowseCriteria({
      query: parameters.get('q'),
      domain: parameters.get('domain'),
      kind: parameters.get('kind'),
    });
  });
  protected readonly browseView = computed(() =>
    this.catalogService.getTopicBrowseView(this.criteria()),
  );
  protected readonly hasConstraints = computed(() => {
    const criteria = this.criteria();
    return criteria.query !== '' || criteria.domain !== null || criteria.kind !== null;
  });
  protected readonly emptyStateMessage = computed(() => {
    const criteria = this.criteria();
    const constraints: string[] = [];

    if (criteria.query !== '') {
      constraints.push(`the title “${criteria.query}”`);
    }

    if (criteria.domain !== null) {
      constraints.push(
        `${this.domainOptions.find(({ key }) => key === criteria.domain)?.label ?? criteria.domain} domain`,
      );
    }

    if (criteria.kind !== null) {
      constraints.push(
        `topic type “${this.kindOptions.find(({ key }) => key === criteria.kind)?.label ?? criteria.kind}”`,
      );
    }

    return `No topics match ${constraints.join(' and ')}.`;
  });

  constructor() {
    effect(() => {
      const parameters = this.queryParameters();
      const normalized = this.criteria();
      const isCanonical =
        (parameters.get('q') ?? '') === normalized.query &&
        parameters.get('domain') === normalized.domain &&
        parameters.get('kind') === normalized.kind &&
        parameters.keys.every((key) => ['q', 'domain', 'kind'].includes(key));

      if (!isCanonical) {
        this.navigateTo(normalized);
      }
    });
  }

  protected changeDomain(event: Event): void {
    const domain = (event.currentTarget as HTMLSelectElement).value;
    this.navigateTo(this.catalogService.normalizeBrowseCriteria({ ...this.criteria(), domain }));
  }

  protected changeKind(event: Event): void {
    const kind = (event.currentTarget as HTMLInputElement).value;
    this.navigateTo(this.catalogService.normalizeBrowseCriteria({ ...this.criteria(), kind }));
  }

  protected clearConstraints(): void {
    this.navigateTo({ query: '', domain: null, kind: null });
  }

  private navigateTo(criteria: TopicBrowseCriteria): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        q: criteria.query || null,
        domain: criteria.domain,
        kind: criteria.kind,
      },
      replaceUrl: true,
    });
  }
}

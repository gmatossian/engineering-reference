import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { TopicDomainKey } from '../../../contracts/runtime-catalog';
import { CatalogService } from '../catalog/catalog.service';
import { TopicLinkList } from '../topic/topic-link-list';

type DomainTone = 'cobalt' | 'forest' | 'indigo' | 'ochre' | 'terracotta' | 'neutral';

const DOMAIN_PRESENTATION: Readonly<
  Record<TopicDomainKey, { readonly icon: string; readonly tone: DomainTone }>
> = {
  java: { icon: 'java', tone: 'cobalt' },
  collections: { icon: 'collection', tone: 'indigo' },
  concurrency: { icon: 'concurrency', tone: 'forest' },
  persistence: { icon: 'persistence', tone: 'terracotta' },
  databases: { icon: 'database', tone: 'terracotta' },
  http: { icon: 'http', tone: 'neutral' },
  'system-design': { icon: 'architecture', tone: 'forest' },
  'algorithms-data-structures': { icon: 'algorithm', tone: 'ochre' },
};

@Component({
  imports: [RouterLink, TopicLinkList],
  selector: 'app-landing-page',
  styleUrl: './landing-page.css',
  templateUrl: './landing-page.html',
})
export class LandingPage {
  private readonly catalogService = inject(CatalogService);

  protected readonly domains = this.catalogService.getDomainOptions().map((domain) => ({
    ...domain,
    ...DOMAIN_PRESENTATION[domain.key],
    topicCount: this.catalogService.getDomainTopicCount(domain.key),
  }));
  protected readonly topics = this.catalogService.getLandingTopics();
}

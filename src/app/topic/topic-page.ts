import { DOCUMENT } from '@angular/common';
import { Component, computed, effect, inject, input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CatalogService } from '../catalog/catalog.service';
import type { TopicSummary } from '../catalog/catalog.service';
import { TopicBreadcrumbs } from './topic-breadcrumbs';
import { TopicNotFound } from './topic-not-found';
import { TopicContent } from './topic-content';
import { TopicHierarchy } from './topic-hierarchy';
import { TopicLinkList } from './topic-link-list';
import { RelatedTopicList } from './related-topic-list';
import { TopicOutline } from './topic-outline';

@Component({
  imports: [
    TopicBreadcrumbs,
    TopicContent,
    TopicHierarchy,
    TopicLinkList,
    TopicNotFound,
    TopicOutline,
    RelatedTopicList,
  ],
  selector: 'app-topic-page',
  styleUrl: './topic-page.css',
  templateUrl: './topic-page.html',
})
export class TopicPage {
  readonly id = input.required<string>();

  private readonly catalogService = inject(CatalogService);
  private readonly document = inject(DOCUMENT);
  private readonly documentTitle = inject(Title);

  protected readonly topic = computed(() => this.catalogService.getTopic(this.id()));
  protected readonly childTopics = computed<readonly TopicSummary[]>(() => {
    const topic = this.topic();
    return topic === undefined ? [] : this.catalogService.getChildTopics(topic);
  });
  protected readonly relatedTopics = computed(() => {
    const topic = this.topic();
    return topic === undefined ? [] : this.catalogService.getRelatedTopics(topic);
  });
  protected readonly contentOutline = computed(() => this.topic()?.contentOutline ?? []);
  protected readonly hasContentOutline = computed(() => this.contentOutline().length >= 2);
  protected readonly hierarchyRoots = this.catalogService.getHierarchyRoots();
  protected readonly topicPaths = computed(() => this.catalogService.getTopicPaths(this.id()));
  protected readonly hasPrimaryRegion = computed(() => {
    const topic = this.topic();
    return topic !== undefined && (topic.mainContentHtml !== null || this.childTopics().length > 0);
  });

  constructor() {
    effect(() => {
      const topic = this.topic();
      this.documentTitle.setTitle(
        topic === undefined
          ? 'Topic not found | Engineering Reference'
          : `${topic.title} | Engineering Reference`,
      );
    });
  }

  protected skipToPrimaryContent(event: Event): void {
    event.preventDefault();
    this.document.getElementById('topic-primary-content')?.focus();
  }
}

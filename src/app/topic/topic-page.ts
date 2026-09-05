import { Component, computed, effect, inject, input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CatalogService } from '../catalog/catalog.service';
import type { TopicSummary } from '../catalog/catalog.service';
import { TopicNotFound } from './topic-not-found';
import { TopicContent } from './topic-content';
import { TopicLinkList } from './topic-link-list';

@Component({
  imports: [TopicContent, TopicLinkList, TopicNotFound],
  selector: 'app-topic-page',
  styleUrl: './topic-page.css',
  templateUrl: './topic-page.html',
})
export class TopicPage {
  readonly id = input.required<string>();

  private readonly catalogService = inject(CatalogService);
  private readonly documentTitle = inject(Title);

  protected readonly topic = computed(() => this.catalogService.getTopic(this.id()));
  protected readonly childTopics = computed<readonly TopicSummary[]>(() => {
    const topic = this.topic();
    return topic === undefined ? [] : this.catalogService.getChildTopics(topic);
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
}

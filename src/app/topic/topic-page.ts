import { Component, computed, effect, inject, input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CatalogService } from '../catalog/catalog.service';
import { TopicNotFound } from './topic-not-found';

@Component({
  imports: [TopicNotFound],
  selector: 'app-topic-page',
  templateUrl: './topic-page.html',
})
export class TopicPage {
  readonly id = input.required<string>();

  private readonly catalogService = inject(CatalogService);
  private readonly documentTitle = inject(Title);

  protected readonly topic = computed(() => this.catalogService.getTopic(this.id()));

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

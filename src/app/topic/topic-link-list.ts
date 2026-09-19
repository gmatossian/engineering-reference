import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { TopicSummary } from '../catalog/catalog.service';
import { TopicIcon } from '../ui/topic-icon/topic-icon';

export type TopicLinkPresentation = 'children' | 'curated';

@Component({
  imports: [RouterLink, TopicIcon],
  selector: 'app-topic-link-list',
  styleUrl: './topic-link-list.css',
  templateUrl: './topic-link-list.html',
})
export class TopicLinkList {
  readonly ariaLabel = input.required<string>();
  readonly presentation = input<TopicLinkPresentation>('children');
  readonly topics = input.required<readonly TopicSummary[]>();
}

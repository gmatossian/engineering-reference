import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { TopicSummary } from '../catalog/catalog.service';

@Component({
  imports: [RouterLink],
  selector: 'app-topic-link-list',
  styleUrl: './topic-link-list.css',
  templateUrl: './topic-link-list.html',
})
export class TopicLinkList {
  readonly ariaLabel = input.required<string>();
  readonly topics = input.required<readonly TopicSummary[]>();
}

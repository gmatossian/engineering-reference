import { DraftStatus } from '../ui/draft-status/draft-status';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { TopicPath } from '../catalog/catalog.service';

@Component({
  imports: [DraftStatus, RouterLink],
  selector: 'app-topic-breadcrumbs',
  styleUrl: './topic-breadcrumbs.css',
  templateUrl: './topic-breadcrumbs.html',
})
export class TopicBreadcrumbs {
  readonly currentTopicId = input.required<string>();
  readonly paths = input.required<readonly TopicPath[]>();
}

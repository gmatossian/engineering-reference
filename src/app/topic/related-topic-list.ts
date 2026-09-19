import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { TopicBrowseResult } from '../catalog/catalog.service';
import { TopicIcon } from '../ui/topic-icon/topic-icon';

@Component({
  imports: [RouterLink, TopicIcon],
  selector: 'app-related-topic-list',
  styleUrl: './related-topic-list.css',
  templateUrl: './related-topic-list.html',
})
export class RelatedTopicList {
  readonly topics = input.required<readonly TopicBrowseResult[]>();
}

import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { TopicResultSection } from '../catalog/catalog.service';
import { TopicIcon } from '../ui/topic-icon/topic-icon';

@Component({
  imports: [RouterLink, TopicIcon],
  selector: 'app-topic-result-list',
  styleUrl: './topic-result-list.css',
  templateUrl: './topic-result-list.html',
})
export class TopicResultList {
  readonly sections = input.required<readonly TopicResultSection[]>();
}

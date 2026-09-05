import { Component, input } from '@angular/core';

@Component({
  selector: 'app-topic-content',
  styleUrl: './topic-content.css',
  templateUrl: './topic-content.html',
})
export class TopicContent {
  readonly html = input.required<string>();
}

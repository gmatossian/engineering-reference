import { Component, input } from '@angular/core';

@Component({
  selector: 'app-topic-content',
  templateUrl: './topic-content.html',
})
export class TopicContent {
  readonly html = input.required<string>();
}

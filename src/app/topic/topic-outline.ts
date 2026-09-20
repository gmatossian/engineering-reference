import { DOCUMENT, NgTemplateOutlet } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import type { TopicContentOutlineItem } from '../../../contracts/runtime-catalog';

@Component({
  imports: [NgTemplateOutlet],
  selector: 'app-topic-outline',
  styleUrl: './topic-outline.css',
  templateUrl: './topic-outline.html',
})
export class TopicOutline {
  readonly items = input.required<readonly TopicContentOutlineItem[]>();
  readonly topicPath = input.required<string>();

  private readonly document = inject(DOCUMENT);

  protected fragmentHref(fragment: string): string {
    return `${this.topicPath()}#${fragment}`;
  }

  protected focusDestination(event: MouseEvent, fragment: string): void {
    if (event.button !== 0 || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
      return;
    }

    const browserWindow = this.document.defaultView;
    browserWindow?.requestAnimationFrame(() => {
      browserWindow.requestAnimationFrame(() => {
        this.document.getElementById(fragment)?.focus({ preventScroll: true });
      });
    });
  }
}

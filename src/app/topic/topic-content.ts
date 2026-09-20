import { afterRenderEffect, Component, ElementRef, input, viewChild } from '@angular/core';
import type { TopicContentOutlineItem } from '../../../contracts/runtime-catalog';

@Component({
  selector: 'app-topic-content',
  styleUrl: './topic-content.css',
  templateUrl: './topic-content.html',
})
export class TopicContent {
  readonly html = input.required<string>();
  readonly outline = input<readonly TopicContentOutlineItem[]>([]);

  private readonly contentElement = viewChild.required<ElementRef<HTMLElement>>('content');

  constructor() {
    afterRenderEffect(() => {
      // Reading the input makes the effect rerun whenever Angular replaces the
      // generated HTML. Angular's HTML sanitizer intentionally removes authored
      // `id` and `tabindex` attributes, so apply the trusted, generated outline
      // metadata to the resulting heading elements after rendering.
      this.html();
      const outline = this.outline();
      const headings = this.contentElement().nativeElement.querySelectorAll<HTMLElement>('h2, h3');
      let sectionIndex = -1;
      let childIndex = 0;

      for (const heading of headings) {
        let outlineItem: TopicContentOutlineItem | undefined;

        if (heading.tagName === 'H2') {
          sectionIndex += 1;
          childIndex = 0;
          outlineItem = outline[sectionIndex];
        } else if (sectionIndex >= 0) {
          outlineItem = outline[sectionIndex]?.children[childIndex];
          childIndex += 1;
        }

        if (outlineItem !== undefined) {
          heading.id = outlineItem.fragment;
          heading.tabIndex = -1;
        }
      }
    });
  }
}

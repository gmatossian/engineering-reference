import { Component, input } from '@angular/core';
import type { TopicStatusKey } from '../../../../contracts/runtime-catalog';

@Component({
  selector: 'app-draft-status',
  template: `@if (status() === 'draft') {
    {{ ' ' }}<span class="draft-status">Draft</span>
  }`,
  styles: `
    :host {
      display: contents;
    }
    .draft-status {
      background: var(--color-accent-ochre-soft);
      border-radius: var(--radius-small);
      color: var(--color-accent-ochre);
      display: inline-block;
      font-family: var(--font-body);
      font-size: 0.75rem;
      font-weight: 500;
      letter-spacing: normal;
      line-height: 1.5;
      margin-inline-start: var(--space-2);
      padding: 0.15rem 0.4rem;
      vertical-align: middle;
      white-space: nowrap;
    }
  `,
})
export class DraftStatus {
  readonly status = input.required<TopicStatusKey>();
}

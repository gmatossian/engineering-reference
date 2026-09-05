import { Component, computed, input } from '@angular/core';
import type { TopicIconKey } from '../../../../contracts/runtime-catalog';

@Component({
  host: {
    'aria-hidden': 'true',
    '[attr.data-icon-key]': 'resolvedIconKey()',
  },
  selector: 'app-topic-icon',
  styleUrl: './topic-icon.css',
  templateUrl: './topic-icon.html',
})
export class TopicIcon {
  readonly iconKey = input<TopicIconKey | null>(null);

  protected readonly resolvedIconKey = computed(() => this.iconKey() ?? 'generic');
  protected readonly iconSource = computed(() => `icons/topics/${this.resolvedIconKey()}.svg`);
}

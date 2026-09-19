import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, effect, ElementRef, input, signal, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { TopicHierarchyNode, TopicPath } from '../catalog/catalog.service';

@Component({
  imports: [NgTemplateOutlet, RouterLink],
  selector: 'app-topic-hierarchy',
  styleUrl: './topic-hierarchy.css',
  templateUrl: './topic-hierarchy.html',
})
export class TopicHierarchy {
  readonly currentTopicId = input.required<string>();
  readonly paths = input.required<readonly TopicPath[]>();
  readonly roots = input.required<readonly TopicHierarchyNode[]>();

  private readonly narrowExplorer = viewChild<ElementRef<HTMLDetailsElement>>('narrowExplorer');
  private readonly manualExpansion = signal<ReadonlyMap<string, boolean>>(new Map());

  private readonly requiredExpandedOccurrences = computed(() => {
    const expanded = new Set<string>();

    for (const path of this.paths()) {
      for (let index = 0; index < path.length; index += 1) {
        expanded.add(
          path
            .slice(0, index + 1)
            .map(({ id }) => id)
            .join('/'),
        );
      }
    }

    return expanded;
  });

  constructor() {
    effect(() => {
      this.currentTopicId();
      this.manualExpansion.set(new Map());
      const explorer = this.narrowExplorer();
      if (explorer !== undefined) {
        explorer.nativeElement.open = false;
      }
    });
  }

  protected occurrencePath(parentPath: string, topicId: string): string {
    return parentPath === '' ? topicId : `${parentPath}/${topicId}`;
  }

  protected childListId(instanceId: string, occurrencePath: string): string {
    return `${instanceId}-topic-children-${occurrencePath.replaceAll('/', '--')}`;
  }

  protected isExpanded(occurrencePath: string): boolean {
    return (
      this.manualExpansion().get(occurrencePath) ??
      this.requiredExpandedOccurrences().has(occurrencePath)
    );
  }

  protected toggle(occurrencePath: string): void {
    const expansion = new Map(this.manualExpansion());
    expansion.set(occurrencePath, !this.isExpanded(occurrencePath));
    this.manualExpansion.set(expansion);
  }
}

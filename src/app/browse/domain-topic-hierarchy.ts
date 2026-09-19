import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, effect, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { TopicBrowseHierarchyNode } from '../catalog/catalog.service';
import { TopicIcon } from '../ui/topic-icon/topic-icon';

@Component({
  imports: [NgTemplateOutlet, RouterLink, TopicIcon],
  selector: 'app-domain-topic-hierarchy',
  styleUrl: './domain-topic-hierarchy.css',
  templateUrl: './domain-topic-hierarchy.html',
})
export class DomainTopicHierarchy {
  readonly domainLabel = input.required<string>();
  readonly roots = input.required<readonly TopicBrowseHierarchyNode[]>();

  private readonly manualExpansion = signal<ReadonlyMap<string, boolean>>(new Map());
  private readonly initiallyExpandedOccurrences = computed(
    () => new Set(this.roots().map(({ id }) => id)),
  );

  constructor() {
    effect(() => {
      this.roots();
      this.manualExpansion.set(new Map());
    });
  }

  protected occurrencePath(parentPath: string, topicId: string): string {
    return parentPath === '' ? topicId : `${parentPath}/${topicId}`;
  }

  protected childListId(occurrencePath: string): string {
    return `domain-topic-children-${occurrencePath.replaceAll('/', '--')}`;
  }

  protected isExpanded(occurrencePath: string): boolean {
    return (
      this.manualExpansion().get(occurrencePath) ??
      this.initiallyExpandedOccurrences().has(occurrencePath)
    );
  }

  protected toggle(occurrencePath: string): void {
    const expansion = new Map(this.manualExpansion());
    expansion.set(occurrencePath, !this.isExpanded(occurrencePath));
    this.manualExpansion.set(expansion);
  }
}

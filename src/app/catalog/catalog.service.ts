import { Injectable } from '@angular/core';
import type { RuntimeCatalog, RuntimeTopic } from '../../../contracts/runtime-catalog';
import generatedCatalog from '../../../.generated/catalog.json';

export interface TopicSummary {
  readonly id: string;
  readonly title: string;
}

@Injectable({ providedIn: 'root' })
export class CatalogService {
  // The generator validates this trusted build artifact. JSON imports widen
  // string literals, so restore the shared contract at the consumer boundary.
  private readonly catalog = generatedCatalog as RuntimeCatalog;

  getLandingTopics(): readonly TopicSummary[] {
    return this.catalog.landingTopicIds.map((id) => this.getRequiredSummary(id));
  }

  getTopic(id: string): RuntimeTopic | undefined {
    if (!Object.hasOwn(this.catalog.topicsById, id)) {
      return undefined;
    }

    return this.catalog.topicsById[id];
  }

  getChildTopics(topic: RuntimeTopic): readonly TopicSummary[] {
    return topic.childTopicIds.map((id) => this.getRequiredSummary(id));
  }

  private getRequiredSummary(id: string): TopicSummary {
    const topic = this.getTopic(id);

    if (topic === undefined) {
      throw new Error(`Generated catalog references unknown Topic ${id}`);
    }

    return { id, title: topic.title };
  }
}

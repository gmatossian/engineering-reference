export interface RuntimeTopic {
  readonly title: string;
  readonly mainContentHtml: string | null;
  readonly childTopicIds: readonly string[];
}

export interface RuntimeCatalog {
  readonly landingTopicIds: readonly string[];
  readonly topicsById: Readonly<Record<string, RuntimeTopic>>;
}

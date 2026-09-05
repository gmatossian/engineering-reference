export const TOPIC_ICON_KEYS = [
  'java',
  'architecture',
  'algorithm',
  'database',
  'collection',
  'queue',
  'complexity',
  'concurrency',
  'persistence',
] as const;

export type TopicIconKey = (typeof TOPIC_ICON_KEYS)[number];

export interface RuntimeTopic {
  readonly title: string;
  readonly summary: string | null;
  readonly iconKey: TopicIconKey | null;
  readonly mainContentHtml: string | null;
  readonly childTopicIds: readonly string[];
}

export interface RuntimeCatalog {
  readonly landingTopicIds: readonly string[];
  readonly topicsById: Readonly<Record<string, RuntimeTopic>>;
}

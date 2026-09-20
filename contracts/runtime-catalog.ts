export const TOPIC_ICON_KEYS = [
  'java',
  'architecture',
  'algorithm',
  'database',
  'array',
  'collection',
  'conversion',
  'copy',
  'creation',
  'deque',
  'heap',
  'list',
  'map',
  'operations',
  'priority',
  'queue',
  'set',
  'complexity',
  'concurrency',
  'equality',
  'ordering',
  'persistence',
] as const;

export type TopicIconKey = (typeof TOPIC_ICON_KEYS)[number];

export const TOPIC_DOMAIN_KEYS = [
  'java',
  'collections',
  'concurrency',
  'persistence',
  'databases',
  'http',
  'system-design',
  'algorithms-data-structures',
] as const;

export type TopicDomainKey = (typeof TOPIC_DOMAIN_KEYS)[number];

export const TOPIC_DOMAIN_LABELS: Readonly<Record<TopicDomainKey, string>> = {
  java: 'Java',
  collections: 'Collections',
  concurrency: 'Concurrency',
  persistence: 'Persistence',
  databases: 'Databases',
  http: 'HTTP',
  'system-design': 'System Design',
  'algorithms-data-structures': 'Algorithms and data structures',
};

export const TOPIC_KIND_KEYS = [
  'area',
  'concept',
  'operations',
  'decision-aid',
  'exercise',
  'pattern',
] as const;

export type TopicKindKey = (typeof TOPIC_KIND_KEYS)[number];

export const TOPIC_KIND_LABELS: Readonly<Record<TopicKindKey, string>> = {
  area: 'Area',
  concept: 'Concept',
  operations: 'Operations',
  'decision-aid': 'Decision aid',
  exercise: 'Exercise',
  pattern: 'Pattern or technique',
};

export interface TopicContentOutlineItem {
  readonly fragment: string;
  readonly label: string;
  readonly children: readonly TopicContentOutlineItem[];
}

export interface RuntimeTopic {
  readonly title: string;
  readonly summary: string | null;
  readonly iconKey: TopicIconKey | null;
  readonly domains: readonly TopicDomainKey[];
  readonly kind: TopicKindKey;
  readonly mainContentHtml: string | null;
  readonly contentOutline: readonly TopicContentOutlineItem[];
  readonly childTopicIds: readonly string[];
  readonly relatedTopicIds: readonly string[];
}

export interface RuntimeCatalog {
  readonly landingTopicIds: readonly string[];
  readonly allTopicIds: readonly string[];
  readonly topicIdsByDomain: Readonly<Record<TopicDomainKey, readonly string[]>>;
  readonly topicIdsByKind: Readonly<Record<TopicKindKey, readonly string[]>>;
  readonly parentTopicIdsById: Readonly<Record<string, readonly string[]>>;
  readonly topicsById: Readonly<Record<string, RuntimeTopic>>;
}

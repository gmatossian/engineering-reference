import { TestBed } from '@angular/core/testing';
import type { RuntimeCatalog, RuntimeTopic } from '../../../contracts/runtime-catalog';
import generatedCatalog from '../../../.generated/catalog.json';
import { CatalogService } from './catalog.service';

const JAVA_TOPIC_ID = 'd3ef7c8b-ee6b-48f5-9039-2aa94d03c19c';
const ARRAYS_TOPIC_ID = '2fe75411-92f0-4e6f-bfd0-1756dc08ebe2';
const COLLECTIONS_TOPIC_ID = 'c29c5725-0b1f-480d-88f4-5c9d3b7f0dc5';
const SYSTEM_DESIGN_TOPIC_ID = '43a1a5e8-f5b7-46b7-bbd6-0fb212d7212b';
const URL_SHORTENER_TOPIC_ID = 'b19de3ee-dc7d-4d9d-9b82-06d997a825e1';
const SCALE_AND_ESTIMATION_TOPIC_ID = '17e411bb-2c99-49e8-93ec-18b767e4a890';
const TRADEOFF_TRIGGERS_TOPIC_ID = '9009159b-54aa-4724-94a2-5189a1e21437';
const PERSIST_MERGE_AND_SAVE_TOPIC_ID = 'd1a3f0d1-92a1-4c65-87a0-ee7d8d10131e';
const ENTITY_MANAGER_LIFECYCLE_TOPIC_ID = '072fc2b2-2755-45ec-aabe-d8a4740fa4e9';
const DIRTY_CHECKING_TOPIC_ID = '62196430-caa5-48c7-bb68-c064209d6291';
const ARRAYS_AND_LISTS_TOPIC_ID = 'a2fc39d5-9564-4260-b247-f38d53bedecc';
const catalog = generatedCatalog as RuntimeCatalog;

const createRootTopic = (title: string): RuntimeTopic => ({
  title,
  summary: null,
  iconKey: null,
  domains: ['java'],
  kind: 'area',
  mainContentHtml: null,
  childTopicIds: [],
  relatedTopicIds: [],
});

describe('CatalogService', () => {
  let service: CatalogService;

  beforeEach(() => {
    service = TestBed.inject(CatalogService);
  });

  it('resolves landing Topics in their declared order', () => {
    const landingTopics = service.getLandingTopics();

    expect(landingTopics.map((topic) => topic.id)).toEqual([
      JAVA_TOPIC_ID,
      '43a1a5e8-f5b7-46b7-bbd6-0fb212d7212b',
      '365bd72e-d068-4ed5-a0c3-6f134aa244d0',
      '3c36c485-9222-4124-827a-f560f6819fae',
    ]);
    expect(landingTopics[0]).toEqual({
      id: JAVA_TOPIC_ID,
      title: 'Java',
      summary: 'Core language, collections, concurrency, and persistence concepts.',
      iconKey: 'java',
    });
  });

  it('looks up a Topic by UUID', () => {
    expect(service.getTopic(JAVA_TOPIC_ID)?.title).toBe('Java');
  });

  it('exposes the expanded Topic metadata at the trusted application boundary', () => {
    expect(service.getTopic(URL_SHORTENER_TOPIC_ID)).toMatchObject({
      domains: ['system-design'],
      kind: 'exercise',
      relatedTopicIds: [
        '17e411bb-2c99-49e8-93ec-18b767e4a890',
        '9009159b-54aa-4724-94a2-5189a1e21437',
      ],
    });
  });

  it('exposes the generated discovery indexes at the trusted application boundary', () => {
    expect(catalog.allTopicIds).toContain(URL_SHORTENER_TOPIC_ID);
    expect(catalog.topicIdsByDomain['system-design']).toContain(URL_SHORTENER_TOPIC_ID);
    expect(catalog.topicIdsByKind.exercise).toEqual([URL_SHORTENER_TOPIC_ID]);
    expect(catalog.parentTopicIdsById[URL_SHORTENER_TOPIC_ID]).toEqual([SYSTEM_DESIGN_TOPIC_ID]);
  });

  it('exposes the closed domain and kind vocabularies in canonical order', () => {
    expect(service.getDomainOptions().map(({ key }) => key)).toEqual([
      'java',
      'collections',
      'concurrency',
      'persistence',
      'databases',
      'http',
      'system-design',
      'algorithms-data-structures',
    ]);
    expect(service.getDomainTopicCount('system-design')).toBe(7);
    expect(service.getDomainTopicCount('http')).toBe(2);
    expect(service.getKindOptions().map(({ key }) => key)).toEqual([
      'area',
      'concept',
      'operations',
      'decision-aid',
      'exercise',
      'pattern',
    ]);
  });

  it('normalizes whitespace and removes unsupported browse values', () => {
    expect(
      service.normalizeBrowseCriteria({
        query: '  Queue  ',
        domain: 'not-a-domain',
        kind: 'not-a-kind',
      }),
    ).toEqual({ query: 'Queue', domain: null, kind: null });
  });

  it('ranks exact, prefix, and remaining title matches deterministically', () => {
    const view = service.getTopicBrowseView({ query: 'queue', domain: null, kind: null });

    expect(view.sections[0].topics.map(({ title }) => title)).toEqual([
      'Queue',
      'Concurrent queues',
      'PriorityQueue',
    ]);
  });

  it('projects the unconstrained catalog as the complete root forest', () => {
    const view = service.getTopicBrowseView({ query: '', domain: null, kind: null });

    expect(view.mode).toBe('hierarchy');
    expect(view.resultCount).toBe(67);
    expect(view.sections).toEqual([]);
    expect(view.hierarchyRoots.map(({ title }) => title)).toEqual([
      'Java',
      'System Design',
      'HTTP',
      'Databases',
    ]);
  });

  it('intersects domain and kind filters', () => {
    const view = service.getTopicBrowseView({
      query: '',
      domain: 'system-design',
      kind: 'exercise',
    });

    expect(view.resultCount).toBe(1);
    expect(view.mode).toBe('results');
    expect(view.resultHeading).toBe('Exercises in System Design');
    expect(view.sections[0].topics.map(({ title }) => title)).toEqual(['URL shortener']);
  });

  it('projects an unconstrained root domain as a hierarchy', () => {
    const view = service.getTopicBrowseView({
      query: '',
      domain: 'system-design',
      kind: null,
    });

    expect(view.resultCount).toBe(7);
    expect(view.mode).toBe('hierarchy');
    expect(view.sections).toEqual([]);
    expect(view.hierarchyRoots.map(({ title }) => title)).toEqual(['System Design']);
    expect(view.hierarchyRoots[0].matchingTopicCount).toBe(7);
    expect(view.hierarchyRoots[0].children.map(({ title }) => title)).toEqual([
      'Scale and estimation',
      'URL shortener',
      'Trade-off triggers',
      'Pagination: offset vs cursor',
    ]);
  });

  it('keeps a small root domain in the same hierarchy presentation', () => {
    const view = service.getTopicBrowseView({ query: '', domain: 'http', kind: null });

    expect(view.mode).toBe('hierarchy');
    expect(view.hierarchyRoots.map(({ title }) => title)).toEqual(['HTTP']);
    expect(view.hierarchyRoots[0].children.map(({ title }) => title)).toEqual([
      'HTTP status codes',
    ]);
  });

  it('retains non-matching ancestors as context for a non-root domain', () => {
    const view = service.getTopicBrowseView({ query: '', domain: 'collections', kind: null });
    const java = view.hierarchyRoots[0];

    expect(view.resultCount).toBe(28);
    expect(java.title).toBe('Java');
    expect(java.matchesDomain).toBe(false);
    expect(java.matchingTopicCount).toBe(28);
    expect(java.children.map(({ title }) => title)).toEqual([
      'Arrays',
      'Collections framework',
      'Java language evolution',
    ]);
    expect(java.children[0].matchesDomain).toBe(false);
    expect(java.children[1].matchesDomain).toBe(true);
    expect(java.children[2].matchesDomain).toBe(false);
    expect(java.children[2].children.map(({ title }) => title)).toEqual(['Sequenced collections']);
  });

  it('describes filtered and searched result context explicitly', () => {
    expect(
      service.getTopicBrowseView({ query: '', domain: 'java', kind: 'concept' }).resultHeading,
    ).toBe('Concepts in Java');
    expect(
      service.getTopicBrowseView({ query: 'queue', domain: 'java', kind: 'concept' }).resultHeading,
    ).toBe('Concepts matching “queue” in Java');
    expect(
      service.getTopicBrowseView({ query: 'queue', domain: null, kind: null }).resultHeading,
    ).toBe('Results for “queue”');
  });

  it('resolves child Topics in their declared order', () => {
    const javaTopic = service.getTopic(JAVA_TOPIC_ID);

    expect(javaTopic).toBeDefined();
    expect(service.getChildTopics(javaTopic!).map((topic) => topic.id)).toEqual([
      ARRAYS_TOPIC_ID,
      COLLECTIONS_TOPIC_ID,
      '2d23f8e8-66db-4d0a-b5bc-bfc0536d5ab8',
      '750d6258-e1be-4813-9487-18c6ba78af0a',
      '57b0dc57-7a64-4c09-9140-2a470748da38',
      '78b29290-d46f-45b2-aaba-c31597ceb6d4',
    ]);
  });

  it('resolves Related Topics in their authored order with canonical metadata', () => {
    const urlShortener = service.getTopic(URL_SHORTENER_TOPIC_ID);

    expect(urlShortener).toBeDefined();
    expect(service.getRelatedTopics(urlShortener!)).toEqual([
      {
        id: SCALE_AND_ESTIMATION_TOPIC_ID,
        title: 'Scale and estimation',
        summary:
          'Turn traffic, payload, retention, and peak assumptions into useful capacity estimates.',
        iconKey: 'complexity',
        domains: [{ key: 'system-design', label: 'System Design' }],
        domainLabel: 'System Design',
        kind: { key: 'operations', label: 'Operations' },
      },
      {
        id: TRADEOFF_TRIGGERS_TOPIC_ID,
        title: 'Trade-off triggers',
        summary:
          'Turn system requirements into explicit design choices and name the cost of each bias.',
        iconKey: 'architecture',
        domains: [{ key: 'system-design', label: 'System Design' }],
        domainLabel: 'System Design',
        kind: { key: 'decision-aid', label: 'Decision aid' },
      },
    ]);
  });

  it('preserves a non-alphabetical authored Related Topics order', () => {
    const persistMergeAndSave = service.getTopic(PERSIST_MERGE_AND_SAVE_TOPIC_ID);

    expect(persistMergeAndSave).toBeDefined();
    expect(service.getRelatedTopics(persistMergeAndSave!).map(({ id }) => id)).toEqual([
      ENTITY_MANAGER_LIFECYCLE_TOPIC_ID,
      DIRTY_CHECKING_TOPIC_ID,
    ]);
  });

  it('derives graph roots with landing roots first and no synthetic root', () => {
    expect(service.getHierarchyRoots().map(({ title }) => title)).toEqual([
      'Java',
      'System Design',
      'HTTP',
      'Databases',
    ]);
  });

  it('orders non-landing roots by case-insensitive title and then UUID', () => {
    const alphaLowId = '00000000-0000-4000-8000-000000000001';
    const alphaHighId = '00000000-0000-4000-8000-000000000002';
    const zuluId = '00000000-0000-4000-8000-000000000003';
    const fallbackService = new CatalogService();
    const fallbackCatalog: RuntimeCatalog = {
      ...catalog,
      landingTopicIds: [JAVA_TOPIC_ID],
      allTopicIds: [zuluId, alphaHighId, JAVA_TOPIC_ID, alphaLowId],
      parentTopicIdsById: {
        ...catalog.parentTopicIdsById,
        [alphaLowId]: [],
        [alphaHighId]: [],
        [zuluId]: [],
      },
      topicsById: {
        ...catalog.topicsById,
        [alphaLowId]: createRootTopic('alpha'),
        [alphaHighId]: createRootTopic('Alpha'),
        [zuluId]: createRootTopic('Zulu'),
      },
    };

    Object.defineProperty(fallbackService, 'catalog', { value: fallbackCatalog });

    expect(fallbackService.getHierarchyRoots().map(({ id }) => id)).toEqual([
      JAVA_TOPIC_ID,
      alphaLowId,
      alphaHighId,
      zuluId,
    ]);
  });

  it('derives every deterministic path to a multi-parent Topic', () => {
    expect(
      service
        .getTopicPaths(ARRAYS_AND_LISTS_TOPIC_ID)
        .map((path) => path.map(({ title }) => title)),
    ).toEqual([
      ['Java', 'Arrays', 'Arrays and lists'],
      ['Java', 'Collections framework', 'List', 'Arrays and lists'],
    ]);
  });

  it('projects repeated Topic occurrences to the same canonical identity', () => {
    const occurrenceIds: string[] = [];
    const visit = (nodes: ReturnType<CatalogService['getHierarchyRoots']>): void => {
      for (const node of nodes) {
        if (node.id === ARRAYS_AND_LISTS_TOPIC_ID) {
          occurrenceIds.push(node.id);
        }
        visit(node.children);
      }
    };

    visit(service.getHierarchyRoots());

    expect(occurrenceIds).toEqual([ARRAYS_AND_LISTS_TOPIC_ID, ARRAYS_AND_LISTS_TOPIC_ID]);
  });

  it('returns no paths for an unknown Topic', () => {
    expect(service.getTopicPaths('unknown-topic')).toEqual([]);
  });

  it.each(['constructor', 'toString', '__proto__'])(
    'treats the inherited property name %s as an unknown Topic',
    (id) => {
      expect(service.getTopic(id)).toBeUndefined();
    },
  );
});

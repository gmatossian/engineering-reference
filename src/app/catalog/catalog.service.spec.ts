import { TestBed } from '@angular/core/testing';
import type { RuntimeCatalog } from '../../../contracts/runtime-catalog';
import generatedCatalog from '../../../.generated/catalog.json';
import { CatalogService } from './catalog.service';

const JAVA_TOPIC_ID = 'd3ef7c8b-ee6b-48f5-9039-2aa94d03c19c';
const ARRAYS_TOPIC_ID = '2fe75411-92f0-4e6f-bfd0-1756dc08ebe2';
const COLLECTIONS_TOPIC_ID = 'c29c5725-0b1f-480d-88f4-5c9d3b7f0dc5';
const SYSTEM_DESIGN_TOPIC_ID = '43a1a5e8-f5b7-46b7-bbd6-0fb212d7212b';
const URL_SHORTENER_TOPIC_ID = 'b19de3ee-dc7d-4d9d-9b82-06d997a825e1';
const catalog = generatedCatalog as RuntimeCatalog;

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

  it('intersects domain and kind filters', () => {
    const view = service.getTopicBrowseView({
      query: '',
      domain: 'system-design',
      kind: 'exercise',
    });

    expect(view.resultCount).toBe(1);
    expect(view.sections[0].topics.map(({ title }) => title)).toEqual(['URL shortener']);
  });

  it('separates Area overviews and groups the default System Design view by kind', () => {
    const view = service.getTopicBrowseView({
      query: '',
      domain: 'system-design',
      kind: null,
    });

    expect(view.resultCount).toBe(7);
    expect(view.sections.map(({ label }) => label)).toEqual([
      'Overviews',
      'Operations',
      'Decision aids',
      'Exercises',
    ]);
    expect(view.sections[0].topics.map(({ title }) => title)).toEqual(['System Design']);
    expect(view.sections[2].topics.map(({ title }) => title)).toEqual([
      'Choosing storage',
      'Pagination: offset vs cursor',
      'Short URL identifiers',
      'Trade-off triggers',
    ]);
  });

  it('keeps non-grouped domain results flat after optional overviews', () => {
    const view = service.getTopicBrowseView({ query: '', domain: 'http', kind: null });

    expect(view.sections.map(({ label }) => label)).toEqual(['Overviews', null]);
    expect(view.sections.flatMap(({ topics }) => topics.map(({ title }) => title))).toEqual([
      'HTTP',
      'HTTP status codes',
    ]);
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

  it.each(['constructor', 'toString', '__proto__'])(
    'treats the inherited property name %s as an unknown Topic',
    (id) => {
      expect(service.getTopic(id)).toBeUndefined();
    },
  );
});

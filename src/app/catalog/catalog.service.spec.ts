import { TestBed } from '@angular/core/testing';
import { CatalogService } from './catalog.service';

const JAVA_TOPIC_ID = 'd3ef7c8b-ee6b-48f5-9039-2aa94d03c19c';
const ARRAYS_TOPIC_ID = '2fe75411-92f0-4e6f-bfd0-1756dc08ebe2';
const COLLECTIONS_TOPIC_ID = 'c29c5725-0b1f-480d-88f4-5c9d3b7f0dc5';

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

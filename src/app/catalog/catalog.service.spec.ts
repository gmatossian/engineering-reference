import { TestBed } from '@angular/core/testing';
import { CatalogService } from './catalog.service';

const JAVA_TOPIC_ID = 'd3ef7c8b-ee6b-48f5-9039-2aa94d03c19c';
const COLLECTIONS_TOPIC_ID = 'c29c5725-0b1f-480d-88f4-5c9d3b7f0dc5';

describe('CatalogService', () => {
  let service: CatalogService;

  beforeEach(() => {
    service = TestBed.inject(CatalogService);
  });

  it('resolves landing Topics in their declared order', () => {
    expect(service.getLandingTopics()).toEqual([{ id: JAVA_TOPIC_ID, title: 'Java' }]);
  });

  it('looks up a Topic by UUID', () => {
    expect(service.getTopic(JAVA_TOPIC_ID)?.title).toBe('Java');
  });

  it('resolves child Topics in their declared order', () => {
    const javaTopic = service.getTopic(JAVA_TOPIC_ID);

    expect(javaTopic).toBeDefined();
    expect(service.getChildTopics(javaTopic!)).toEqual([
      { id: COLLECTIONS_TOPIC_ID, title: 'Collections' },
    ]);
  });

  it.each(['constructor', 'toString', '__proto__'])(
    'treats the inherited property name %s as an unknown Topic',
    (id) => {
      expect(service.getTopic(id)).toBeUndefined();
    },
  );
});

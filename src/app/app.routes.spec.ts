import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { provideRouter, Router, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from './app.routes';
import { TopicIndexPage } from './browse/topic-index-page';
import { LandingPage } from './landing/landing-page';
import { TopicNotFound } from './topic/topic-not-found';
import { TopicPage } from './topic/topic-page';

const JAVA_TOPIC_ID = 'd3ef7c8b-ee6b-48f5-9039-2aa94d03c19c';
const COLLECTIONS_TOPIC_ID = 'c29c5725-0b1f-480d-88f4-5c9d3b7f0dc5';
const COMPLEXITY_TOPIC_ID = 'bf417331-9329-42b4-9517-351ef6af3b85';
const URL_SHORTENER_TOPIC_ID = 'b19de3ee-dc7d-4d9d-9b82-06d997a825e1';
const SCALE_AND_ESTIMATION_TOPIC_ID = '17e411bb-2c99-49e8-93ec-18b767e4a890';
const TRADEOFF_TRIGGERS_TOPIC_ID = '9009159b-54aa-4724-94a2-5189a1e21437';

describe('application routes', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter(routes, withComponentInputBinding())],
    });
  });

  it('renders the ordered landing view at the application root', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/', LandingPage);

    const routeElement = harness.routeNativeElement;
    const topicLink = routeElement?.querySelector<HTMLAnchorElement>(
      'nav[aria-label="Curated paths"] a',
    );

    expect(routeElement?.querySelector('form[role="search"]')).toBeNull();
    expect(routeElement?.querySelectorAll('nav[aria-label="Domains"] a')).toHaveLength(8);
    expect(topicLink?.textContent).toContain('Java');
    expect(topicLink?.textContent).toContain(
      'Core language, collections, concurrency, and persistence concepts.',
    );
    expect(topicLink?.getAttribute('href')).toBe(`/topics/${JAVA_TOPIC_ID}`);
    expect(TestBed.inject(Title).getTitle()).toBe('Engineering Reference');
  });

  it('matches the static all-Topics route before the Topic identifier route', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/topics', TopicIndexPage);
    await harness.fixture.whenStable();

    const routeElement = harness.routeNativeElement;

    expect(routeElement?.querySelector('h1')?.textContent).toBe('All topics');
    expect(
      routeElement?.querySelectorAll(
        '.domain-hierarchy__root > .domain-hierarchy__item > .domain-hierarchy__link',
      ),
    ).toHaveLength(4);
    expect(TestBed.inject(Router).url).toBe('/topics');
    expect(TestBed.inject(Title).getTitle()).toBe('All topics | Engineering Reference');
  });

  it('renders a navigation-only Topic without an empty content region', async () => {
    const harness = await RouterTestingHarness.create();
    const topicPage = await harness.navigateByUrl(`/topics/${JAVA_TOPIC_ID}`, TopicPage);
    await harness.fixture.whenStable();

    const routeElement = harness.routeNativeElement;
    const childLink = routeElement?.querySelector<HTMLAnchorElement>(
      `nav[aria-label="Explore this topic"] a[href="/topics/${COLLECTIONS_TOPIC_ID}"]`,
    );

    expect(topicPage.id()).toBe(JAVA_TOPIC_ID);
    expect(routeElement?.querySelector('h1')?.textContent).toBe('Java');
    expect(routeElement?.querySelector('.topic-content')).toBeNull();
    expect(childLink?.textContent?.trim()).toBe('Collections framework');
    expect(childLink?.getAttribute('href')).toBe(`/topics/${COLLECTIONS_TOPIC_ID}`);
    expect(TestBed.inject(Title).getTitle()).toBe('Java | Engineering Reference');
  });

  it('renders a Topic with main content followed by its immediate children', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl(`/topics/${COLLECTIONS_TOPIC_ID}`, TopicPage);
    await harness.fixture.whenStable();

    const routeElement = harness.routeNativeElement;
    const content = routeElement?.querySelector('.topic-content');
    const childLink = routeElement?.querySelector<HTMLAnchorElement>(
      'nav[aria-label="Explore this topic"] a',
    );

    expect(content?.textContent).toContain('Declare the interface; construct a class');
    expect(childLink?.textContent?.trim()).toBe('List');
    expect(content?.compareDocumentPosition(childLink!)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  });

  it('renders a content-only Topic without an empty child-navigation region', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl(`/topics/${COMPLEXITY_TOPIC_ID}`, TopicPage);
    await harness.fixture.whenStable();

    const routeElement = harness.routeNativeElement;

    expect(routeElement?.querySelector('.topic-content table')).not.toBeNull();
    expect(routeElement?.querySelector('nav[aria-label="Explore this topic"]')).toBeNull();
    expect(routeElement?.querySelector('nav[aria-labelledby="related-topics-heading"]')).toBeNull();
  });

  it('renders ordered Related Topics after content and immediate children', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl(`/topics/${URL_SHORTENER_TOPIC_ID}`, TopicPage);
    await harness.fixture.whenStable();

    const routeElement = harness.routeNativeElement;
    const children = routeElement?.querySelector('nav[aria-label="Explore this topic"]');
    const related = routeElement?.querySelector('nav[aria-labelledby="related-topics-heading"]');
    const links = related?.querySelectorAll<HTMLAnchorElement>('a');

    expect(related?.querySelector('h2')?.textContent).toBe('Related topics');
    expect(links).toHaveLength(2);
    expect(Array.from(links ?? []).map((link) => link.getAttribute('href'))).toEqual([
      `/topics/${SCALE_AND_ESTIMATION_TOPIC_ID}`,
      `/topics/${TRADEOFF_TRIGGERS_TOPIC_ID}`,
    ]);
    expect(links?.[0].textContent).toContain('Scale and estimation');
    expect(links?.[0].textContent).toContain('Operations · System Design');
    expect(links?.[1].textContent).toContain('Decision aid · System Design');
    expect(children?.compareDocumentPosition(related!)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  });

  it('renders every contextual path for a multi-parent Topic without duplicate classification', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/topics/a2fc39d5-9564-4260-b247-f38d53bedecc', TopicPage);
    await harness.fixture.whenStable();

    const routeElement = harness.routeNativeElement;
    const paths = routeElement?.querySelectorAll('nav[aria-label="Topic paths"] ol');
    const currentPathItems = routeElement?.querySelectorAll(
      'nav[aria-label="Topic paths"] [aria-current="page"]',
    );
    expect(paths).toHaveLength(2);
    expect(paths?.[0].getAttribute('aria-label')).toBe('Path 1 of 2');
    expect(paths?.[1].textContent).toContain('Collections framework');
    expect(currentPathItems).toHaveLength(2);
    expect(routeElement?.querySelector('nav[aria-label="Topic classification"]')).toBeNull();
  });

  it('presents an unknown Topic without redirecting', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/topics/unknown-topic', TopicPage);
    await harness.fixture.whenStable();

    expect(harness.routeNativeElement?.querySelector('h1')?.textContent).toBe('Topic not found');
    expect(TestBed.inject(Router).url).toBe('/topics/unknown-topic');
    expect(TestBed.inject(Title).getTitle()).toBe('Topic not found | Engineering Reference');
  });

  it('uses the Topic-not-found view for an unmatched route', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/missing-page', TopicNotFound);

    expect(harness.routeNativeElement?.querySelector('h1')?.textContent).toBe('Topic not found');
    expect(TestBed.inject(Router).url).toBe('/missing-page');
    expect(TestBed.inject(Title).getTitle()).toBe('Topic not found | Engineering Reference');
  });
});

import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { provideRouter, Router, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from './app.routes';
import { LandingPage } from './landing/landing-page';
import { TopicNotFound } from './topic/topic-not-found';
import { TopicPage } from './topic/topic-page';

const JAVA_TOPIC_ID = 'd3ef7c8b-ee6b-48f5-9039-2aa94d03c19c';
const COLLECTIONS_TOPIC_ID = 'c29c5725-0b1f-480d-88f4-5c9d3b7f0dc5';
const COMPLEXITY_TOPIC_ID = 'bf417331-9329-42b4-9517-351ef6af3b85';

describe('application routes', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter(routes, withComponentInputBinding())],
    });
  });

  it('renders the ordered landing view at the application root', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/', LandingPage);

    const topicLink = harness.routeNativeElement?.querySelector<HTMLAnchorElement>('a');

    expect(topicLink?.textContent?.trim()).toBe('Java');
    expect(topicLink?.getAttribute('href')).toBe(`/topics/${JAVA_TOPIC_ID}`);
    expect(TestBed.inject(Title).getTitle()).toBe('Engineering Reference');
  });

  it('renders a navigation-only Topic without an empty content region', async () => {
    const harness = await RouterTestingHarness.create();
    const topicPage = await harness.navigateByUrl(`/topics/${JAVA_TOPIC_ID}`, TopicPage);
    await harness.fixture.whenStable();

    const routeElement = harness.routeNativeElement;
    const childLink = routeElement?.querySelector<HTMLAnchorElement>(
      'nav[aria-label="Subtopics"] a',
    );

    expect(topicPage.id()).toBe(JAVA_TOPIC_ID);
    expect(routeElement?.querySelector('h1')?.textContent).toBe('Java');
    expect(routeElement?.querySelector('.topic-content')).toBeNull();
    expect(childLink?.textContent?.trim()).toBe('Collections');
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
      'nav[aria-label="Subtopics"] a',
    );

    expect(content?.textContent).toContain('Collections provide standard data structures');
    expect(childLink?.textContent?.trim()).toBe('Queue');
    expect(content?.compareDocumentPosition(childLink!)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  });

  it('renders a content-only Topic without an empty child-navigation region', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl(`/topics/${COMPLEXITY_TOPIC_ID}`, TopicPage);
    await harness.fixture.whenStable();

    const routeElement = harness.routeNativeElement;

    expect(routeElement?.querySelector('.topic-content table')).not.toBeNull();
    expect(routeElement?.querySelector('nav[aria-label="Subtopics"]')).toBeNull();
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

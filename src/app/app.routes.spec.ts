import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { provideRouter, Router, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from './app.routes';
import { LandingPage } from './landing/landing-page';
import { TopicNotFound } from './topic/topic-not-found';
import { TopicPage } from './topic/topic-page';

const JAVA_TOPIC_ID = 'd3ef7c8b-ee6b-48f5-9039-2aa94d03c19c';

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

  it('binds a known Topic UUID and renders its title', async () => {
    const harness = await RouterTestingHarness.create();
    const topicPage = await harness.navigateByUrl(`/topics/${JAVA_TOPIC_ID}`, TopicPage);
    await harness.fixture.whenStable();

    expect(topicPage.id()).toBe(JAVA_TOPIC_ID);
    expect(harness.routeNativeElement?.querySelector('h1')?.textContent).toBe('Java');
    expect(TestBed.inject(Title).getTitle()).toBe('Java | Engineering Reference');
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

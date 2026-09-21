import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from '../app.routes';
import { TopicIndexPage } from './topic-index-page';

describe('TopicIndexPage', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter(routes, withComponentInputBinding())],
    });
  });

  it('renders the unconstrained catalog as four expanded root trees', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/topics', TopicIndexPage);
    await harness.fixture.whenStable();
    const host = harness.routeNativeElement as HTMLElement;

    expect(
      Array.from(host.querySelectorAll('.domain-hierarchy__root > .domain-hierarchy__item')).map(
        (item) => item.querySelector('.domain-hierarchy__title')?.textContent?.trim(),
      ),
    ).toEqual(['Java', 'System Design', 'HTTP', 'Databases']);
    expect(
      Array.from(
        host.querySelectorAll<HTMLButtonElement>(
          '.domain-hierarchy__root > .domain-hierarchy__item > button',
        ),
      ).map((button) => button.getAttribute('aria-expanded')),
    ).toEqual(['true', 'true', 'true', 'true']);
    for (const disclosure of host.querySelectorAll<HTMLButtonElement>(
      '.domain-hierarchy__disclosure',
    )) {
      expect(host.querySelector(`#${disclosure.getAttribute('aria-controls')}`)).not.toBeNull();
    }
    expect(
      Array.from(
        host.querySelectorAll('.domain-hierarchy__root > .domain-hierarchy__item app-topic-icon'),
      ).map((icon) => icon.getAttribute('data-icon-key')),
    ).toEqual(['java', 'architecture', 'architecture', 'database']);
    expect(host.querySelector('[role="status"]')?.textContent).toContain('70 topics');
  });

  it('renders the default System Design view as an expandable hierarchy', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/topics?domain=system-design', TopicIndexPage);
    await harness.fixture.whenStable();

    const host = harness.routeNativeElement as HTMLElement;
    const hierarchy = host.querySelector('app-domain-topic-hierarchy');

    expect(hierarchy).not.toBeNull();
    expect(hierarchy?.querySelector('.domain-hierarchy__title')?.textContent?.trim()).toBe(
      'System Design',
    );
    expect(
      Array.from(hierarchy?.querySelectorAll('.domain-hierarchy__children--root a') ?? []).map(
        (link) => link.querySelector('.domain-hierarchy__title')?.textContent?.trim(),
      ),
    ).toEqual([
      'Scale and estimation',
      'URL shortener',
      'Short URL identifiers',
      'Choosing storage for a URL shortener',
      'Trade-off triggers',
      'Pagination: offset vs cursor',
    ]);
    expect((host.querySelector('#topic-domain') as HTMLSelectElement).value).toBe('system-design');
    expect(host.querySelector('[role="status"]')?.textContent).toContain('7 topics');
  });

  it('normalizes unsupported query parameters into a canonical URL', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl(
      '/topics?q=%20Queue%20&domain=unknown&kind=unknown&extra=value',
      TopicIndexPage,
    );
    await harness.fixture.whenStable();

    expect(TestBed.inject(Router).url).toBe('/topics?q=Queue');
  });

  it('renders title-search results from the addressable query', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/topics?q=Queue', TopicIndexPage);
    await harness.fixture.whenStable();
    const host = harness.routeNativeElement as HTMLElement;

    expect(TestBed.inject(Router).url).toBe('/topics?q=Queue');
    expect(host.querySelector('[role="status"]')?.textContent).toContain('3 topics');
    expect(
      Array.from(host.querySelectorAll('app-topic-result-list a .result__title')).map((title) =>
        title.textContent?.trim(),
      ),
    ).toEqual(['Queue', 'Concurrent queues', 'PriorityQueue']);
  });

  it('presents friendly Topic-type labels while preserving kind query values', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/topics?kind=area', TopicIndexPage);
    await harness.fixture.whenStable();
    const host = harness.routeNativeElement as HTMLElement;
    const labels = Array.from(host.querySelectorAll('.topic-index__kind-option span')).map(
      (label) => label.textContent?.trim(),
    );
    const selectedKind = host.querySelector<HTMLInputElement>('input[name="topic-kind"]:checked');

    expect(host.querySelector('legend')?.textContent).toContain('Topic type');
    expect(labels).toEqual([
      'All types',
      'Overviews',
      'Concepts',
      'Operations',
      'Decision aids',
      'Exercises',
      'Patterns',
    ]);
    expect(selectedKind?.value).toBe('area');
    expect(host.querySelector('#topic-results-heading')?.textContent?.trim()).toBe('Overviews');
    expect(TestBed.inject(Router).url).toBe('/topics?kind=area');
  });

  it('labels a domain-and-kind result list explicitly', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/topics?domain=java&kind=concept', TopicIndexPage);
    await harness.fixture.whenStable();
    const host = harness.routeNativeElement as HTMLElement;

    expect(host.querySelector('app-domain-topic-hierarchy')).toBeNull();
    expect(host.querySelector('#topic-results-heading')?.textContent?.trim()).toBe(
      'Concepts in Java',
    );
    expect(host.querySelector('[role="status"]')?.textContent).toContain('15 topics');
  });

  it('keeps active filters visible in the no-results state', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/topics?q=does-not-exist', TopicIndexPage);
    await harness.fixture.whenStable();
    const host = harness.routeNativeElement as HTMLElement;

    expect(host.querySelector('input[type="search"]')).toBeNull();
    expect(host.querySelectorAll('select')).toHaveLength(1);
    expect(host.querySelectorAll('input[type="radio"]')).toHaveLength(7);
    expect(host.querySelector('.topic-index__empty')?.textContent).toContain(
      'No topics match the title “does-not-exist”.',
    );
    expect(host.querySelector('[role="status"]')?.textContent).toContain('0 topics');
  });
});

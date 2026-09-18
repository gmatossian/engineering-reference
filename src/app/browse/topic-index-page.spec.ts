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

  it('renders Area overviews and grouped System Design results', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/topics?domain=system-design', TopicIndexPage);
    await harness.fixture.whenStable();

    const host = harness.routeNativeElement as HTMLElement;
    const headings = Array.from(host.querySelectorAll('app-topic-result-list h2')).map((heading) =>
      heading.textContent?.trim(),
    );

    expect(headings).toEqual(['Overviews', 'Operations', 'Decision aids', 'Exercises']);
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
      'All',
      'Overviews',
      'Concepts',
      'Operations',
      'Decision aids',
      'Exercises',
      'Patterns',
    ]);
    expect(selectedKind?.value).toBe('area');
    expect(TestBed.inject(Router).url).toBe('/topics?kind=area');
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

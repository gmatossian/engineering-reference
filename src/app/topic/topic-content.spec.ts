import { TestBed } from '@angular/core/testing';
import { TopicContent } from './topic-content';

describe('TopicContent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TopicContent] }).compileComponents();
  });

  it('renders supported generated HTML semantically', () => {
    const fixture = TestBed.createComponent(TopicContent);
    fixture.componentRef.setInput(
      'html',
      [
        '<p>Queue operations</p>',
        '<h2>Complexity</h2>',
        '<h3>Amortized cost</h3>',
        '<div class="topic-content-overflow" role="region" aria-label="Complexity code block" tabindex="0"><pre><code class="language-java">queue.offer(value);</code></pre></div>',
        '<div class="topic-content-overflow" role="region" aria-label="Complexity table" tabindex="0"><table><thead><tr><th>Operation</th></tr></thead><tbody><tr><td>offer</td></tr></tbody></table></div>',
        '<p><img src="/assets/topics/queue.svg" alt="Queue operations"></p>',
        '<p><a href="https://example.com/reference">External reference</a></p>',
      ].join(''),
    );
    fixture.componentRef.setInput('outline', [
      {
        children: [
          {
            children: [],
            fragment: 'section-amortized-cost',
            label: 'Amortized cost',
          },
        ],
        fragment: 'section-complexity',
        label: 'Complexity',
      },
    ]);
    fixture.detectChanges();

    const content = fixture.nativeElement.querySelector('.topic-content') as HTMLElement;

    expect(content.querySelector('p')?.textContent).toContain('Queue operations');
    const heading = content.querySelector('h2');

    expect(heading?.textContent).toBe('Complexity');
    expect(heading?.id).toBe('section-complexity');
    expect(heading?.getAttribute('tabindex')).toBe('-1');
    expect(content.querySelector('h3')?.id).toBe('section-amortized-cost');
    expect(content.querySelector('h3')?.getAttribute('tabindex')).toBe('-1');
    expect(content.querySelector('code.language-java')?.textContent).toBe('queue.offer(value);');
    expect(content.querySelector('th')?.textContent).toBe('Operation');
    expect(content.querySelector('td')?.textContent).toBe('offer');
    expect(content.querySelector('img')?.getAttribute('alt')).toBe('Queue operations');
    expect(content.querySelector('a')?.getAttribute('href')).toBe('https://example.com/reference');
    expect(content.querySelector('a')?.getAttribute('target')).toBeNull();

    const overflowRegions = [...content.querySelectorAll<HTMLElement>('.topic-content-overflow')];

    expect(overflowRegions).toHaveLength(2);
    expect(overflowRegions.map((region) => region.getAttribute('role'))).toEqual([
      'region',
      'region',
    ]);
    expect(overflowRegions.map((region) => region.getAttribute('aria-label'))).toEqual([
      'Complexity code block',
      'Complexity table',
    ]);
    expect(overflowRegions.map((region) => region.tabIndex)).toEqual([0, 0]);
  });
});

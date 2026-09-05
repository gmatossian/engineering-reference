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
        '<pre><code class="language-java">queue.offer(value);</code></pre>',
        '<table><thead><tr><th>Operation</th></tr></thead><tbody><tr><td>offer</td></tr></tbody></table>',
        '<p><img src="/assets/topics/queue.svg" alt="Queue operations"></p>',
        '<p><a href="https://example.com/reference">External reference</a></p>',
      ].join(''),
    );
    fixture.detectChanges();

    const content = fixture.nativeElement.querySelector('.topic-content') as HTMLElement;

    expect(content.querySelector('p')?.textContent).toContain('Queue operations');
    expect(content.querySelector('h2')?.textContent).toBe('Complexity');
    expect(content.querySelector('code.language-java')?.textContent).toBe('queue.offer(value);');
    expect(content.querySelector('th')?.textContent).toBe('Operation');
    expect(content.querySelector('td')?.textContent).toBe('offer');
    expect(content.querySelector('img')?.getAttribute('alt')).toBe('Queue operations');
    expect(content.querySelector('a')?.getAttribute('href')).toBe('https://example.com/reference');
    expect(content.querySelector('a')?.getAttribute('target')).toBeNull();
  });
});

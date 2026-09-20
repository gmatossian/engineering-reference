import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TopicOutline } from './topic-outline';

describe('TopicOutline', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopicOutline],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('renders heading fragments as nested unordered navigation', () => {
    const fixture = TestBed.createComponent(TopicOutline);
    fixture.componentRef.setInput('topicPath', '/topics/topic-id');
    fixture.componentRef.setInput('items', [
      {
        children: [
          {
            children: [],
            fragment: 'section-query-scoped-example',
            label: 'Query-scoped example',
          },
        ],
        fragment: 'section-choose-a-loading-tool',
        label: 'Choose a loading tool',
      },
      {
        children: [],
        fragment: 'section-guardrails',
        label: 'Guardrails',
      },
    ]);
    fixture.detectChanges();

    const navigation = fixture.nativeElement.querySelector('nav') as HTMLElement;
    const lists = navigation.querySelectorAll('ul');
    const links = navigation.querySelectorAll<HTMLAnchorElement>('a');

    expect(navigation.getAttribute('aria-labelledby')).toBe('topic-outline-heading');
    expect(navigation.querySelector('h2')?.textContent).toBe('On this page');
    expect(lists).toHaveLength(2);
    expect(lists[1].classList).toContain('topic-outline__nested');
    expect([...links].map((link) => link.textContent?.trim())).toEqual([
      'Choose a loading tool',
      'Query-scoped example',
      'Guardrails',
    ]);
    expect([...links].map((link) => link.getAttribute('href'))).toEqual([
      '/topics/topic-id#section-choose-a-loading-tool',
      '/topics/topic-id#section-query-scoped-example',
      '/topics/topic-id#section-guardrails',
    ]);
  });
});

import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TopicLinkList } from './topic-link-list';

describe('TopicLinkList', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopicLinkList],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('renders ordered Topic summaries as native links', () => {
    const fixture = TestBed.createComponent(TopicLinkList);
    fixture.componentRef.setInput('ariaLabel', 'Subtopics');
    fixture.componentRef.setInput('topics', [
      { id: 'first-topic', title: 'First' },
      { id: 'second-topic', title: 'Second' },
    ]);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const navigation = host.querySelector('nav') as HTMLElement;
    const links = Array.from(host.querySelectorAll<HTMLAnchorElement>('a'));

    expect(navigation.getAttribute('aria-label')).toBe('Subtopics');
    expect(links.map((link) => link.textContent?.trim())).toEqual(['First', 'Second']);
    expect(links.map((link) => link.getAttribute('href'))).toEqual([
      '/topics/first-topic',
      '/topics/second-topic',
    ]);
  });
});

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

  it('renders ordered child Topics as native links without card summaries', () => {
    const fixture = TestBed.createComponent(TopicLinkList);
    fixture.componentRef.setInput('ariaLabel', 'Subtopics');
    fixture.componentRef.setInput('topics', [
      { id: 'first-topic', title: 'First', summary: 'First summary', iconKey: 'java' },
      { id: 'second-topic', title: 'Second', summary: null, iconKey: null },
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
    expect(host.querySelector('.topic-link__summary')).toBeNull();
    expect(
      Array.from(host.querySelectorAll('app-topic-icon')).map((icon) =>
        icon.getAttribute('data-icon-key'),
      ),
    ).toEqual(['java', 'generic']);
  });

  it('renders card summaries and keeps the entire card as one link', () => {
    const fixture = TestBed.createComponent(TopicLinkList);
    fixture.componentRef.setInput('ariaLabel', 'Topics');
    fixture.componentRef.setInput('presentation', 'cards');
    fixture.componentRef.setInput('topics', [
      {
        id: 'java-topic',
        title: 'Java',
        summary: 'Language and runtime concepts.',
        iconKey: 'java',
      },
    ]);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const link = host.querySelector('a') as HTMLAnchorElement;

    expect(host.querySelectorAll('a')).toHaveLength(1);
    expect(link.textContent).toContain('Java');
    expect(link.textContent).toContain('Language and runtime concepts.');
    expect(link.getAttribute('data-icon-key')).toBe('java');
    expect(link.querySelector('app-topic-icon')?.getAttribute('aria-hidden')).toBe('true');
  });
});

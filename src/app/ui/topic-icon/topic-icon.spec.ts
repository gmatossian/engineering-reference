import { TestBed } from '@angular/core/testing';
import { TopicIcon } from './topic-icon';

describe('TopicIcon', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TopicIcon] }).compileComponents();
  });

  it('renders a supported decorative icon', () => {
    const fixture = TestBed.createComponent(TopicIcon);
    fixture.componentRef.setInput('iconKey', 'queue');
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;

    expect(host.getAttribute('data-icon-key')).toBe('queue');
    expect(host.getAttribute('aria-hidden')).toBe('true');
    const image = host.querySelector<HTMLImageElement>('img');

    expect(image?.getAttribute('src')).toBe('icons/topics/queue.svg');
    expect(image?.getAttribute('alt')).toBe('');
  });

  it('renders the generic fallback when no icon key is supplied', () => {
    const fixture = TestBed.createComponent(TopicIcon);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;

    expect(host.getAttribute('data-icon-key')).toBe('generic');
    expect(host.querySelector('img')?.getAttribute('src')).toBe('icons/topics/generic.svg');
  });
});

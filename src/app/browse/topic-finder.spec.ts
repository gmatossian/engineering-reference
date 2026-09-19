import { TestBed } from '@angular/core/testing';
import { TopicFinder } from './topic-finder';

describe('TopicFinder', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TopicFinder] }).compileComponents();
  });

  it('uses a labelled native search form and emits the entered query on submit', () => {
    const fixture = TestBed.createComponent(TopicFinder);
    fixture.componentRef.setInput('inputId', 'finder');
    fixture.componentRef.setInput('label', 'Find a topic');
    fixture.componentRef.setInput('buttonLabel', 'Find topic');
    const submittedQueries: string[] = [];
    fixture.componentInstance.searchSubmit.subscribe((query) => submittedQueries.push(query));
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const input = host.querySelector('input') as HTMLInputElement;
    const form = host.querySelector('form') as HTMLFormElement;
    input.value = 'Choosing storage';
    input.dispatchEvent(new Event('input'));
    form.dispatchEvent(new SubmitEvent('submit'));

    expect(host.querySelector('label')?.getAttribute('for')).toBe('finder');
    expect(input.type).toBe('search');
    expect(submittedQueries).toEqual(['Choosing storage']);
  });
});

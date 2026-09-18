import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the application navigation', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const homeLinks = compiled.querySelectorAll<HTMLAnchorElement>('a[href="/"]');
    const allTopicsLink = compiled.querySelector<HTMLAnchorElement>('a[href="/topics"]');
    const backButton = compiled.querySelector<HTMLButtonElement>('button');
    const search = compiled.querySelector<HTMLInputElement>('#header-topic-search');

    expect(homeLinks).toHaveLength(1);
    expect(homeLinks[0].textContent?.trim()).toBe('Engineering Reference');
    expect(allTopicsLink?.textContent?.trim()).toBe('All topics');
    expect(backButton?.textContent?.trim()).toContain('Back');
    expect(backButton?.disabled).toBe(window.history.length <= 1);
    expect(search?.getAttribute('type')).toBe('search');
    expect(search?.labels?.[0]?.textContent).toContain('Search topics');
  });
});

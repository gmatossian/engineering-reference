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
    const backButton = compiled.querySelector<HTMLButtonElement>('button');

    expect(homeLinks).toHaveLength(1);
    expect(homeLinks[0].textContent?.trim()).toBe('Engineering Reference');
    expect(backButton?.textContent?.trim()).toContain('Back');
    expect(backButton?.disabled).toBe(window.history.length <= 1);
  });
});

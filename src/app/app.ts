import { DOCUMENT, Location } from '@angular/common';
import { Component, DestroyRef, inject, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink, RouterOutlet, Scroll as RouterScroll } from '@angular/router';
import { filter } from 'rxjs';
import { TopicFinder } from './browse/topic-finder';

@Component({
  imports: [RouterLink, RouterOutlet, TopicFinder],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly location = inject(Location);
  private readonly router = inject(Router);
  private previousRoutePath = this.getRoutePath(this.router.url);
  private readonly headerFinder = viewChild<TopicFinder>('headerFinder');

  protected readonly headerSearchExpanded = signal(false);
  protected readonly headerSearchQuery = signal(this.getSearchQuery(this.router.url));

  constructor() {
    this.router.events
      .pipe(
        filter((event): event is RouterScroll => event instanceof RouterScroll),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((event) => {
        this.headerSearchQuery.set(this.getSearchQuery(event.routerEvent.url));
        const routePath = this.getRoutePath(event.routerEvent.url);

        // Preserve the browser's normal focus behavior on the initial document load.
        if (event.routerEvent.id === 1) {
          this.previousRoutePath = routePath;
          return;
        }

        const viewWasReplaced = routePath !== this.previousRoutePath;
        this.previousRoutePath = routePath;

        // Query and filter changes update the current index view in place. Keep
        // focus on the control the reader is operating.
        if (!viewWasReplaced) {
          return;
        }

        this.document.defaultView?.requestAnimationFrame(() => {
          const heading = this.document.querySelector<HTMLElement>('.application-main h1');

          if (event.position === null) {
            heading?.focus();
          } else {
            heading?.focus({ preventScroll: true });
          }
        });
      });
  }

  protected get backUnavailable(): boolean {
    const browserWindow = this.document.defaultView;
    return browserWindow === null || browserWindow.history.length <= 1;
  }

  protected goBack(): void {
    if (!this.backUnavailable) {
      this.location.back();
    }
  }

  protected searchTopics(query: string): void {
    const normalizedQuery = query.trim();
    const currentUrl = this.router.parseUrl(this.router.url);
    const isTopicIndex = this.getRoutePath(this.router.url) === '/topics';
    const queryParams = isTopicIndex ? { ...currentUrl.queryParams } : {};

    queryParams['q'] = normalizedQuery || null;
    void this.router.navigate(['/topics'], {
      queryParams,
      replaceUrl: isTopicIndex,
    });

    if (!isTopicIndex) {
      this.headerSearchExpanded.set(false);
    }
  }

  protected toggleHeaderSearch(): void {
    const expanded = !this.headerSearchExpanded();
    this.headerSearchExpanded.set(expanded);

    if (expanded) {
      this.document.defaultView?.requestAnimationFrame(() => this.headerFinder()?.focus());
    }
  }

  private getRoutePath(url: string): string {
    return url.split(/[?#]/, 1)[0];
  }

  private getSearchQuery(url: string): string {
    const query = this.router.parseUrl(url).queryParams['q'];
    return typeof query === 'string' ? query : '';
  }
}

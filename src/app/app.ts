import { DOCUMENT, Location } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink, RouterOutlet, Scroll as RouterScroll } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  imports: [RouterLink, RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly location = inject(Location);
  private readonly router = inject(Router);

  constructor() {
    this.router.events
      .pipe(
        filter((event): event is RouterScroll => event instanceof RouterScroll),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((event) => {
        // Preserve the browser's normal focus behavior on the initial document load.
        if (event.routerEvent.id === 1) {
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
}

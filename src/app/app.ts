import { DOCUMENT, Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  imports: [RouterLink, RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  private readonly document = inject(DOCUMENT);
  private readonly location = inject(Location);

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

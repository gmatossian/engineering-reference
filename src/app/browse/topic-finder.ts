import { Component, ElementRef, inject, input, linkedSignal, output } from '@angular/core';

@Component({
  selector: 'app-topic-finder',
  styleUrl: './topic-finder.css',
  templateUrl: './topic-finder.html',
})
export class TopicFinder {
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly appearance = input<'default' | 'compact'>('default');
  readonly buttonLabel = input<string | null>(null);
  readonly inputId = input.required<string>();
  readonly label = input.required<string>();
  readonly placeholder = input('');
  readonly value = input('');

  readonly queryChange = output<string>();
  readonly searchSubmit = output<string>();

  protected readonly currentValue = linkedSignal(() => this.value());

  protected handleInput(event: Event): void {
    const value = (event.currentTarget as HTMLInputElement).value;
    this.currentValue.set(value);
    this.queryChange.emit(value);
  }

  protected submit(): void {
    this.searchSubmit.emit(this.currentValue());
  }

  focus(): void {
    this.element.nativeElement.querySelector<HTMLInputElement>('input')?.focus();
  }
}

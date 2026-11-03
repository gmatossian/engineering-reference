---
id: '253aba39-8aed-4a85-94fb-7f09406e72d3'
title: 'Signals and Observables'
status: 'accepted'
summary: 'Choose async, toSignal or writable signals by how you consume and change a value; compare signals and Observables.'
iconKey: 'tradeoff'
domains:
  - 'javascript'
kind: 'decision-aid'
childTopicIds: []
relatedTopicIds:
  - 'f7aa760f-30aa-43da-8746-20a39e39529e'
  - '6b2a1c19-acaa-4793-9e8a-7a783564bde5'
---

## Choose how to consume and change a value

**Both signals and Observables can supply data displayed in the UI.**

| What you want                                     | Starting point      |
| ------------------------------------------------- | ------------------- |
| **Display values** supplied by an Observable      | `async` pipe        |
| Combine Observable results **with other signals** | `toSignal()`        |
| Keep a value your component **changes directly**  | Writable `signal()` |

## Compare the abstractions

|           | Signal                     | Observable                     |
| --------- | -------------------------- | ------------------------------ |
| Consume   | `state()`                  | `subscribe()` or `async`       |
| Derive    | `computed(...)`            | `map(...)` and other operators |
| End/error | No completion/error events | Can complete or error          |

> **Observables can hold state too:** `BehaviorSubject` retains a current value;
> `ReplaySubject` can replay buffered values to new subscribers.

**RxJS operators:**

- `debounceTime` — wait for a pause in input.
- `switchMap` — keep the latest request; unsubscribe from the previous one.
- `retry` — retry failed requests.

Unsubscribing stops delivery to **that subscriber**. For a direct Angular
`HttpClient` request, it also **aborts the in-flight request**.
**Server work is not rolled back:** the operation may already have completed or
may continue on the server. For other Observable sources, stopping the underlying
work depends on their cleanup behavior.

> **An Observable does not necessarily emit asynchronously.** For example,
> `of(42)` emits immediately when subscribed to.

## Combine them for the product list

```text
HTTP Observable
      ↓ response
products.set(response)
      ↓ stored state
Template reads products()
```

The HTTP request starts when subscribed. Each emitted value is passed to
`products.set(...)`. **Reading `products()` returns the stored value; it does not
send another request.**

## Follow a source or change the stored value

**Combine fetched products with a local search signal:**

```ts
products = toSignal(this.api.getAll(), { initialValue: [] });
search = signal('');

filteredProducts = computed(() => {
  const search = this.search();
  return this.products().filter((p) => p.name.includes(search));
});
```

The filtered list recalculates when **products or search changes**;
the template reads `filteredProducts()`. Useful when the component already uses signals.

**Store the response — writable signal:**

```ts
products = signal<Product[]>([]);
private readonly destroyRef = inject(DestroyRef);

ngOnInit(): void {
  this.api.getAll()
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(products => this.products.set(products));
}

// After a successful deletion, change the displayed list locally:
removeFromList(id: string): void {
  this.products.update(products => products.filter(p => p.id !== id));
}
```

`toSignal()` manages destruction cleanup automatically; the manual subscription
above uses `takeUntilDestroyed`.

> **`toSignal()` follows the source; a writable signal lets you change the stored state yourself.**
> A plain variable does not provide signal dependency tracking.

## Show request errors with `async`

**Unhandled error → `ErrorHandler`** (console logging by default).
The pipe **does not display an error message or retry**. If the first request
fails before emitting, its value remains `null`.

Use `catchError` to **emit an error state the template can display**:

```ts
readonly productsState$ = this.api.getAll().pipe(
  map(products => ({ products, error: '' })),
  catchError(() => of({ products: [], error: 'Failed to load products.' })),
);
```

```angular-html
@if (productsState$ | async; as state) {
  @if (state.error) {
    <p role="alert">{{ state.error }}</p>
  } @else {
    @for (product of state.products; track product.id) {
      <p>{{ product.name }}</p>
    }
  }
}
```

**Create the request Observable once in a component property.** Calling
`api.getAll()` inside the template creates a new Observable each time the
expression is evaluated, which can cause `async` to **resubscribe and send repeated
requests**.

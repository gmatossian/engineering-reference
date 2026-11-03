---
id: '6b2a1c19-acaa-4793-9e8a-7a783564bde5'
title: 'HTTP services and dependency injection'
status: 'accepted'
summary: 'Declare and inject a typed HTTP service, then handle its result, pending state and errors in a component.'
iconKey: 'network'
domains:
  - 'javascript'
  - 'http'
kind: 'operations'
childTopicIds: []
relatedTopicIds:
  - 'b35c83b3-ae4d-405b-a06c-21bc3d24bfd5'
  - '253aba39-8aed-4a85-94fb-7f09406e72d3'
---

## Do I need to provide HttpClient?

**Angular 21+ provides `HttpClient` by default.** Inject it directly for basic
requests. Use `provideHttpClient(...)` in `app.config.ts` to configure features
such as interceptors. Older Angular versions can require explicit HTTP
provisioning.

## Declare the service

**`product-service.ts`**

```typescript
@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);

  getById(id: string): Observable<Product> {
    const url = `/products/${id}`;
    return this.http.get<Product>(url);
  }
}
```

**`product.ts`**

```typescript
export interface Product {
  id: string;
  sku: string;
  name: string;
  price: number;
}
```

`providedIn: 'root'` registers the service with the **application root injector**.
Consumers use `inject(ProductService)`; services do **not** go in a component's
template `imports`.

> **Calling `getById()` creates an Observable; subscribing sends the request.**
> Each subscription to this HTTP Observable sends another request.

## Consume the result in a component

The HTTP Observable delivers the response; signals retain **what the template
should display**.

Angular supplies **`DestroyRef` without manual registration**; here it refers to
the component's lifetime.

**`product-lookup.ts`**

```typescript
@Component({
  selector: 'app-product-lookup',
  templateUrl: './product-lookup.html',
})
export class ProductLookup {
  private readonly api = inject(ProductService);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly product = signal<Product | null>(null);
  protected readonly pending = signal(false);
  protected readonly error = signal('');

  protected load(id: string): void {
    if (this.pending()) return;
    this.product.set(null);
    this.error.set('');
    this.pending.set(true);

    this.api
      .getById(id)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.pending.set(false)),
      )
      .subscribe({
        next: (product) => this.product.set(product),
        error: () => this.error.set('Product lookup failed.'),
      });
  }
}
```

**`product-lookup.html`**

```angular
<label for="product-id">Product ID</label>
<input id="product-id" #id />
<button type="button" [disabled]="pending()" (click)="load(id.value)">Find product</button>

@if (pending()) {
  <p role="status">Loading…</p>
}
@if (error()) {
  <p role="alert">{{ error() }}</p>
}
@if (product(); as found) {
  <p>{{ found.name }}</p>
}
```

`takeUntilDestroyed(this.destroyRef)` unsubscribes when the component is destroyed.
Pass the injected reference because the click handler runs **outside an injection
context**. `finalize()` also clears pending state on error or cancellation.

## HTTP boundaries

- **`<Product>` does not validate the JSON response.** It supplies the TypeScript
  result type; validate untrusted response data when the API boundary requires it.
- **Relative `/products/...` uses the page's origin.** A development proxy or the
  production host must route it to the API. See the related proxy topic.

For creation, the corresponding call is `http.post<Product>(url, body)`;
the backend still validates the submitted data.

---
id: '88a16c45-cb2c-45e5-a067-445166a3f509'
title: 'Pass data and events between components'
status: 'accepted'
summary: 'Choose inputs, outputs, child methods or service injection, and make component dependencies explicit.'
iconKey: 'operations'
domains:
  - 'javascript'
kind: 'pattern'
childTopicIds: []
relatedTopicIds:
  - '6b2a1c19-acaa-4793-9e8a-7a783564bde5'
  - '8f0eac15-f8c7-4a92-80bb-0c45ff6b4e87'
---

## Choose the boundary

| Need                                  | Use                          |
| ------------------------------------- | ---------------------------- |
| Supply data to a child                | `input()` + `[property]`     |
| Receive an action from a child        | `output()` + `(event)`       |
| Open or focus child UI                | `viewChild()` + child method |
| Access API or shared feature behavior | Inject a service             |

**Inputs and outputs define a data/event contract.** A child that also injects
an API service still depends on that service.

## Pass data down and actions up

```text
ProductsPage ── [product] ───────→ ProductRow
ProductsPage ←─ (editRequested) ── ProductRow
```

**`product-row.ts`**

```typescript
import { Component, input, output } from '@angular/core';

export interface Product {
  id: string;
  name: string;
}

@Component({
  selector: 'app-product-row',
  template: `
    <span>{{ product().name }}</span>
    <button type="button" (click)="editRequested.emit(product())">Edit</button>
  `,
})
export class ProductRow {
  readonly product = input.required<Product>();
  readonly editRequested = output<Product>();
}
```

**`products-page.ts`**

```typescript
import { Component, signal } from '@angular/core';
import { Product, ProductRow } from './product-row';

@Component({
  imports: [ProductRow],
  template: `
    <app-product-row [product]="selectedProduct()" (editRequested)="beginEdit($event)" />
    @if (editingProduct(); as product) {
      <p role="status">Editing {{ product.name }}</p>
    }
  `,
})
export class ProductsPage {
  protected readonly selectedProduct = signal<Product>({ id: 'p1', name: 'Notebook' });
  protected readonly editingProduct = signal<Product | null>(null);

  protected beginEdit(product: Product): void {
    this.editingProduct.set(product);
  }
}
```

- **Read an input with `product()`**; `input.required` requires the parent binding.
- **`$event` is the emitted payload** — here a `Product`, not a browser event.
- **Emit an action instead of mutating the input object.** Read-only input signals
  do not make the objects they hold deeply immutable.

## Choose who calls the API

| Put API calls in…      | When it fits                      | Cost                                    |
| ---------------------- | --------------------------------- | --------------------------------------- |
| Parent/coordinator     | Reuse the child across features   | Parent handles events and request state |
| Feature-specific child | Child owns that feature operation | Child depends on the API service        |

A reusable form can still own **controls, validation and local interaction state**.
The parent can receive submitted values and call the service. These roles are
sometimes called container/smart and presentational/dumb; they are **design choices,
not Angular component types**.

## Call a child method for a UI action

For an existing `ProductEditDialog` with an `open(product)` method, the parent
renders the child and calls its public method:

```angular-html
<app-product-edit-dialog />
<button type="button" (click)="openEditor(selectedProduct())">Edit</button>
```

```typescript
private readonly editor = viewChild.required(ProductEditDialog);

protected openEditor(product: Product): void {
  this.editor().open(product);
}
```

The parent imports `ProductEditDialog` in its component `imports`.
**`viewChild` finds the rendered child; it does not create one.** Access it after
rendering, such as from a click handler. `required` assumes the child is present;
for a conditional child, use `viewChild(ProductEditDialog)` and check for `undefined`.

The parent now depends on the child's **method API**. Use this for actions such as
open/focus; use inputs and outputs for ordinary data and event exchange.

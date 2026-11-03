---
id: 'f7aa760f-30aa-43da-8746-20a39e39529e'
title: 'Components and template state'
status: 'accepted'
summary: 'Recover component composition, signal-backed state, bindings, and list rendering.'
iconKey: 'operations'
domains:
  - 'javascript'
kind: 'operations'
childTopicIds:
  - '88a16c45-cb2c-45e5-a067-445166a3f509'
relatedTopicIds:
  - '253aba39-8aed-4a85-94fb-7f09406e72d3'
---

## Component and template

**`product-preview.ts`**

```typescript
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-product-preview',
  templateUrl: './product-preview.html',
})
export class ProductPreview {
  protected readonly products = signal([{ id: 1, name: 'Notebook' }]);

  protected clear(): void {
    this.products.set([]);
  }
}
```

**`product-preview.html`**

```angular
<p>{{ products().length }} products</p>

<button type="button" [disabled]="products().length === 0" (click)="clear()">Clear preview</button>

<ul>
  @for (product of products(); track product.id) {
    <li>{{ product.name }}</li>
  } @empty {
    <li>No products</li>
  }
</ul>
```

## Use a component in another template

A **standalone component** can be imported directly in the parent's `imports`;
it does not need an `NgModule` declaration. **Angular 19+ defaults to standalone**,
so these examples omit `standalone: true`.

```typescript
import { Component } from '@angular/core';
import { ProductPreview } from './product-preview';

@Component({
  imports: [ProductPreview],
  template: '<app-product-preview />',
})
export class ProductsPage {}
```

## Read and change state

Signals retain **current template state** and notify Angular when it changes.

- **Read:** `products()`; omitting `()` refers to the signal itself.
- **Replace:** `products.set(nextProducts)`.
- **Derive a new value:** `products.update(current => [...current, nextProduct])`.

**Return a new array/object when changing signal state.** Mutating the current
array with `push()` does not itself notify signal consumers.

The template uses **`{{ ... }}` for text**, **`[property]` for values** and
**`(event)` for handlers**.

`protected` members remain usable by the template. A `readonly` signal field
prevents replacing the signal reference; **`.set()` and `.update()` still work**.

## Render a list

- **`track` is required.** Use a stable unique key, such as `track product.id`,
  so Angular can reuse rows when data changes or a refresh returns new objects.
- **Use `track $index` for static lists** whose membership and order never change.

`@empty` renders when the collection is empty. Built-in control flow needs no
`CommonModule` import.

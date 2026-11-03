---
id: '8f0eac15-f8c7-4a92-80bb-0c45ff6b4e87'
title: 'Forms and validation'
status: 'accepted'
summary: 'Wire a reactive form, choose where to declare validators, and handle submission without page navigation.'
iconKey: 'operations'
domains:
  - 'javascript'
kind: 'operations'
childTopicIds: []
relatedTopicIds:
  - 'f7aa760f-30aa-43da-8746-20a39e39529e'
  - '6b2a1c19-acaa-4793-9e8a-7a783564bde5'
---

## Choose submission and field state

| Need                                         | Add                                           |
| -------------------------------------------- | --------------------------------------------- |
| Submit by button or Enter                    | `<form>` + submit button                      |
| Track field values, validity and interaction | `FormControl`; `FormGroup` for related fields |

**These choices combine:** a `<form>` does not require a `FormGroup`.
Use an `(input)` handler for immediate reactions to typing, with or without a form.

## Wire a reactive form

```text
form: FormGroup   ↔ [formGroup]="form"
form.controls.sku ↔ formControlName="sku"
```

**`sku-form.ts`**

```typescript
import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-sku-form',
  imports: [ReactiveFormsModule],
  templateUrl: './sku-form.html',
})
export class SkuForm {
  protected readonly form = new FormGroup({
    sku: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(32), Validators.pattern(/\S/)],
    }),
  });
  protected readonly submittedSku = signal('');

  protected submit(): void {
    if (this.form.invalid) return;
    this.submittedSku.set(this.form.controls.sku.value);
  }
}
```

**`sku-form.html`**

```angular
<form [formGroup]="form" (ngSubmit)="submit()">
  <label for="sku">SKU</label>
  <input id="sku" formControlName="sku" required maxlength="32" aria-describedby="sku-error" />
  @if (form.controls.sku.touched && form.controls.sku.invalid) {
    <p id="sku-error">Enter a nonblank SKU of at most 32 characters.</p>
  }
  <button type="submit" [disabled]="form.invalid">Submit</button>
</form>
@if (submittedSku()) {
  <p role="status">Submitted {{ submittedSku() }}</p>
}
```

`nonNullable: true` keeps the control typed as `string`; **it is not an empty-input validator**.

## Choose where validation lives

| Declare rules in      | Rules apply…                            | Useful for                     |
| --------------------- | --------------------------------------- | ------------------------------ |
| TypeScript validators | **Without rendering an input**          | Custom rules; model-only tests |
| Template attributes   | When **attached to an Angular control** | Simple built-in rules          |

**Either can supply supported rules, including with reactive forms.** If both
are present, **all attached validators apply**; neither location overrides the other.

Keeping HTML attributes can still serve a separate purpose: **`maxlength` limits
typing** and **`required` identifies a required field**, even when the rule also
exists in TypeScript. Bare attributes do not create Angular controls.

> **Sharing UI/backend rules:** basic field constraints can come from a shared
> schema. Supported Java validation annotations can feed an OpenAPI schema, then a
> generator or adapter can produce Angular validators. **Generated types alone do
> not enforce validation.**

## Submit without navigation

- **Angular forms:** use `(ngSubmit)`, without an additional `(submit)` handler or
  `preventDefault()`. A submit button and Enter can both trigger submission.
- **Keep the handler guard**, even when the button is disabled. For an API call,
  also block duplicate requests: `if (this.form.invalid || this.pending()) return;`.

**A lookup without Angular controls:**

```angular
<form ngNoForm (submit)="$event.preventDefault(); load(productId.value)">
  <label for="lookup-id">Product ID</label>
  <input id="lookup-id" #productId type="text" required />
  <button type="submit">Find product</button>
</form>
```

`#productId` references the input; `.value` reads its text. No Angular forms
import is needed. **`ngNoForm` keeps this form native**, even if `FormsModule` or
`ReactiveFormsModule` is imported: the browser enforces `required`, and the
handler prevents navigation.

> **Angular forms normally disable browser validation.** With reactive controls,
> display errors from control state. To use `(ngSubmit)` without a `FormGroup`,
> import `FormsModule`; add `ngNativeValidate` if relying on browser `required` or
> `pattern` checks.

## Avoid validation gaps

- **`required` accepts whitespace-only text.** Add `Validators.pattern(/\S/)`
  when spaces alone must be rejected.
- **`step="0.01"` is not an Angular decimal validator.** Add a validator if Angular
  form validity must enforce decimal precision.
- **Keep field state separate from request state.** Controls track values and
  validity; a request's `pending`/`error` state belongs to the API operation.
- **Validate on the server too.** Client checks can be bypassed.

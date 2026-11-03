---
id: 'fe994f41-dbc9-456c-b50e-53d3a4a9719c'
title: 'Choose where to provide a dependency'
status: 'accepted'
summary: 'Choose application, route or component scope and recognize when a provider creates a separate service instance.'
iconKey: 'tradeoff'
domains:
  - 'javascript'
kind: 'decision-aid'
childTopicIds: []
relatedTopicIds:
  - '64c227ae-34fd-4c0d-bd8d-668c56205fc1'
  - '6b2a1c19-acaa-4793-9e8a-7a783564bde5'
---

## Choose who should share the dependency

| Scope       | Who shares one instance |
| ----------- | ----------------------- |
| Application | Across the app          |
| Route       | Route + child routes    |
| Component   | Component + children    |

> **A more local provider takes precedence.** Registering the same service class
> at component level gives that component subtree its own instance; consumers
> outside that subtree continue using the root registration.

## Register an application-wide service

**Automatic registration** — on the service:

```typescript
@Injectable({ providedIn: 'root' })
export class ProductService {}
```

**Explicit registration** — omit `providedIn` and register in application config:

```typescript
@Injectable()
export class ProductService {}

export const appConfig: ApplicationConfig = {
  providers: [ProductService],
};
```

These are alternatives; **no extra registration is needed** for a service
already provided at root. Bootstrap options can also be supplied directly to
`bootstrapApplication(App, { providers: [...] })`.

> **Application root ≠ root component.** `providedIn: 'root'` and application
> configuration use application scope; `App`'s component `providers` use component
> scope.

## Share within a routed feature

```typescript
export const routes: Routes = [
  {
    path: 'products',
    component: ProductsPage,
    providers: [ProductDraftState],
  },
];
```

The route and its child routes can use this registration. **Route scope does
not mean a fresh instance on every navigation**; route reuse and injector
lifecycle affect how long it is retained.

## Give each component its own instance

```typescript
@Component({
  selector: 'app-product-editor',
  template: '',
  providers: [ProductService],
})
export class ProductEditor {}
```

This editor uses a **local `ProductService` instance**, even when the service
has `providedIn: 'root'`. Its children can share that instance; a second editor
gets a separate one. Angular destroys the local service when its component is
destroyed.

Use `viewProviders` instead of `providers` when projected content
(`<ng-content>`) should not see the component's local registration.

## Directive and module registrations

- **Directive:** `@Directive({ providers: [...] })` registers on the element
  hosting the directive. That element is the starting point for local lookup.
- **NgModule:** `@NgModule({ providers: [...] })` supports module-based apps.
  Eager modules generally share application scope; lazy modules can have a child
  scope.

`ProductDraftState` and `ProductsPage` represent your own service and component.

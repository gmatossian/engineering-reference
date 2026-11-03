---
id: 'd48436d1-d79b-4e9a-bac5-9ff8672920f7'
title: 'How an Angular app fits together'
status: 'accepted'
summary: 'Recognize components, services, providers and interceptors, and understand how startup and dependency injection connect them.'
iconKey: 'architecture'
domains:
  - 'javascript'
kind: 'concept'
childTopicIds:
  - 'fe994f41-dbc9-456c-b50e-53d3a4a9719c'
  - '253aba39-8aed-4a85-94fb-7f09406e72d3'
relatedTopicIds:
  - 'f7aa760f-30aa-43da-8746-20a39e39529e'
  - '6b2a1c19-acaa-4793-9e8a-7a783564bde5'
  - '64c227ae-34fd-4c0d-bd8d-668c56205fc1'
---

## Build the screen from components

![main.ts uses app.config.ts to start App. App renders ProductsPage, which renders the create form and product list.](./startup-and-components.svg)

- **Component:** a TypeScript class paired with a template; **owns a piece of UI**.
  Split components when those pieces need their own behavior or can be reused.
- **Template:** HTML with Angular bindings for **displaying state and responding
  to events**.
- **Root component:** the **first component Angular renders**, usually `App`.
  Use it to compose the application's outer layout. “Page” and “child” are
  **roles, not special component types**.
- **Application configuration (`app.config.ts`):** shared setup, such as routing,
  HTTP interceptors or the default error handler. Configure it when the **same
  behavior should apply across the app**.

`main.ts` selects the root component and configuration when starting Angular.

## Reuse behavior through services and DI

Components, services and interceptors can use **`inject(...)` to request
dependencies**; Angular supplies instances using their providers.

Angular supplies some built-in dependencies automatically. Others become
available when you configure a feature, so **not every injected dependency
needs your own `providers` entry**.

- **Service:** a class containing behavior that can be used **independently of a
  particular template**. Put product API calls here so components can use them
  without each repeating the HTTP code.
- **Dependency injection (DI):** **Angular supplies a class's dependencies** instead
  of the class constructing them. This lets components share a service and lets
  tests substitute a fake implementation.
- **Provider:** a registration telling Angular **what to supply** for a requested
  dependency.
- **Provider scope:** determines **where the dependency is available and which
  consumers share it**. Register application-wide services with `providedIn: 'root'`
  or application configuration; use route, component or directive providers for
  narrower scopes. Module-based apps also support module providers.
- **Injector:** Angular's dependency resolver. It **looks up providers and supplies
  the dependencies**.

## Apply shared HTTP behavior

**Interceptor:** a function in Angular's **HTTP request/response pipeline**. Use one
when several API calls need the **same authentication header or request logging**,
so each service method does not repeat that behavior. A basic product lookup needs no custom interceptor.

---
id: '64c227ae-34fd-4c0d-bd8d-668c56205fc1'
title: 'Configure application-wide providers'
status: 'accepted'
summary: 'Recognize when to configure routing, shared HTTP behavior, startup work and global error reporting.'
iconKey: 'operations'
domains:
  - 'javascript'
kind: 'operations'
childTopicIds: []
relatedTopicIds:
  - 'd48436d1-d79b-4e9a-bac5-9ff8672920f7'
  - '6b2a1c19-acaa-4793-9e8a-7a783564bde5'
---

## Configure behavior used across the app

Use **`app.config.ts`** to configure shared behavior, such as **navigation**,
**HTTP request rules** or the app's **default error handler**. Components can then use
that configuration without repeating the setup individually.

```typescript
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [provideBrowserGlobalErrorListeners()],
};
```

> **Your service already has `providedIn: 'root'`?** Inject it directly;
> no extra registration is needed here.

To **render a child component**, add it to the parent's component `imports`.

## Add configuration when you need it

**Give different screens their own URLs** → add `provideRouter(routes)`.

**Send an access token with requests to your API** → register an HTTP
interceptor that adds `Authorization: Bearer <access-token>`:

```typescript
provideHttpClient(withInterceptors([authInterceptor]));
```

**Load essential data before the first screen appears**, such as the initial
language's translations → add `provideAppInitializer(loadStartupData)`. Return a
Promise or Observable from `loadStartupData`: startup **waits for it to resolve
or complete**.

These are optional entries in `providers`. `routes`, `authInterceptor` and
`loadStartupData` are application code you supply.

## Collect unexpected errors in one place

`provideBrowserGlobalErrorListeners()` forwards uncaught browser failures to
Angular's `ErrorHandler` for centralized reporting:

```text
Uncaught JavaScript error or
unhandled Promise rejection
             ↓
     Angular ErrorHandler
             ↓
  Console logging by default
```

To **send errors to an error-tracking service**, replace the default handler
with an entry in `providers`:

```typescript
{
  provide: ErrorHandler,
  useClass: GlobalErrorHandler,
},
```

`GlobalErrorHandler` is your own implementation of `ErrorHandler`; its
`handleError(error)` method performs the reporting.

**Reporting does not recover the UI.** Handle expected request failures near
the request, where you can show feedback such as “Product not found”.

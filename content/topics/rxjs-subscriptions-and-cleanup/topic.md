---
id: '0be8a4b3-7ad3-4fce-ba10-6bae6bf6d45c'
title: 'Observable subscriptions and cleanup'
status: 'accepted'
summary: 'What subscribing starts, how completion differs from unsubscription, and when cleanup is needed.'
iconKey: 'observable'
domains:
  - 'javascript'
kind: 'operations'
childTopicIds: []
relatedTopicIds:
  - '71cad1e5-9d13-465a-9f62-c1d00b275d95'
---

**An Observable is the source you subscribe to; a Subscription is the handle you can unsubscribe.**

## What does subscribe start?

| Source                          | Each `subscribe()`…                                          |
| ------------------------------- | ------------------------------------------------------------ |
| Cold, e.g. Angular `HttpClient` | Starts a **separate execution/request**                      |
| Shared/hot, e.g. a `Subject`    | Attaches a receiver; the producer may **already be running** |

Creating an Observable does not guarantee that underlying work waits for subscription: `from(fetch(url))` wraps a request **already started by `fetch(url)`**.

## Complete, error, or unsubscribe?

| Subscription ends by… | Observer callback | Registered teardown |
| --------------------- | ----------------- | ------------------- |
| Source completes      | `complete()`      | Runs                |
| Source fails          | `error(reason)`   | Runs                |
| Consumer unsubscribes | **Neither**       | Runs                |

Afterward, that subscription receives no further notifications. **When a subscription ends, RxJS also runs any cleanup provided by the source**—for example, stopping an interval's timer or removing a DOM event listener.

## Cleanup on every exit

**Put your cleanup callback in `finalize()` if it must run whether the source completes, fails, or you unsubscribe.** A `complete` handler does not run on error or unsubscription.

```js
const subscription = interval(1000)
  .pipe(finalize(() => console.log('cleanup')))
  .subscribe({
    next: (value) => console.log(value),
    complete: () => console.log('complete'),
  });

subscription.unsubscribe();
// cleanup — no ticks, and no 'complete' callback.
```

**Unsubscribing stops this subscription.** Whether it stops the producer depends on the source and its teardown. A shared producer can continue for other subscribers; wrapping a Promise does not make that Promise cancellable.

## Do HTTP subscriptions need destruction cleanup?

- **Once the request completes or errors:** its subscription closes automatically. There is no ongoing subscription left to unsubscribe; interceptors can affect completion.
- **If the component disappears first:** destruction cleanup can prevent stale handlers and abort an in-progress Angular HTTP request. It cannot undo server changes already made.

In Angular, the `async` pipe and `toSignal()` manage their subscriptions automatically. For a manual component subscription, `takeUntilDestroyed()` ties its lifetime to the component; use it for subscriptions that should end when the component is destroyed.

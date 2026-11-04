---
id: '71cad1e5-9d13-465a-9f62-c1d00b275d95'
title: 'RxJS notification timing'
status: 'accepted'
summary: 'When next, error, and complete handlers run depends on the source and scheduling operators.'
iconKey: 'observable'
domains:
  - 'javascript'
kind: 'concept'
childTopicIds: []
relatedTopicIds: []
---

**RxJS handlers do not have a fixed queue.** The source and any scheduling operators determine when `next`, `error`, and `complete` run.

## Default source timing

Browser examples, with **no scheduler override or scheduling operator**; `aPromise` is a native Promise.

| Source           | Handler timing                    |
| ---------------- | --------------------------------- |
| `of(1, 2)`       | Immediately, during `subscribe()` |
| `from(aPromise)` | In the Promise's microtask        |
| `interval(1000)` | In a timer task                   |

`of` emits its values and completes synchronously. `from(aPromise)` emits and completes on fulfillment, or sends `error` on rejection. `interval` emits repeated `next` notifications; it does not complete by itself.

## Delivery does not add another microtask

When RxJS delivers a notification, it normally **calls your handler directly** in that execution context. It does **not automatically queue a separate microtask** for the handler.

```js
console.log('before');
of(1, 2).subscribe((value) => console.log(value));
console.log('after');
// before → 1 → 2 → after
```

## Scheduling can change the answer

Operators such as **`observeOn` reschedule notification delivery** using the supplied scheduler. Check the source and the operator chain before classifying a handler as synchronous, task-based, or microtask-based.

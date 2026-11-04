---
id: '7d769bdc-1e4e-4a28-b9ea-f5a523dd3fb6'
title: 'Promise states: resolved versus settled'
status: 'accepted'
summary: 'Distinguish a final result from commitment to an outcome, and keep handler execution separate.'
iconKey: 'concurrency'
domains:
  - 'javascript'
kind: 'concept'
childTopicIds: []
relatedTopicIds: []
---

## Two ways to resolve

| Call                      | Committed to                      | State now |
| ------------------------- | --------------------------------- | --------- |
| `resolve(7)`              | The value `7`                     | Fulfilled |
| `resolve(pendingPromise)` | That Promise's value or rejection | Pending   |

**Both are resolved. Only the first is settled.** In the second case, the source
of the answer is fixed, but the answer is not available yet.

Once resolved, later calls to that Promise's `resolve` or `reject` **cannot redirect
its outcome**.

## Settled means fulfilled or rejected

```text
pending
  ├─→ fulfilled: value (settled)
  └─→ rejected: reason (settled)
```

A rejected Promise is also resolved; **resolved does not mean successful**.
A Promise can remain pending indefinitely. Once settled, its value or rejection
reason cannot change.

## Resolved now, settled later

```js
const inner = new Promise((resolve) => {
  setTimeout(() => resolve(7), 1000);
});

const outer = new Promise((resolve) => resolve(inner));
// Now: outer is resolved, but pending — it must follow inner.

outer.then((value) => console.log(value));
// Later: outer fulfills with 7, then its handler logs 7.
```

`outer` takes the **value or rejection from `inner`**, rather than treating the
Promise object itself as its final value. If `inner` never settles, `outer` stays
pending.

> **Neither resolved nor settled means the handlers have run.** A Promise can
> already be fulfilled before you attach `.then()`; its handler runs later.

---
id: 'aa0d3bcb-7941-4636-b73c-806293b1d961'
title: 'Promises: results and callback timing'
status: 'accepted'
summary: 'Distinguish the Promise object, its synchronous executor, and its deferred fulfillment handler.'
iconKey: 'promise'
domains:
  - 'javascript'
kind: 'concept'
childTopicIds:
  - '7d769bdc-1e4e-4a28-b9ea-f5a523dd3fb6'
  - '473801af-5283-41fe-9010-4ce462907f01'
relatedTopicIds:
  - '8cc54b47-6d86-479d-9c84-e5b702a4b8aa'
  - '42c5c1eb-ad74-4a0c-87eb-817949c5cdbf'
---

A Promise represents **one eventual outcome**: **fulfillment** with a value or **rejection** with a reason.

## Create a Promise from a value

**For an ordinary value**, these both produce a Promise already fulfilled with `7`:

```js
Promise.resolve(7);
new Promise((resolve) => resolve(7));
```

**Returning `7` from the executor does not fulfill the Promise**; call `resolve(7)`.

For an existing native Promise `p`, `Promise.resolve(p)` can return `p` itself. `new Promise(...)` always creates a new object.

## Object, producer, consumer

- Promise object: `result` in the example below; **represents the eventual outcome**.
- Executor (producer): the function passed to `new Promise(...)`; **starts the producing work**.
- Fulfillment handler (consumer): the function passed to `.then(...)`; **receives the fulfilled value**.

`new Promise(...)` calls your executor and **passes it two functions: `resolve` and `reject`**. The executor can call them immediately, or start asynchronous work that calls them later.

## Executor now; fulfillment handler later

```js
console.log('begin');
const result = new Promise((resolve) => {
  console.log('executor');
  resolve(7);
  console.log('executor continues');
});
result.then((value) => console.log('received', value));
console.log('end');
// begin → executor → executor continues → end → received 7
```

| Expression                 | What happens to the next statement?                                   |
| -------------------------- | --------------------------------------------------------------------- |
| `resolve(7)`               | **Runs immediately**; the executor does not pause or return.          |
| `await Promise.resolve(7)` | **Runs later**; the current async function suspends, even when ready. |

- **The executor runs synchronously during construction.** Creating a Promise does not move that function to another thread.
- **The native Promise handler runs later.** Its reaction is scheduled as a Promise job, integrated with the browser's **microtask queue**—**even when `.then(...)` is attached to an already fulfilled Promise**. If the Promise is pending, the handler waits for fulfillment first.

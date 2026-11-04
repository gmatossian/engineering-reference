---
id: '473801af-5283-41fe-9010-4ce462907f01'
title: 'Promise chains and error handling'
status: 'accepted'
summary: 'What handlers pass downstream, how missing returns break a chain, and where errors and cleanup go.'
iconKey: 'promise'
domains:
  - 'javascript'
kind: 'operations'
childTopicIds: []
relatedTopicIds:
  - '8cc54b47-6d86-479d-9c84-e5b702a4b8aa'
---

> `.then()` does two things: **registers a handler** and **returns a new Promise** for that handler's outcome.

## The Promise exists before its result is ready

```js
const original = Promise.resolve(7); // Already fulfilled with 7.

function double(value) {
  return value * 2;
}

const doubled = original.then(double); // New Promise; still pending.
```

**`double` is an ordinary function.** Passing it to `.then()` registers it as a Promise handler; it doesn't call it immediately.

| When                  | What happens                                           | `original`     | `doubled`           |
| --------------------- | ------------------------------------------------------ | -------------- | ------------------- |
| Synchronously         | `.then()` registers `double` and returns a new Promise | Fulfilled: `7` | **Pending**         |
| Later, in a microtask | `double(7)` returns `14`, fulfilling the new Promise   | Fulfilled: `7` | **Fulfilled: `14`** |

**Calling `double(7)` directly would run it synchronously.**

## Compared with subscribe()

Both calls register a handler; their return values serve different purposes:

| Call                            | Returns                               |
| ------------------------------- | ------------------------------------- |
| `promise.then(handler)`         | **Promise** for the handler's outcome |
| `observable.subscribe(handler)` | **Subscription** for cleanup          |

In `subscribe(handler)`, the handler receives each emitted value. Its return value is ignored; use `pipe(map(...))` to transform Observable values.

## What reaches the next Promise handler?

| Handler does…                    | New Promise…                   |
| -------------------------------- | ------------------------------ |
| `return value`                   | Fulfills with `value`          |
| `return anotherPromise`          | Follows that Promise's outcome |
| `throw error`                    | Rejects with `error`           |
| No returned value, e.g. log only | Fulfills with **`undefined`**  |

### Logging with and without return

```js
const original = Promise.resolve(7);

const logged = original.then((value) => {
  console.log(value);
}); // logged fulfills with undefined.

const kept = original.then((value) => {
  console.log(value);
  return value;
}); // kept fulfills with 7.
```

### Skipped callback, new Promise

```js
const original = Promise.resolve(7);
const afterCatch = original.catch((error) => 0);
const doubled = afterCatch.then((value) => value * 2);
```

```text
Fulfilled values
original (7) → afterCatch (7) → doubled (14)
```

**`.catch()` returns a new Promise even when its error callback is skipped.** Here, `afterCatch` fulfills with `7`, so the callback passed to **`afterCatch.then(...)`** receives `7`.

On rejection, `.then(successHandler)` skips that callback and returns a new Promise **rejected with the same error**.

## Return the next operation

Here, `getProduct` and `getStock` return Promises:

```js
getProduct(id)
  .then((product) => getStock(product.id))
  .then((stock) => renderStock(stock))
  .catch((error) => showError(error))
  .finally(() => setLoading(false));
```

> **Return the Promise to keep its result and failure in the chain.**
> `product => getStock(product.id)` returns it; `product => { getStock(product.id); }` does not.

Without that return, the next handler receives `undefined` without waiting for the stock result, and the chain's `.catch()` does not handle a later rejection from that detached operation.

## Recover or propagate?

| Rejection handler                       | Downstream result                              |
| --------------------------------------- | ---------------------------------------------- |
| `.catch(() => [])`                      | **Recovery:** fulfillment with `[]`            |
| `.catch(error => { throw error; })`     | **Propagation:** rejection with the same error |
| `.catch(error => console.error(error))` | Logs, then **fulfills with `undefined`**       |

A `.catch()` covers failures **upstream of its position**, including throws in earlier handlers. A later failure needs a later handler. With `.then(success, failure)`, `failure` does **not** catch a throw from `success` in that same call.

## Cleanup with finally

`.finally(cleanup)` runs cleanup after **success or failure**, without passing it a value or error. It returns a **new Promise**; the original Promise stays unchanged.

| Cleanup does…                         | New Promise…                       |
| ------------------------------------- | ---------------------------------- |
| Finishes successfully                 | Keeps the original value or error  |
| Throws, or returns a rejected Promise | Rejects with the **cleanup error** |

**Returning a value such as `99` does not replace the original result.** If cleanup returns a Promise, the chain waits for it, but ignores its fulfilled value.

### Catch cleanup failures too

```js
const original = Promise.resolve(7);

const afterCleanup = original.finally(() => {
  throw new Error('Cleanup failed');
});

afterCleanup.catch((error) => console.log(error.message));
// Prints 'Cleanup failed'.
// original remains fulfilled with 7.
```

Place `.catch()` **after `.finally()`** to handle failures from either the original operation or cleanup.

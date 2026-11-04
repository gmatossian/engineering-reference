---
id: '30f56ccc-ceca-4590-8022-d81a3f3ca796'
title: 'Sequential versus concurrent async work'
status: 'accepted'
summary: 'Choose sequential await, Promise.all, or Promise.allSettled according to dependencies and failure requirements.'
iconKey: 'async'
domains:
  - 'javascript'
kind: 'decision-aid'
childTopicIds: []
relatedTopicIds:
  - '473801af-5283-41fe-9010-4ce462907f01'
---

| Need                                                                  | Choose                 |
| --------------------------------------------------------------------- | ---------------------- |
| Next operation **needs the previous result**                          | Sequential `await`     |
| Independent operations; **all must succeed**                          | `Promise.all()`        |
| Independent operations; **inspect every outcome**, including failures | `Promise.allSettled()` |

Here, each `get…()` helper **starts a network request** and returns a Promise for its response data.

## Sequential — dependent requests

```js
async function loadOrders() {
  const user = await getUser(); // Request the user; wait for their data.
  return getOrders(user.id); // Then request orders using that user's ID.
}
```

`await loadOrders()` receives the orders **after both requests finish**.

## Concurrent — independent requests

```js
async function loadCatalog() {
  const products = getProducts();
  const categories = getCategories(); // Starts before products finishes.
  return Promise.all([products, categories]);
}
```

**The function calls start these operations; `Promise.all()` joins their results.** Passing `[getProducts, getCategories]` passes functions—it does not call them.

**Both requests can be in progress at the same time.** The function calls that start them still run one after the other.

## What if one fails?

| Join                   | Fulfillment value  | On an input rejection              |
| ---------------------- | ------------------ | ---------------------------------- |
| `Promise.all()`        | `[valueA, valueB]` | **Rejects on the first rejection** |
| `Promise.allSettled()` | Outcome records    | **Waits for all inputs**           |

An `allSettled` record is `{ status: 'fulfilled', value }` or `{ status: 'rejected', reason }`.

Both result arrays preserve **input order**, regardless of completion order. `allSettled` stays pending if an input never settles.

> **`Promise.all()` rejecting does not cancel the other operations.** Cancellation needs support from the operation, such as `fetch` with an `AbortSignal`.

---
id: '8cc54b47-6d86-479d-9c84-e5b702a4b8aa'
title: 'async and await'
status: 'accepted'
summary: 'What async changes, what await accepts, and when execution pauses and resumes.'
iconKey: 'async'
domains:
  - 'javascript'
kind: 'concept'
childTopicIds:
  - '30f56ccc-ceca-4590-8022-d81a3f3ca796'
relatedTopicIds:
  - 'aa0d3bcb-7941-4636-b73c-806293b1d961'
  - '33af9431-3a66-49d4-9cc7-87c3273a53bb'
---

## What does async change?

Adding `async` to a function does two things:

- **Every call returns a Promise.** A returned ordinary value becomes its fulfillment value; an uncaught throw rejects it. Returning another Promise makes it follow that Promise's outcome.
- **Allows `await` inside its body.**

> Calling an async function **starts its body immediately on the current JS thread**. `async` alone does not schedule the call for later or move its work to another thread.

## What does await pause?

`await expression` first **evaluates the expression now**, then suspends **only the current async function** while it waits for the outcome. It **does not block the JS thread**; the caller can continue.

- **Fulfillment:** the `await` expression produces the fulfilled value.
- **Rejection:** execution resumes by **throwing the rejection reason at the await point**. A surrounding `try`/`catch` can handle it; otherwise the async function's returned Promise rejects.

## Already ready still means resume later

```js
async function readValue() {
  console.log(1);
  const value = await '3';
  console.log(value);
  return value;
}

const result = readValue(); // result is a Promise
console.log('outside');
// 1 → outside → 3
```

Awaiting an **already fulfilled Promise**, such as `Promise.resolve('3')`, likewise
resumes later. A pending Promise must settle first.

## What can await accept?

A **thenable** is an object with a callable `.then` method.

| Input                          | Result         |
| ------------------------------ | -------------- |
| **Promise**                    | Value or throw |
| **Thenable**                   | Value or throw |
| **Ordinary value**, e.g. `'3'` | Same `'3'`     |

> **Awaiting an ordinary value still suspends the current async function.**
> The result is unchanged; execution still resumes later as a microtask.

`await` is also available at the top level of a JavaScript module; `async` is needed to use it inside a function.

---
id: '33af9431-3a66-49d4-9cc7-87c3273a53bb'
title: 'Rendering and yielding'
status: 'accepted'
summary: 'Why DOM changes may not paint yet, and how to give other work an opportunity.'
iconKey: 'concurrency'
domains:
  - 'javascript'
kind: 'concept'
childTopicIds: []
relatedTopicIds: []
---

**Updating the DOM changes page state. Painting displays pixels.**

A DOM change **does not force an immediate paint**, and the browser does not necessarily paint after every task.

## Why a loading message may not appear yet

In an ordinary button handler:

```js
async function onClick() {
  label.textContent = 'Loading…';
  await Promise.resolve();
  longCalculation();
}
```

**DOM update → microtask continuation → long calculation → possible paint**

The fulfilled `await` resumes the function as a microtask, **before the browser gets a rendering opportunity**. The calculation can therefore delay displaying the loading message.

> **`await` does not guarantee a paint.** Awaiting a pending operation that settles in a later task has a different timeline: the browser **may get a rendering opportunity while it is pending**.

## Giving other work a chance

- **Split work into later tasks:** creates opportunities for other callbacks and rendering. It does **not guarantee a particular frame**.
- **Consider a worker for substantial CPU work:** moves suitable computation off the main thread. Adding `async` alone does not do this.
- **Use microtasks for short deferred coordination**, not repeatedly yielding a large calculation. The browser drains the queue before proceeding; more microtasks can keep postponing other work.

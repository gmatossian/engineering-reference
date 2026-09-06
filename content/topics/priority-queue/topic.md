---
id: 'bb3dda6e-7ad8-4358-834d-094a0b333a5e'
title: 'PriorityQueue'
summary: 'Use Java’s heap-backed collection to process elements by natural or comparator-defined priority.'
iconKey: 'priority'
childTopicIds:
  - 'c73d8532-c046-4052-9c04-b06acc618d68'
---

`PriorityQueue<E>` is Java's general-purpose **heap-backed collection**. Use it when
the next element is selected by **priority, not arrival order**.

## Choose the ordering

| Required head   | Construction                                                  |
| --------------- | ------------------------------------------------------------- |
| Smallest value  | `new PriorityQueue<>()`                                       |
| Largest value   | `new PriorityQueue<>(Comparator.reverseOrder())`              |
| Custom priority | `new PriorityQueue<>(Comparator.comparingInt(Job::priority))` |

```java
Queue<Job> jobs = new PriorityQueue<>(Comparator.comparingInt(Job::priority));

jobs.offer(job);
Job next = jobs.poll();
```

`peek()` and `poll()` access the **least element according to the configured
ordering**. Reverse the comparator when a larger value should come first.

## Traps

- Without a comparator, elements must be **mutually comparable**—normally by
  implementing `Comparable`. Otherwise, insertion may throw `ClassCastException`.
- Iteration is **not guaranteed to be sorted**; repeatedly call `poll()` when order
  matters.
- Equal-priority elements may appear in **any order**.
- `null` elements are not permitted.
- `PriorityQueue` is not thread-safe; use `PriorityBlockingQueue` when concurrent
  mutation is required.

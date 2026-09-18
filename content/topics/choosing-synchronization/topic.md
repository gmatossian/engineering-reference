---
id: '6f8943c2-2c77-4280-a2c2-2fff57564f2d'
title: 'Choosing a synchronization strategy'
summary: 'Match the shape of shared state to the smallest mechanism that protects its complete invariant.'
iconKey: 'architecture'
domains:
  - 'java'
  - 'concurrency'
kind: 'decision-aid'
childTopicIds: []
relatedTopicIds: []
---

Choose the **smallest correct atomic boundary**: everything that must remain true
together must be protected together.

| Need                                                    | Starting choice                          | Important limit                                 |
| ------------------------------------------------------- | ---------------------------------------- | ----------------------------------------------- |
| No shared mutable state                                 | Immutable or thread-confined state       | No synchronization is needed                    |
| One independent value or reference                      | `AtomicInteger`, `AtomicReference`, etc. | Does not protect a multi-value invariant        |
| One key in a concurrent map                             | `compute`, `computeIfAbsent`, or `merge` | Does not protect a workflow across keys or maps |
| A straightforward multi-step invariant                  | `synchronized`                           | Every participant must use the same lock object |
| Timed or interruptible locking, fairness, or conditions | `ReentrantLock`                          | More flexible, but must be released explicitly  |

Use a `ReentrantLock` with `try`/`finally`:

```java
lock.lock();
try {
    updateInvariant();
} finally {
    lock.unlock();
}
```

## Traps

- A thread-safe collection does **not** make separate method calls one atomic
  workflow.
- Separate atomic variables do **not** protect an invariant spanning all of them.
- Synchronizing writes but not reads does **not** establish one consistent locking
  rule.
- Avoid slow I/O while holding a lock when it can safely happen outside the critical
  section.

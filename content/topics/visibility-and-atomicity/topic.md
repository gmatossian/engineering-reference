---
id: 'a9da2af5-7976-4bcf-abf4-0a9c1ad3458b'
title: 'Visibility and atomicity'
summary: 'Distinguish seeing the latest value from performing a compound operation indivisibly.'
iconKey: 'operations'
domains:
  - 'java'
  - 'concurrency'
kind: 'concept'
childTopicIds: []
relatedTopicIds: []
---

**Visibility** means one thread can observe another thread's write. **Atomicity**
means an operation cannot be observed partway through.

| Need                                     | Use                      |
| ---------------------------------------- | ------------------------ |
| Publish a simple flag or reference       | `volatile`               |
| Atomically update one independent value  | An atomic class          |
| Protect multiple steps or related values | `synchronized` or a lock |

`volatile` provides visibility and ordering for that variable. It does **not** make
a compound update atomic:

```java
private volatile int count;

count++; // read, increment, and write: not atomic
```

Use an atomic operation for one independent counter:

```java
private final AtomicInteger count = new AtomicInteger();

count.incrementAndGet();
```

Unlocking a monitor happens-before a later lock of that same monitor. A write to a
`volatile` variable happens-before a later read of that variable. These rules create
the visibility guarantees; source-code order alone does not coordinate threads.

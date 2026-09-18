---
id: '044ec0de-f354-4a1c-958e-98a3d1b833fb'
title: 'Concurrent queues'
summary: 'Choose between immediate concurrent access and blocking producer-consumer coordination.'
iconKey: 'concurrency'
domains:
  - 'java'
  - 'collections'
  - 'concurrency'
kind: 'decision-aid'
childTopicIds: []
relatedTopicIds: []
---

**Concurrent** means multiple threads can safely access the queue. **Blocking** means
an operation can wait until an element or free capacity becomes available.

Choose whether producers and consumers should **return immediately or wait**.

| Type                    | Ordering | Capacity       | Can wait?          |
| ----------------------- | -------- | -------------- | ------------------ |
| `ConcurrentLinkedQueue` | FIFO     | Unbounded      | No                 |
| `ArrayBlockingQueue`    | FIFO     | Bounded        | Yes                |
| `LinkedBlockingQueue`   | FIFO     | Optional bound | Yes                |
| `PriorityBlockingQueue` | Priority | Unbounded      | **Consumers only** |

## Immediate concurrent access

```java
Queue<Task> tasks = new ConcurrentLinkedQueue<>();

tasks.offer(task);
Task next = tasks.poll(); // null when empty
```

## Blocking producer-consumer coordination

```java
BlockingQueue<Task> tasks = new ArrayBlockingQueue<>(100);

tasks.put(task);         // waits while full
Task next = tasks.take(); // waits while empty
```

| Intent | Return immediately | Wait     |
| ------ | ------------------ | -------- |
| Insert | `offer(e)`         | `put(e)` |
| Remove | `poll()`           | `take()` |

Use a **bounded queue** when the system needs **backpressure** instead of allowing the
queue to grow without limit.

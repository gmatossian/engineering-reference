---
id: '8cbea92a-606e-4ed3-839c-c7fff67f0909'
title: 'Queue'
iconKey: 'queue'
domains:
  - 'java'
  - 'collections'
  - 'algorithms-data-structures'
kind: 'concept'
childTopicIds:
  - 'bf417331-9329-42b4-9517-351ef6af3b85'
  - '6fabfd5b-4700-41b4-8240-3884d533ba55'
  - 'ee84c285-fd32-4572-8ef6-ef92f421bcca'
  - 'bb3dda6e-7ad8-4358-834d-094a0b333a5e'
  - '044ec0de-f354-4a1c-958e-98a3d1b833fb'
relatedTopicIds: []
---

A queue holds elements before processing; its implementation defines their order. A
**FIFO** queue removes the element that has **waited longest**.

## Choose an implementation

![Queue and Deque interfaces with their common non-concurrent implementations](./queue-implementations.svg)

| Implementation                             | Ordering                               | Use when                                                         |
| ------------------------------------------ | -------------------------------------- | ---------------------------------------------------------------- |
| `ArrayDeque`                               | FIFO when used as a queue              | The **default choice** for an ordinary queue                     |
| `LinkedList`                               | FIFO when used as a queue              | **Linked-list behavior** is also required                        |
| `PriorityQueue`                            | Heap using natural or comparator order | Process by **priority, not insertion order**                     |
| `ConcurrentLinkedQueue` or `BlockingQueue` | FIFO or priority                       | Shared producer-consumer access; see **Concurrent queues** below |

## `Queue` interface operations

These methods are defined by `Queue<E>` and are available **regardless of the chosen
implementation**.

```java
Queue<String> queue = new ArrayDeque<>();
```

| Intent       | Throws when it cannot succeed | Returns a special value |
| ------------ | ----------------------------- | ----------------------- |
| Insert       | `add(e)`                      | `offer(e)` → `false`    |
| Examine head | `element()`                   | `peek()` → `null`       |
| Remove head  | `remove()`                    | `poll()` → `null`       |

Use the special-value methods when a **full or empty** queue is an **expected outcome**.

![Elements entering at the tail and leaving from the head of a queue](./queue-operations.svg)

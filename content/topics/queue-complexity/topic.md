---
id: 'bf417331-9329-42b4-9517-351ef6af3b85'
title: 'Complexity'
iconKey: 'complexity'
childTopicIds: []
---

The implementation determines the cost of the shared `Queue` operations:

| Implementation  | `offer`        | `peek` | `poll`   |
| --------------- | -------------- | ------ | -------- |
| `ArrayDeque`    | Amortized O(1) | O(1)   | O(1)     |
| `LinkedList`    | O(1)           | O(1)   | O(1)     |
| `PriorityQueue` | O(log n)       | O(1)   | O(log n) |

These are typical single-threaded costs. Concurrent queue implementations have
their own progress, contention, and capacity behavior.

---
id: '6fabfd5b-4700-41b4-8240-3884d533ba55'
title: 'Deque operations'
summary: 'Insert, inspect, and remove elements explicitly at either end of a deque.'
iconKey: 'deque'
domains:
  - 'java'
  - 'collections'
kind: 'operations'
childTopicIds: []
relatedTopicIds: []
---

`Deque<E>` extends `Queue<E>` with operations for the **head and tail**. Use the
explicit `First` and `Last` methods when both ends matter.

```java
Deque<String> deque = new ArrayDeque<>();
```

| Intent  | First/head      | Last/tail      |
| ------- | --------------- | -------------- |
| Insert  | `offerFirst(e)` | `offerLast(e)` |
| Examine | `peekFirst()`   | `peekLast()`   |
| Remove  | `pollFirst()`   | `pollLast()`   |

The `offer*` methods return `false` when insertion fails. The `peek*` and `poll*`
methods return `null` when the deque is empty.

## Exception-throwing alternatives

| Returns a special value    | Throws instead               |
| -------------------------- | ---------------------------- |
| `offerFirst` / `offerLast` | `addFirst` / `addLast`       |
| `peekFirst` / `peekLast`   | `getFirst` / `getLast`       |
| `pollFirst` / `pollLast`   | `removeFirst` / `removeLast` |

## When used as a FIFO queue

| `Queue` method | Equivalent `Deque` method |
| -------------- | ------------------------- |
| `offer(e)`     | `offerLast(e)`            |
| `peek()`       | `peekFirst()`             |
| `poll()`       | `pollFirst()`             |

Use the shorter `Queue` methods for ordinary FIFO behavior. Use the explicit
`Deque` methods when code needs to communicate **which end** it accesses.

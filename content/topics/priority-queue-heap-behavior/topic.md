---
id: 'c73d8532-c046-4052-9c04-b06acc618d68'
title: 'Heap behavior'
summary: 'Understand which ordering guarantees a PriorityQueue heap provides—and which it does not.'
iconKey: 'heap'
domains:
  - 'java'
  - 'collections'
  - 'algorithms-data-structures'
kind: 'concept'
childTopicIds: []
relatedTopicIds: []
---

`PriorityQueue` stores its elements in a **heap**, not a fully sorted sequence. The
heap maintains only enough order to keep the **highest-priority element at the
head**.

| Operation | What the heap does                         | Typical time |
| --------- | ------------------------------------------ | ------------ |
| `peek()`  | Reads the head                             | O(1)         |
| `offer()` | Inserts an element and restores heap order | O(log n)     |
| `poll()`  | Removes the head and restores heap order   | O(log n)     |

Only the head is guaranteed to be next according to the configured ordering.
Elements elsewhere in the heap are **not fully sorted**, so iteration and
`toArray()` do not produce priority order.

To consume every element in priority order, repeatedly remove the head:

```java
while (!queue.isEmpty()) {
    Job next = queue.poll();
    process(next);
}
```

This empties the queue. Copy it first when the original queue must be preserved.

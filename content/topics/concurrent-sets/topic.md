---
id: 'c3707cd5-08e6-46da-b6ba-49b10459c00b'
title: 'Concurrent sets'
summary: 'Choose a concurrent set for general membership, sorted navigation, snapshots, or synchronized access.'
iconKey: 'concurrency'
domains:
  - 'java'
  - 'collections'
  - 'concurrency'
kind: 'decision-aid'
childTopicIds: []
relatedTopicIds: []
---

Choose according to the required **ordering** and the balance between reads and
writes.

| Construction                                   | Ordering        | Use when                                   |
| ---------------------------------------------- | --------------- | ------------------------------------------ |
| `ConcurrentHashMap.<String>newKeySet()`        | No guarantee    | General-purpose concurrent membership      |
| `new ConcurrentSkipListSet<>()`                | Sorted          | Concurrent range and navigation operations |
| `new CopyOnWriteArraySet<>()`                  | Insertion order | A small set is read far more than modified |
| `Collections.synchronizedSet(new HashSet<>())` | Backing set     | One lock around all access is acceptable   |

`CopyOnWriteArraySet` copies its underlying array when modified. Its iterators see a
**snapshot** and do not reflect later changes.

A synchronized wrapper protects individual operations, but traversal and compound
actions still require synchronization around the complete sequence:

```java
synchronized (set) {
    for (String value : set) {
        use(value);
    }
}
```

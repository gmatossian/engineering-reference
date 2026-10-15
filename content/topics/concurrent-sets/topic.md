---
id: 'c3707cd5-08e6-46da-b6ba-49b10459c00b'
title: 'Concurrent sets'
status: 'accepted'
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

| If you need…                                      | Start with                         |
| ------------------------------------------------- | ---------------------------------- |
| Concurrent membership; no ordering requirement    | `ConcurrentHashMap.newKeySet()`    |
| Sorted elements; find values between bounds       | `ConcurrentSkipListSet`            |
| A small, read-mostly set with snapshot iteration  | `CopyOnWriteArraySet`              |
| Simple shared access where one lock is acceptable | `Collections.synchronizedSet(...)` |

**Range example:** `set.subSet(10, 20)` gives a view of values from 10 inclusive
to 20 exclusive.

For `ConcurrentSkipListSet`, `contains`, `add`, and `remove` have expected **O(log n)**
cost; traversing a range still visits its elements.

## Claim membership once

```java
Set<String> claimedIds =
    ConcurrentHashMap.newKeySet();
boolean firstClaim = claimedIds.add("job-123");
```

`newKeySet()` returns a concurrent **set** backed by a `ConcurrentHashMap`; the
left-hand side can still be `Set<String>`. For this set, `add(id)` returns **true
only when this call added the ID**. It makes the membership decision in one atomic
operation. Separate `contains(id)` and `add(id)` calls leave a gap in which another
thread can add the same ID.

`add(id)` atomically claims the ID, **not the later processing**. If processing
fails, the ID may remain claimed even though the job did not finish. Decide how
incomplete or partially completed work can be retried.

`CopyOnWriteArraySet` copies its underlying array when modified; its iterators do
not reflect later changes.

A synchronized wrapper protects individual operations, but traversal and compound
actions still require synchronization around the complete sequence:

```java
Set<String> set = Collections.synchronizedSet(new HashSet<>());
synchronized (set) {
    for (String value : set) {
        use(value);
    }
}
```

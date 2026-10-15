---
id: 'b1273826-a36d-4b96-8c91-e20a85c191b9'
title: 'Concurrent maps'
status: 'accepted'
summary: 'Choose an unordered or sorted concurrent map and update individual keys atomically.'
iconKey: 'concurrency'
domains:
  - 'java'
  - 'collections'
  - 'concurrency'
kind: 'decision-aid'
childTopicIds: []
relatedTopicIds:
  - '6f8943c2-2c77-4280-a2c2-2fff57564f2d'
---

Use a concurrent map when multiple threads must safely read and update shared
mappings.

- **`ConcurrentHashMap`:** unordered; expected **O(1)** key access for general use.
- **`ConcurrentSkipListMap`:** sorted; expected **O(log n)** basic key access and
  updates; sorted range views.
- **`Collections.synchronizedMap(new HashMap<>())`:** one lock; use when
  serializing access is acceptable.

**Range example:** for integer keys, `map.subMap(10, 20)` gives a view of entries
with keys from 10 inclusive to 20 exclusive.

## Update one key in one operation

```java
ConcurrentMap<String, Integer> counts =
    new ConcurrentHashMap<>();
int views = counts.merge("views", 1, Integer::sum);
```

Choose **one operation** for the update:

- **Insert only if absent:** `putIfAbsent(key, value)` returns the previous value,
  or `null` if inserted.
- **Derive from the current value, including absence:** `compute(key, fn)` returns
  the new value; a `null` result from `fn` removes the entry.
- **Insert or combine:** `merge(key, value, fn)` returns the new value; a `null`
  result from `fn` removes the entry.

For a conditional removal or replacement, use `remove(key, expectedValue)` or
`replace(key, expectedValue, newValue)`. Separate `get` and `put` calls are **not**
one conditional update.

## Limits to remember

- **One-key atomicity:** `ConcurrentHashMap` updates one mapping atomically. Keep
  remapping functions **short** and avoid **external side effects**; those effects
  are not atomic with the update.
- **Remapping retries:** `ConcurrentSkipListMap` may invoke a remapping function
  more than once during one `compute` or `merge` call.
- **Nulls:** `ConcurrentHashMap` and `ConcurrentSkipListMap` reject null keys and
  values.
- **Weakly consistent iteration:** `ConcurrentHashMap` and `ConcurrentSkipListMap`
  iterators tolerate concurrent changes but are **not snapshots**.
- **Synchronized-map iteration:** with `Collections.synchronizedMap`, hold
  `synchronized (map)` for the **whole traversal**.

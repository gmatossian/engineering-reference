---
id: 'b1273826-a36d-4b96-8c91-e20a85c191b9'
title: 'Concurrent maps'
summary: 'Choose an unordered or sorted concurrent map and update individual keys atomically.'
iconKey: 'concurrency'
childTopicIds: []
---

Use a concurrent map when multiple threads must safely read and update shared
mappings.

| Choice                                         | Key order   | Typical cost  | Use when                             |
| ---------------------------------------------- | ----------- | ------------- | ------------------------------------ |
| `ConcurrentHashMap`                            | None        | O(1) expected | General concurrent key-based access  |
| `ConcurrentSkipListMap`                        | Sorted      | O(log n)      | Concurrent navigation or ranges      |
| `Collections.synchronizedMap(new HashMap<>())` | Backing map | One lock      | Serializing all access is acceptable |

Do not implement a conditional update as separate `get` and `put` calls. A
`ConcurrentMap` supplies operations with **per-key atomicity**, including:

- `putIfAbsent(key, value)`;
- `remove(key, expectedValue)`;
- `replace(key, expectedValue, newValue)`;
- `compute...` and `merge`.

`ConcurrentHashMap` and `ConcurrentSkipListMap` reject **null keys and values**.
Their iterators are **weakly consistent**: they tolerate concurrent changes but do
not represent one frozen snapshot of the entire map.

For `Collections.synchronizedMap`, iteration still requires synchronizing on the
map for the whole traversal.

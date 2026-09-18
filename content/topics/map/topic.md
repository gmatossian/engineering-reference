---
id: 'd972ae23-879d-4f2c-9ede-5532e69ca15f'
title: 'Map'
summary: 'Associate unique keys with values and choose the required lookup and ordering behavior.'
iconKey: 'map'
domains:
  - 'java'
  - 'collections'
  - 'algorithms-data-structures'
kind: 'concept'
childTopicIds:
  - 'c3e7b0c0-b574-4edd-89ec-24f50f206522'
  - '0ad85071-497d-4891-9d3d-8cc8d207495e'
  - 'fc3f3ad0-3d94-42a5-a79b-9309c1140cf0'
  - 'e080cdee-eecc-4c33-92d8-3a75acbf5d34'
  - '7ddf26ac-1481-4b56-a897-e72a8a881c84'
  - 'b1273826-a36d-4b96-8c91-e20a85c191b9'
relatedTopicIds: []
---

A `Map<K, V>` associates **unique keys** with values. Different keys may map to the
same value. `Map` belongs to the Java Collections Framework, but it does **not**
extend `Collection`.

## Choose an implementation

| Implementation      | Key iteration order    | Typical operations | Use when                                                 |
| ------------------- | ---------------------- | ------------------ | -------------------------------------------------------- |
| `HashMap`           | No guarantee           | O(1) expected      | The **default choice** for key-based lookup              |
| `LinkedHashMap`     | Insertion order        | O(1) expected      | Traversal order must be predictable                      |
| `TreeMap`           | Sorted key order       | O(log n)           | Sorted navigation or range queries matter                |
| `EnumMap`           | Enum declaration order | O(1)               | Every key belongs to one enum type                       |
| `ConcurrentHashMap` | No guarantee           | O(1) expected      | General concurrent access; see **Concurrent maps** below |

## Core operations

| Intent                    | Operation          | Important result                           |
| ------------------------- | ------------------ | ------------------------------------------ |
| Read by key               | `get(key)`         | Value, or `null` when no mapping exists    |
| Test whether a key exists | `containsKey(key)` | Distinguishes absence from a mapped `null` |
| Associate a value         | `put(key, value)`  | Replaces and returns the previous value    |
| Remove a mapping          | `remove(key)`      | Returns the previous value                 |

Each key maps to **at most one value**. Calling `put` with an existing key replaces
its current value.

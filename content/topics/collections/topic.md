---
id: 'c29c5725-0b1f-480d-88f4-5c9d3b7f0dc5'
title: 'Collections framework'
iconKey: 'collection'
domains:
  - 'java'
  - 'collections'
kind: 'area'
childTopicIds:
  - '6d028a15-f716-4862-80e7-ea5e3b89d946'
  - 'eb48ad81-c168-48ec-a5ac-602901e5d284'
  - '8cbea92a-606e-4ed3-839c-c7fff67f0909'
  - 'd972ae23-879d-4f2c-9ede-5532e69ca15f'
relatedTopicIds: []
---

Choose the interface by the **behavior the program requires**; choose a concrete
implementation separately.

## Choose from the required behavior

In **Declare → construct**, the interface comes first and the typical implementation
comes second. Choose a different implementation when another constraint requires it.

- **Indexed sequence; duplicates allowed:** `List<E>` → `new ArrayList<>()`
- **Unique membership:** `Set<E>` → `new HashSet<>()`
- **First-in, first-out processing:** `Queue<E>` → `new ArrayDeque<>()`
- **Both ends or a LIFO stack:** `Deque<E>` → `new ArrayDeque<>()`
- **Next value by priority:** `Queue<E>` → `new PriorityQueue<>()`
- **Value lookup by a unique key:** `Map<K, V>` → `new HashMap<>()`
- **Unique values in insertion order:** `Set<E>` → `new LinkedHashSet<>()`
- **Keyed values in insertion order:** `Map<K, V>` → `new LinkedHashMap<>()`
- **Sorted values, endpoints, or range views:** `SortedSet<E>` → `new TreeSet<>()`
- **Nearest-value or descending navigation as well:** `NavigableSet<E>` → `new TreeSet<>()`
- **Sorted keys, endpoints, or range views:** `SortedMap<K, V>` → `new TreeMap<>()`
- **Nearest-key or descending navigation as well:** `NavigableMap<K, V>` → `new TreeMap<>()`

> Need to process **one item at a time in order**? Use `PriorityQueue` when only
> `peek()` and `poll()` by priority matter. Use a `SortedMap` backed by `TreeMap`
> when each value has a unique ordered key and you need key lookup, endpoints, or
> range views. Declare it as `NavigableMap` instead when you also need
> `lower`/`floor`/`ceiling`/`higher` or descending navigation.

![Java Collections Framework hierarchy showing Collection extending Iterable; List, Set, and Queue extending Collection; Deque extending Queue; and Map in a separate hierarchy](./collections-hierarchy.svg)

The List, Set, Queue, and Map Topics contain family-specific selection guidance,
operations, and trade-offs.

## Similar names, different roles

- `Collection<E>` is the **common interface** behind **lists, sets, and queues**.
- `Collections` is a **utility class** containing static operations and wrappers.
- `Map<K, V>` belongs to the framework but does **not** extend `Collection<E>`.

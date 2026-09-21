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

![Decision map for choosing a collection family from the required behavior](./collection-choice-map.svg)

## Declare the interface; construct a class

| Need                                               | Declare              | Typical construction    |
| -------------------------------------------------- | -------------------- | ----------------------- |
| **Indexed sequence**; duplicates allowed           | `List<E>`            | `new ArrayList<>()`     |
| ---                                                |                      |                         |
| **Unique membership**                              | `Set<E>`             | `new HashSet<>()`       |
| **Insertion-ordered unique values**                | `Set<E>`             | `new LinkedHashSet<>()` |
| **Sorted values**; endpoints and ranges            | `SortedSet<E>`       | `new TreeSet<>()`       |
| **Nearest-value navigation**; descending order too | `NavigableSet<E>`    | `new TreeSet<>()`       |
| ---                                                |                      |                         |
| **FIFO processing**                                | `Queue<E>`           | `new ArrayDeque<>()`    |
| **Both ends or LIFO**                              | `Deque<E>`           | `new ArrayDeque<>()`    |
| **Priority processing**                            | `Queue<E>`           | `new PriorityQueue<>()` |
| ---                                                |                      |                         |
| **Unique-key lookup**                              | `Map<K, V>`          | `new HashMap<>()`       |
| **Insertion-ordered keys**                         | `Map<K, V>`          | `new LinkedHashMap<>()` |
| **Sorted keys**; endpoints and ranges              | `SortedMap<K, V>`    | `new TreeMap<>()`       |
| **Nearest-key navigation**; descending order too   | `NavigableMap<K, V>` | `new TreeMap<>()`       |

## See the interface hierarchy

![Java Collections Framework interface hierarchy showing Collection extending Iterable; List, Set, and Queue extending Collection; SortedSet and NavigableSet extending Set; Deque extending Queue; and Map, SortedMap, and NavigableMap in a separate hierarchy](./collections-hierarchy.svg)

## Similar names, different roles

- `Collection<E>` is the **common interface** behind **lists, sets, and queues**.
- `Collections` is a **utility class** containing static operations and wrappers.
- `Map<K, V>` belongs to the framework but does **not** extend `Collection<E>`.

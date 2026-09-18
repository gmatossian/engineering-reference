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

![Java Collections Framework hierarchy showing Collection extending Iterable; List, Set, and Queue extending Collection; Deque extending Queue; and Map in a separate hierarchy](./collections-hierarchy.svg)

## Recognize implementation families

Implementation names often indicate the behavior or storage strategy that distinguishes
them. These are useful clues rather than universal naming rules.

| Name pattern   | Usually signals                                  | Examples                                     |
| -------------- | ------------------------------------------------ | -------------------------------------------- |
| `Array*`       | Resizable array-backed storage                   | `ArrayList`, `ArrayDeque`                    |
| `LinkedList`   | Node-based list that also implements `Deque`     | `LinkedList`                                 |
| `Hash*`        | Hash-based lookup without sorted iteration       | `HashSet`, `HashMap`                         |
| `LinkedHash*`  | Hash lookup with predictable encounter order     | `LinkedHashSet`, `LinkedHashMap`             |
| `Tree*`        | Sorted storage with navigation and range methods | `TreeSet`, `TreeMap`                         |
| `Enum*`        | Compact storage specialized for one enum type    | `EnumSet`, `EnumMap`                         |
| `Priority*`    | Heap-backed removal according to priority        | `PriorityQueue`                              |
| `Concurrent*`  | A concurrency-specific implementation            | `ConcurrentHashMap`, `ConcurrentLinkedQueue` |
| `CopyOnWrite*` | Writes copy the underlying storage               | `CopyOnWriteArrayList`                       |

The individual List, Set, Queue, and Map Topics contain the actual selection
guidance and trade-offs.

## Similar names, different roles

- `Collection<E>` is the **common interface** behind **lists, sets, and queues**.
- `Collections` is a **utility class** containing static operations and wrappers.
- `Map<K, V>` belongs to the framework but does **not** extend `Collection<E>`.

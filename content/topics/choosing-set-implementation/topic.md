---
id: 'b4959ddf-3236-4fe7-b6a9-d527281a0f6a'
title: 'Choosing a Set implementation'
summary: 'Select hash-based, insertion-ordered, sorted, or enum-specialized storage.'
iconKey: 'architecture'
domains:
  - 'java'
  - 'collections'
  - 'algorithms-data-structures'
kind: 'decision-aid'
childTopicIds: []
relatedTopicIds: []
---

Choose the implementation by the **ordering guarantee** the caller needs.

| Choice          | Storage               | Membership rule             | Tradeoff                               |
| --------------- | --------------------- | --------------------------- | -------------------------------------- |
| `HashSet`       | Hash table            | `hashCode` and `equals`     | Fast default; no iteration guarantee   |
| `LinkedHashSet` | Hash table plus links | `hashCode` and `equals`     | Insertion order; additional memory     |
| `TreeSet`       | Balanced tree         | Natural order or comparator | Sorted navigation; O(log n) operations |
| `EnumSet`       | Bit vector            | Enum identity               | Compact and fast; one enum type only   |

Use `HashSet` unless ordering or an enum-specific representation is required.

## Enum sets

```java
EnumSet<Permission> readable = EnumSet.of(READ, LIST);
EnumSet<Permission> none = EnumSet.noneOf(Permission.class);
EnumSet<Permission> all = EnumSet.allOf(Permission.class);
```

`EnumSet` follows **enum declaration order** and rejects `null`.

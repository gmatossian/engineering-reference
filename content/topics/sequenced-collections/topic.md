---
id: 'c6d0c192-60ee-45ba-9580-745e7bf29259'
title: 'Sequenced collections'
summary: 'Use Java 21’s uniform first, last, and reversed operations on collections with encounter order.'
iconKey: 'ordering'
domains:
  - 'java'
  - 'collections'
kind: 'operations'
childTopicIds: []
relatedTopicIds: []
---

Java 21 introduced `SequencedCollection`, `SequencedSet`, and `SequencedMap` for
collections with a defined **encounter order**.

```java
List<String> names = new ArrayList<>(List.of("Ada", "Linus"));

names.addFirst("Grace");
String last = names.getLast();
List<String> reverseOrder = names.reversed();
```

| Need              | Sequenced operation             |
| ----------------- | ------------------------------- |
| Read either end   | `getFirst()`, `getLast()`       |
| Add at either end | `addFirst(e)`, `addLast(e)`     |
| Remove either end | `removeFirst()`, `removeLast()` |
| Reverse traversal | `reversed()`                    |

`reversed()` returns a **view**, not a copy: changes are visible through both
orientations. End-modifying methods are optional operations and may throw
`UnsupportedOperationException` for an unmodifiable collection.

---
id: '0ad85071-497d-4891-9d3d-8cc8d207495e'
title: 'Lookup and update patterns'
summary: 'Choose the Map operation that expresses fallback, initialization, replacement, or accumulation directly.'
iconKey: 'operations'
childTopicIds: []
---

Choose the operation that expresses the intended update directly.

| Intent                   | Operation                     | Behavior                                      |
| ------------------------ | ----------------------------- | --------------------------------------------- |
| Read with a fallback     | `getOrDefault(key, fallback)` | Does not change the map                       |
| Add only when absent     | `putIfAbsent(key, value)`     | Preserves an existing non-null value          |
| Derive a missing value   | `computeIfAbsent(key, fn)`    | Calls `fn` for an absent or null-valued key   |
| Change an existing value | `computeIfPresent(key, fn)`   | Calls `fn` only for a present, non-null value |
| Recalculate either case  | `compute(key, fn)`            | Passes the current value, or `null`           |
| Add or combine a value   | `merge(key, value, fn)`       | Inserts when absent; combines when present    |

`getOrDefault` uses its fallback only when the key is absent. If the key explicitly
maps to `null`, it returns `null`.

## Initialize a collection value

```java
peopleByTeam.computeIfAbsent(team, ignored -> new ArrayList<>()).add(person);
```

## Accumulate a count

```java
wordCounts.merge(word, 1, Integer::sum);
```

For `compute`, `computeIfPresent`, and `merge`, a remapping function that returns
`null` **removes the mapping**. The remapping function should not modify the map
being computed.

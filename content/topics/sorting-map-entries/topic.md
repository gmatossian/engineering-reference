---
id: 'e28eb58c-f60a-43df-99e0-7f51d031f5c4'
title: 'Sorting map entries'
summary: 'Order key-value pairs by value, then break ties by key without changing the map.'
iconKey: 'ordering'
domains:
  - 'java'
  - 'collections'
kind: 'operations'
childTopicIds: []
relatedTopicIds: []
---

## By value descending, then key ascending

```java
Map<String, Integer> scores = Map.of("Ada", 95, "Grace", 98, "Alan", 95);

Comparator<Map.Entry<String, Integer>> byScoreThenName =
    Map.Entry.<String, Integer>comparingByValue()
        .reversed()
        .thenComparing(Map.Entry.comparingByKey());

List<Map.Entry<String, Integer>> ranked = scores.entrySet().stream()
    .map(Map.Entry::copyOf)
    .sorted(byScoreThenName)
    .toList();
// [Grace=98, Ada=95, Alan=95]
```

- Put `.reversed()` **before** `.thenComparing(...)` to reverse only the value
  order; keys still break ties in ascending order. Reversing the whole chain
  reverses both.
- The explicit `<String, Integer>` on `comparingByValue()` supplies the types
  that Java may not infer through the chained calls.
- This produces an **ordered list of entries**, not a value-sorted map. The
  original map is unchanged; `Map.Entry.copyOf` makes each result independent
  of the map.

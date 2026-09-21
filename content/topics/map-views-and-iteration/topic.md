---
id: 'fc3f3ad0-3d94-42a5-a79b-9309c1140cf0'
title: 'Map views and iteration'
summary: 'Iterate keys, values, or entries without extra lookups or accidental changes through backed views.'
iconKey: 'collection'
domains:
  - 'java'
  - 'collections'
kind: 'operations'
childTopicIds: []
relatedTopicIds:
  - 'e28eb58c-f60a-43df-99e0-7f51d031f5c4'
---

Choose the view that contains exactly what the operation needs.

| Need            | Use          | View type              | Element type      |
| --------------- | ------------ | ---------------------- | ----------------- |
| Keys only       | `keySet()`   | `Set<K>`               | `K`               |
| Values only     | `values()`   | `Collection<V>`        | `V`               |
| Keys and values | `entrySet()` | `Set<Map.Entry<K, V>>` | `Map.Entry<K, V>` |

Use `forEach` for a direct key-value action:

```java
scores.forEach((name, score) -> System.out.println(name + ": " + score));
```

Use `entrySet()` when a loop needs each pair:

```java
for (Map.Entry<String, Integer> entry : scores.entrySet()) {
    System.out.println(entry.getKey() + ": " + entry.getValue());
}
```

All three collections are **backed views**, not independent copies. Removing from a
view removes the corresponding mapping from the map; adding directly to these views
is not supported.

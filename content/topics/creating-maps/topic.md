---
id: 'c3e7b0c0-b574-4edd-89ec-24f50f206522'
title: 'Creating maps'
summary: 'Choose a map construction based on mutability, copying, null handling, and duplicate keys.'
iconKey: 'creation'
childTopicIds: []
---

Choose the construction by the required **mutability** and how invalid or repeated
input should be handled.

| Construction            | Result                | `null` keys/values | Duplicate-key behavior     |
| ----------------------- | --------------------- | ------------------ | -------------------------- |
| `new HashMap<>()`       | Modifiable            | Allowed            | A later `put` replaces     |
| `new HashMap<>(source)` | Modifiable copy       | Allowed            | Source keys already unique |
| `Map.of(...)`           | Unmodifiable          | Rejected           | Rejected                   |
| `Map.ofEntries(...)`    | Unmodifiable          | Rejected           | Rejected                   |
| `Map.copyOf(source)`    | Unmodifiable snapshot | Rejected           | Source keys already unique |

`Map.of` accepts up to ten key-value pairs. Use `Map.ofEntries` for more:

```java
Map<String, Integer> scores = Map.ofEntries(
    Map.entry("Ada", 95),
    Map.entry("Grace", 98)
);
```

An **unmodifiable map does not make its keys or values immutable**. It only prevents
adding, removing, or replacing mappings through that map.

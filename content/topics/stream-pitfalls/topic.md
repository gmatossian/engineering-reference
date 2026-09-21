---
id: 'cb9514d7-b891-46f4-98b8-4a5d0847b332'
title: 'Stream pitfalls'
summary: 'Avoid consumed streams, invisible laziness, unsafe side effects, immutable results, and duplicate map keys.'
iconKey: 'operations'
domains:
  - 'java'
kind: 'operations'
childTopicIds: []
relatedTopicIds: []
---

| Trap                                     | Consequence                                     |
| ---------------------------------------- | ----------------------------------------------- |
| Reuse after a terminal operation         | May throw `IllegalStateException`               |
| No terminal operation                    | The lazy pipeline is never traversed            |
| Mutate shared state in `map` or `filter` | Fragile sequential code; unsafe parallel code   |
| Modify the source during traversal       | May fail or produce unpredictable results       |
| Assume `stream.toList()` is mutable      | Mutation throws `UnsupportedOperationException` |
| Duplicate keys in `Collectors.toMap`     | Throws `IllegalStateException`                  |

A stream is single-use:

```java
Stream<String> stream = names.stream();
long count = stream.count();

stream.findFirst(); // invalid: stream already consumed
```

State the duplicate-key policy when collecting to a map:

```java
Map<String, User> byEmail = users.stream()
    .collect(Collectors.toMap(
        User::email,
        Function.identity(),
        (first, duplicate) -> first
    ));
```

Prefer reductions and collectors over external mutation. Treat `peek(...)` as a
diagnostic aid, not as a required business action: stream optimizations may omit its
execution when it cannot affect the result.

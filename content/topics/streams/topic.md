---
id: '2d23f8e8-66db-4d0a-b5bc-bfc0536d5ab8'
title: 'Streams'
summary: 'Build lazy, single-use pipelines that transform or aggregate a sequence of values.'
iconKey: 'operations'
domains:
  - 'java'
kind: 'concept'
childTopicIds:
  - '45d1ae48-9ecf-4186-8df2-2e199ebcb4b4'
  - 'f9ff7ed9-ecd3-432c-b2e6-5ae1e323f3b0'
  - 'cb9514d7-b891-46f4-98b8-4a5d0847b332'
  - '57cd79fd-a949-4942-b6bf-34aba40ad7cd'
relatedTopicIds: []
---

A stream is a **lazy pipeline over a data source**. It does not store the elements;
it describes how they should be processed when a terminal operation requests a
result.

```java
List<String> cleanedNames = names.stream()
    .filter(name -> !name.isBlank())
    .map(String::trim)
    .sorted()
    .toList();
```

| Pipeline part | Example                   | Role                                         |
| ------------- | ------------------------- | -------------------------------------------- |
| Source        | `names.stream()`          | Supplies elements                            |
| Intermediate  | `filter`, `map`, `sorted` | Lazily describes transformations             |
| Terminal      | `toList()`                | Traverses the source and produces the result |

Intermediate operations do no work until a terminal operation begins traversal.
After a terminal operation, the stream is **consumed and cannot be reused**; create a
new stream from the source for another traversal.

In ordinary business code, a terminal operation usually appears at the end of the
same expression. Laziness matters because operations can be **fused into one
traversal**, and short-circuiting operations such as `findFirst`, `anyMatch`, and
`limit` can **stop processing early**.

Streams are strongest when the task reads like a sequence of transformations. A loop
is often clearer when control flow or coordinated mutation is the main concern.

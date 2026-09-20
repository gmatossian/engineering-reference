---
id: '00000000-0000-4000-8000-000000000004'
title: 'Shared path'
summary: 'Multi-parent fixture with generated content and a child.'
iconKey: 'queue'
domains:
  - 'java'
  - 'collections'
  - 'concurrency'
kind: 'concept'
childTopicIds:
  - '00000000-0000-4000-8000-000000000005'
relatedTopicIds: []
---

A shared path appears beneath both fixture branches so hierarchy behavior can be tested without
depending on the reference catalog.

## Common operations

```java
fixture.offer(value);
```

![Nodes entering and leaving a stable fixture flow](./fixture-flow.svg)

## Selection notes

Use the child entry to exercise navigation, history, focus, and generated table behavior.

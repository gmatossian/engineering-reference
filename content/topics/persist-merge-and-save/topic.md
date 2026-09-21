---
id: 'd1a3f0d1-92a1-4c65-87a0-ee7d8d10131e'
title: 'persist, merge, and save'
summary: 'Distinguish making a new entity managed from copying detached state into a managed instance.'
iconKey: 'operations'
domains:
  - 'java'
  - 'persistence'
  - 'databases'
kind: 'decision-aid'
childTopicIds: []
relatedTopicIds:
  - '072fc2b2-2755-45ec-aabe-d8a4740fa4e9'
  - '62196430-caa5-48c7-bb68-c064209d6291'
---

| Operation                    | Intended input         | What becomes managed                    | Return value               |
| ---------------------------- | ---------------------- | --------------------------------------- | -------------------------- |
| `entityManager.persist(...)` | New entity             | The **same instance**                   | Nothing                    |
| `entityManager.merge(...)`   | New or detached state  | A managed instance receiving that state | The **managed instance**   |
| `repository.save(...)`       | New or existing entity | Uses `persist` or `merge`               | The instance to keep using |

`merge` does **not reattach the argument**. It copies that object's state into a
managed instance and returns the managed result:

```java
Customer managed = entityManager.merge(detached);
```

Use the returned value. Continuing to change `detached` does not change `managed`
or become dirty-checked automatically.

## Prefer load then modify for partial updates

Merging a partially populated or stale detached object may copy unwanted state over
newer database values. For an ordinary update, load the managed entity inside the
transaction and change only the intended fields.

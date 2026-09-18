---
id: 'f8accec6-81ae-48da-bf60-8209557f15af'
title: 'Spring Data repository methods'
summary: 'Connect common JpaRepository methods to their usual EntityManager behavior and important return values.'
iconKey: 'operations'
domains:
  - 'java'
  - 'persistence'
  - 'databases'
kind: 'operations'
childTopicIds: []
relatedTopicIds: []
---

Spring Data JPA supplies a `SimpleJpaRepository` implementation for ordinary
repository interfaces. Its common methods take these paths:

| Repository method      | Typical JPA path                                  | Important result                                    |
| ---------------------- | ------------------------------------------------- | --------------------------------------------------- |
| `save(entity)`         | `persist` when new; otherwise `merge`             | **Use the returned instance**                       |
| `findById(id)`         | `EntityManager.find(...)`                         | Returns an `Optional`; loads the entity if present  |
| `getReferenceById`     | `EntityManager.getReference(...)`                 | May defer database access until state is first used |
| `delete(entity)`       | Ensures an entity is managed, then calls `remove` | Deletion is synchronized during flush               |
| `flush()`              | `EntityManager.flush()`                           | Sends pending changes; does **not commit**          |
| `saveAndFlush(entity)` | `save(...)`, then `flush()`                       | Forces synchronization before the transaction ends  |

These are the usual paths in the current default implementation, not a promise that
every repository operation maps one-to-one to one `EntityManager` call.

`getReferenceById` may not contact the database immediately. If the row is missing,
`EntityNotFoundException` can surface only when the entity state is first accessed.

Use a service transaction when a use case combines multiple repository operations:

```java
@Transactional
public void renameCustomer(long id, String name) {
    Customer customer = customers.findById(id).orElseThrow();
    customer.setName(name);
}
```

The loaded entity is managed, so dirty checking handles the update; another
`save(...)` call is not required for JPA to detect it.

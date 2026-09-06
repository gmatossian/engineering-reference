---
id: '072fc2b2-2755-45ec-aabe-d8a4740fa4e9'
title: 'EntityManager and entity lifecycle'
summary: 'Recognize new, managed, detached, and removed entities and the persistence context that owns them.'
iconKey: 'persistence'
childTopicIds: []
---

An `EntityManager` owns a **persistence context**: for each entity type and database
identity, it maintains at most one managed Java object.

| State    | Meaning                                          | Typical transition                             |
| -------- | ------------------------------------------------ | ---------------------------------------------- |
| New      | Created in Java; not yet persistent or managed   | `persist(entity)`                              |
| Managed  | Tracked by the current persistence context       | Loaded, persisted, or returned from `merge`    |
| Detached | Has persistent identity but is no longer tracked | Transaction/context ends, `detach`, or `clear` |
| Removed  | Managed and scheduled for deletion               | `remove(entity)`                               |

Use `entityManager.contains(entity)` to ask whether that exact instance is managed
by the current persistence context.

## Detached state

A detached entity is still an ordinary Java object, but changes to it are **not
automatically synchronized** with the database. Entities commonly become detached
when a transaction-scoped persistence context ends.

Unfetched lazy state may also become unavailable after detachment. Either fetch the
required data before leaving the transaction or map it to a result designed for the
caller.

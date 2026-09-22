---
id: '57b0dc57-7a64-4c09-9140-2a470748da38'
title: 'JPA'
summary: 'Understand repositories, entity lifecycle, dirty checking, flushing, and lazy-loading boundaries.'
iconKey: 'persistence'
domains:
  - 'java'
  - 'persistence'
  - 'databases'
kind: 'area'
childTopicIds:
  - 'f8accec6-81ae-48da-bf60-8209557f15af'
  - '072fc2b2-2755-45ec-aabe-d8a4740fa4e9'
  - 'd1a3f0d1-92a1-4c65-87a0-ee7d8d10131e'
  - '62196430-caa5-48c7-bb68-c064209d6291'
  - '1dbd7b94-8a7b-41d0-8b1f-46d2e5b21720'
  - '3ee152a5-33e8-4700-8e08-1b35439f5e8e'
  - 'eb6449dd-f815-42a9-8f95-7a6dc0d5341a'
relatedTopicIds: []
---

Jakarta Persistence (**JPA**) is the standard contract for mapping Java objects to
relational data. `EntityManager` is its central API; Hibernate is a common provider,
and Spring Data JPA adds repository abstractions on top.

![Common Spring Data JPA path from a repository through JPA and Hibernate to the database](./jpa-layers.svg)

| Layer                      | Responsibility                                            |
| -------------------------- | --------------------------------------------------------- |
| Spring Data JPA repository | Provides generated repository implementations             |
| JPA and `EntityManager`    | Define entity lifecycle and persistence operations        |
| Hibernate                  | Implements JPA and translates managed changes into SQL    |
| Relational database        | Stores rows and enforces database constraints and commits |

The key boundary is the **persistence context**. While an entity is managed inside
it, field changes can be detected and written without an explicit update call. Once
the entity is detached, that automatic tracking no longer applies.

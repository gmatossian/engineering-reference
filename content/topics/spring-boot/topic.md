---
id: 'de9bf772-5146-4995-a438-161b5ad229d2'
title: 'Spring and Spring Boot'
status: 'accepted'
summary: 'Distinguish Spring Framework, MVC, and Boot; see what Boot automates.'
iconKey: 'network'
domains:
  - 'java'
kind: 'area'
childTopicIds:
  - '2eae671e-54ad-4afa-b85f-26415d0cea59'
  - '31ee0d58-0999-457e-9d7c-5fe20ef9be56'
  - '973352f3-ac82-42a1-a38a-5c09e3946de0'
relatedTopicIds: []
---

## Framework, other projects, and Boot

![Spring Framework contains core container, data-access, web, and testing modules; MVC and WebFlux are part of its web support. Separate projects Spring Data, Security, Integration, and Batch build on the Framework. Optional Spring Boot helps configure and run applications using the selected pieces.](./spring-ecosystem.svg)

**MVC and Boot work together.** MVC handles web requests; Boot sets up the
application around it. Boot also supports **non-web applications**.

## Why use Spring?

- Dependency injection: Spring **creates and connects components**, reducing
  manual wiring.
- Shared infrastructure: reuse transaction, web, data-access, and testing support;
  **your code supplies business rules**.
- Trade-off: adopt a **framework lifecycle and configuration conventions**.
  Small programs may not need that infrastructure.

## Spring without Boot vs with Boot

| Spring without Boot        | What Boot adds                     |
| -------------------------- | ---------------------------------- |
| Choose dependency versions | **Managed versions + starters**    |
| Configure infrastructure   | **Conditional auto-configuration** |
| Set up web deployment      | **Embedded server + runnable JAR** |

These are common web-application setup choices. Boot's defaults can be
**overridden**; an embedded server is not the only deployment option.

Spring without Boot can use **Java configuration and annotations**, not just XML.
Boot reduces setup work; it does not replace Spring Framework or MVC.

## What Spring does not supply

- **A language, JVM, or database:** Spring integrates with these technologies.
- **Your business rules:** you still write and test application behavior.
- **A required microservice architecture:** Spring and Boot also support monoliths
  and batch applications.

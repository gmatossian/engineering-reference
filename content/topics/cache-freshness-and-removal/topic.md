---
id: '96043816-0007-44be-bb0c-744b7644ba2b'
title: 'Cache freshness and removal'
status: 'accepted'
summary: 'Distinguish invalidation, expiration, and eviction; choose freshness and refill safeguards.'
iconKey: 'architecture'
domains:
  - 'system-design'
kind: 'concept'
childTopicIds: []
relatedTopicIds:
  - 'cf8efa87-1231-4038-a650-e6aee282c406'
---

## Why an entry stops being usable

| Mechanism        | Trigger           |
| ---------------- | ----------------- |
| **Invalidation** | Data changed      |
| **Expiration**   | TTL elapsed       |
| **Eviction**     | Capacity / policy |

- **Invalidation:** remove old `product:123` details after a product update.
- **Expiration:** a **30-second TTL** runs out.
- **Eviction:** remove a less-used entry to **make room**. Some APIs also call
  explicit invalidation “eviction.”

> **TTL does not guarantee retention:** an entry can be **evicted before it
> expires**. Cache misses must be handled at any time.

## Choose a freshness policy

- **Short TTL:** fresher reads, but **more source loads**.
- **Long TTL:** more reuse, but updates can stay **invisible longer**.
- **Explicit invalidation:** reacts to changes, but **update/delete ordering** and
  concurrent refills matter; deletion alone does not guarantee strict freshness.

**Stock reservations:** cached availability is useful for display. Confirm
purchases using a **database operation that checks and reserves stock atomically**.

## Avoid refill bursts

- **Stagger expiration:** vary TTLs so entries do not expire together.
- **Combine concurrent loads:** one source load for the same missing key; scope
  coordination deliberately across instances.
- **Prewarm:** load selected hot entries before expected traffic.

**Outage fallback:** bound source traffic; replicas and failover reduce cache
single-node risk but do not make the database able to absorb every miss.

Reference: [Redis eviction policies](https://redis.io/docs/latest/develop/reference/eviction/).

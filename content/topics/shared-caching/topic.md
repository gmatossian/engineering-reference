---
id: '4aa75f9e-93ce-46e3-80d7-ac13d14a77c0'
title: 'Shared caching'
status: 'accepted'
summary: 'Compare shared-cache benefits, tradeoffs, and common implementation options.'
iconKey: 'architecture'
domains:
  - 'system-design'
kind: 'concept'
childTopicIds:
  - 'f636b055-7dde-4acf-b4ec-678b8127c9da'
  - '96043816-0007-44be-bb0c-744b7644ba2b'
  - '0eab5dfb-d4ab-4cf8-a56c-41b4548da56c'
relatedTopicIds:
  - '9009159b-54aa-4724-94a2-5189a1e21437'
  - '92179879-7f1c-49b1-8751-cf296302bb82'
---

## Main use

Reuse **expensive, repeated reads across application instances**: product details,
computed results, and frequently read reference data.

## Benefits and tradeoffs

- **Faster reads, less database load:** cache misses still load the source.
- **Reusable results:** may be **stale**; updates need a freshness policy.
- **Shared capacity:** costs **memory**, a **network hop**, and operational effort.
- **Shared dependency:** cache outages can affect **all application instances**.

> **Fallback needs limits:** cache outages and miss bursts can overload the
> database. It may not handle the **full uncached workload**.

## Shared versus local

- **Shared cache:** instances reuse the **same cached results**; requires remote
  access.
- **Per-instance local cache:** **no network hop**, but each instance has its own
  data, warm-up, and invalidation needs.

## Common implementations

- **Redis / Valkey:** in-memory keys, TTLs, data structures, and atomic operations.
- **Memcached:** simpler, disposable **key/value caching**.
- **Amazon ElastiCache:** **managed AWS service** for Valkey, Redis OSS, or Memcached.
- **Caffeine:** Java **local-cache alternative**, inside each application instance.

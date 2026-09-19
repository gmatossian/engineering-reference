---
id: 'bec92ddc-6f0c-48a5-a576-1e49a92d5c3a'
title: 'Choosing storage for a URL shortener'
summary: 'Match URL mappings, redirect lookups, and analytics events to suitable storage workloads.'
iconKey: 'database'
domains:
  - 'databases'
  - 'system-design'
kind: 'decision-aid'
childTopicIds: []
relatedTopicIds:
  - '8cd3c5fb-eea7-4398-ba7e-8b6496ec431f'
---

Choose storage per **workload**, not once for the entire system. Start with the
simplest store that meets current requirements; specialize only when measured
access patterns or scale justify the added cost.

## Workload → starting point

- **Create and manage short URLs → Relational database.** Constraints,
  transactions, ownership, and flexible queries.
- **Resolve `shortCode → longUrl` → Indexed relational lookup.** A simple,
  sufficient default before scale proves otherwise.
- **Repeated hot redirects → Cache.** Reduce authoritative-store reads without
  changing the system of record.
- **Partitioned direct lookup at demonstrated scale → Distributed key-value
  store.** Partition by key and add capacity horizontally.
- **Store and query redirect events → Analytics database.** Support large scans,
  grouping, aggregation, and retention off the request path.

Keep event capture off the synchronous redirect path. A queue or durable event
stream can buffer events; the analytics database stores and queries them.

## Relational or key-value?

- **Relational database:** key lookup plus flexible queries, joins, unique
  constraints, and mature transactions. Start with one general-purpose system;
  scale up, index, replicate reads, cache, then shard if evidence requires it.
- **Key-value store:** direct lookup by a known key and straightforward horizontal
  partitioning. Access patterns, secondary queries, cross-record changes, hot keys,
  consistency, and repartitioning require deliberate handling.

A relational primary-key lookup is already a key lookup. Do not introduce a
key-value store merely because the redirect path uses a key.

## Starting relational shape

Store the authoritative mapping relationally:

```text
short_code  primary key
long_url
owner_id
created_at
expires_at
```

## Evidence → next move → cost

- **Redirect lookups miss the latency target → Inspect the query plan and verify
  the primary-key index.** Another index adds write and storage overhead only if
  the access pattern actually needs one.
- **A small set of mappings receives repeated reads → Cache hot mappings.** Name
  invalidation, eviction, hot-key, and stale-data behavior.
- **Read load exceeds the primary's practical capacity → Scale up or add read
  replicas.** Name instance cost, replica lag, and failover behavior.
- **Analytics work threatens redirect latency → Buffer events and write them to an
  analytics store.** Name lag, retries, retention, and pipeline operations.
- **Measured scale requires partitioned direct lookup → Consider a distributed
  key-value authoritative store.** Name narrower queries, repartitioning, and
  consistency work.

Choose the option whose constraints match the measured workload, not the datastore
with the broadest scaling claim.

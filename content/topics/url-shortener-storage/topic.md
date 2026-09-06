---
id: 'bec92ddc-6f0c-48a5-a576-1e49a92d5c3a'
title: 'Choosing storage'
summary: 'Match URL mappings, redirect lookups, and analytics events to suitable storage workloads.'
iconKey: 'database'
childTopicIds: []
---

Choose storage per **workload**, not once for the entire system. A URL shortener can
use different stores for authoritative mappings, fast redirects, and analytics.

## Separate the workloads

| Workload                        | Starting point                           | Why                                                        |
| ------------------------------- | ---------------------------------------- | ---------------------------------------------------------- |
| Create and manage short URLs    | Relational database                      | Constraints, transactions, ownership, and flexible queries |
| Resolve `shortCode → longUrl`   | Indexed relational lookup                | Simple, sufficient default before scale proves otherwise   |
| Resolve at demonstrated scale   | Cache or distributed key-value store     | Direct lookup, partitioning by key, and horizontal scale   |
| Store and query redirect events | Analytics database, off the request path | Large scans, grouping, aggregation, and retention          |

Event capture may first pass through a queue or durable event stream. The analytics
database is where those events are stored and queried; it should not delay the
critical redirect path.

## Relational or key-value?

| Concern            | Relational database                                 | Key-value store                                        |
| ------------------ | --------------------------------------------------- | ------------------------------------------------------ |
| Primary access     | Key lookup plus flexible queries and joins          | Direct lookup by a known key                           |
| Integrity          | Unique constraints and mature transactions          | Usually narrower or implementation-specific controls   |
| Query flexibility  | Secondary indexes, joins, and ad hoc queries        | Access patterns must usually be designed in advance    |
| Initial operation  | One general-purpose system may be enough            | Adds a specialized system and its operational cost     |
| Scaling path       | Scale up, index, replicate reads, cache, then shard | Partition by key and add capacity horizontally         |
| Scaling difficulty | Cross-shard joins and transactions become harder    | Hot keys, consistency, and repartitioning still matter |

A relational primary-key lookup is already a key lookup. Do not introduce a
key-value store merely because the redirect path uses a key.

## A practical starting design

Store the authoritative mapping relationally:

```text
short_code  primary key
long_url
owner_id
created_at
expires_at
```

Then evolve from evidence:

1. Index and measure the redirect lookup.
2. Cache hot mappings if database reads become significant.
3. Keep analytics event ingestion away from the synchronous redirect path.
4. Consider a distributed key-value primary store only when throughput,
   availability, or partitioning requirements justify its constraints.

## Scaling trade-offs

Relational databases can scale a long way through **indexes, larger instances, read
replicas, and caching**. Sharding is possible, but relationships, constraints, and
transactions become harder when their data spans shards.

Key-value stores often make horizontal partitioning more direct because the key
determines placement. In exchange, secondary access patterns, cross-record changes,
and consistency behavior require more deliberate design.

The decision is not “which database scales?” It is **which trade-offs match the
measured workload without adding unjustified complexity?**

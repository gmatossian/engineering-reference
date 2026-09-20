---
id: '9009159b-54aa-4724-94a2-5189a1e21437'
title: 'Trade-off triggers'
summary: 'Turn system requirements into explicit design choices and name the cost of each bias.'
iconKey: 'architecture'
domains:
  - 'system-design'
kind: 'decision-aid'
childTopicIds: []
relatedTopicIds: []
---

Start with what **must be true**. Choose the simplest bias that satisfies that
requirement, name its cost, and revisit it when the requirement changes.

## Requirement → bias → cost

- **Need joins, constraints, transactions, or flexible queries?**
  - Yes → **Relational** — schema coordination and harder sharding.
  - No → **Access-pattern store** — duplication and application rules.
- **Must the caller receive the result in this response?**
  - Yes → **Synchronous** — coupled latency and availability.
  - No → **Asynchronous** — lag, retries, state, and duplicates.
- **Must consumers replay or derive independent views?**
  - Yes → **Stream or log** — retention, offsets, and replay discipline.
  - No → **Queue** — less history available for replay.
- **Do writes or total data exceed one authority's capacity?**
  - Yes → **Partition** — routing, hot keys, and cross-key work.
  - No → **Replicate to scale reads** — lag and failover decisions.
- **Could a stale read cause an incorrect or unsafe decision?**
  - Yes → **Strong consistency** — coordination and latency.
  - No → **Eventual consistency** — reconciliation and divergence.
- **Are reads repeated and latency-sensitive?**
  - Yes → **Cache** — invalidation, eviction, hot keys, and stale data.
  - No → **Read the authority** — authority latency and load.

## State the decision

> Because **[requirement]** must be true, start with **[choice]**. This costs
> **[trade-off]**. Revisit it when **[trigger]** changes.

These choices are biases, not universal either-or rules. A system may combine them
at different boundaries—for example, a cache still has an authority, and a
partitioned store may also replicate each partition.

---
id: 'fa8a91df-3ad6-4a30-bba7-34ea42c9b1ac'
title: 'Relational databases (SQL)'
status: 'accepted'
summary: 'Recognize relational database strengths, workload fit, and the costs of that choice.'
iconKey: 'database'
domains:
  - 'databases'
  - 'system-design'
kind: 'decision-aid'
childTopicIds:
  - 'c606c59c-3d36-4a93-b3f7-d0fc8443c8dc'
  - '8e2ea19b-1ef4-4d5d-8655-446c1a9be1e3'
  - '047209de-a62c-4113-8912-d1e6ee20d834'
relatedTopicIds:
  - '9009159b-54aa-4724-94a2-5189a1e21437'
  - 'bec92ddc-6f0c-48a5-a576-1e49a92d5c3a'
  - '4aa75f9e-93ce-46e3-80d7-ac13d14a77c0'
---

## Key characteristics

| Property            | Benefit            |
| ------------------- | ------------------ |
| **Transactions**    | All-or-none writes |
| **Constraints**     | Enforced rules     |
| **Joins**           | Related queries    |
| **Tables + schema** | Typed records      |
| **SQL**             | Flexible queries   |

## When to use

- **Related business data:** orders, customers, and payments **queried together**.
- **Cross-record changes:** save an order and its items as **one operation**.
- **Shared integrity rules:** **reject duplicates** or references to **missing records**.

## When to consider alternatives

- **Large files and media:** consider **object storage** for the files themselves; keep their details and storage references in the **relational database**.
- **Data usually read together:** consider a **document database** when storing related data in **one document** simplifies common reads.
- **Very large key-based workloads:** evaluate **distributed key/value storage**.
- **Heavy analytical scans:** consider an **analytical store** separate from operational traffic.

These are evaluation triggers. Relational databases can store JSON and scale;
some non-relational stores also support transactions.

## Tradeoffs

- **Schema coordination:** **migrations** must work with deployed application versions.
- **Tuning effort:** joins, indexes, and queries need care; indexes add **write cost**.
- **Coordination cost:** **contention** and **distributed joins/transactions** complicate scaling.

> Correctness still depends on chosen **constraints, isolation, and locking**.
> A database transaction does not automatically include **external services**.

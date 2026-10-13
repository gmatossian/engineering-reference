---
id: 'fa8a91df-3ad6-4a30-bba7-34ea42c9b1ac'
title: 'Relational databases (SQL)'
status: 'draft'
summary: 'Choose relational storage for relationships, integrity, and transactions; recall hosting and scaling tradeoffs.'
iconKey: 'database'
domains:
  - 'databases'
  - 'system-design'
kind: 'decision-aid'
childTopicIds: []
relatedTopicIds:
  - '9009159b-54aa-4724-94a2-5189a1e21437'
  - 'bec92ddc-6f0c-48a5-a576-1e49a92d5c3a'
  - '4aa75f9e-93ce-46e3-80d7-ac13d14a77c0'
---

## When relational storage fits

- **Related records and joins:** customers, orders, and order items queried together.
- **Integrity rules:** unique identifiers, required values, and references to existing records.
- **Changes that must succeed together:** create an order and its items in one transaction.
- **Flexible queries:** filtering, aggregation, and reporting beyond one fixed lookup pattern.

## Benefits and costs

### Transactions and constraints

- **Benefit:** Commit related changes together; enforce rules in the database.
- **Cost:** Locking, contention, and isolation choices require care under concurrency.

### SQL and relationships

- **Benefit:** Query across related data without maintaining a separate copy for every access pattern.
- **Cost:** Joins, indexes, and query plans need tuning; indexes also cost storage and write work.

### Explicit schema

- **Benefit:** Shared structure, types, and constraints make data contracts clear.
- **Cost:** Schema changes need migrations and coordination with deployed application versions.

Transactions do not automatically enforce every business invariant. Choose the
right constraints, isolation, and locking. A database transaction also does not
automatically include a payment provider or another external service.

## When to consider alternatives

- **Large files or media dominate:** object storage for the bytes; keep searchable metadata in the database.
- **Whole-document reads dominate:** evaluate a document store when it simplifies the data model and update boundary.
- **Huge workloads use predictable key-based access:** evaluate a distributed key/value store when simpler relational scaling no longer meets the measured need.
- **Large analytical scans compete with operational traffic:** consider a separate analytical store or warehouse.

These are evaluation triggers, not exclusions. Relational databases can store
JSON and scale substantially; some non-relational stores also support transactions.
Compare the actual access patterns and guarantees.

## Engine and hosting choices

**Common engines:** PostgreSQL, MySQL, MariaDB, Microsoft SQL Server, Oracle Database.

### Self-managed

- **Benefit:** More control over the host, database configuration, and extensions.
- **Cost:** Your team operates backups, upgrades, recovery, and availability.

### Managed service

- **Benefit:** Provider handles much of the database infrastructure and routine administration.
- **Cost:** Service charges, platform dependency, and limits on host access or supported features.

**Amazon RDS is a managed service; you choose an engine.** RDS for PostgreSQL
runs PostgreSQL; RDS for MySQL runs MySQL. PostgreSQL itself is not AWS-specific.

Managed hosting still leaves your team responsible for schema, queries, indexes,
application transactions, capacity decisions, and access configuration.

## How they scale

- **Tune first:** inspect queries, indexes, connection pools, and contention before adding infrastructure.
- **Vertical scaling:** add CPU, memory, or faster storage; eventually reaches capacity or cost limits.
- **Read replicas:** distribute eligible reads; asynchronous replication can lag. They do not distribute primary writes.
- **Caching:** offload repeated reads; introduces freshness and invalidation decisions.
- **Sharding:** spread data and write load across database nodes; adds routing, hot-key management, and cross-shard join/transaction complexity.

**Table partitioning is not automatically sharding:** splitting a table inside
one database can improve pruning and maintenance without spreading writes across nodes.
Availability replicas and failover address resilience; extra read capacity depends
on the deployment. A read immediately after a write may need the primary or another
explicit consistency mechanism.

See [PostgreSQL transactions](https://www.postgresql.org/docs/current/tutorial-transactions.html),
[constraints](https://www.postgresql.org/docs/current/ddl-constraints.html),
[RDS engines and responsibilities](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Welcome.html),
and [RDS read replicas](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ReadRepl.html).

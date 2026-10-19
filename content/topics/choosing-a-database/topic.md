---
id: '402bfa92-4d74-4e49-a143-d2a4cf4922fd'
title: 'Choosing a database'
status: 'accepted'
summary: 'Match application requirements to database candidates, their advantages, and the costs of choosing them.'
iconKey: 'database'
domains:
  - 'databases'
  - 'system-design'
kind: 'decision-aid'
childTopicIds:
  - 'da02eee0-7185-4b6e-9cc3-3593cd5f6cff'
  - 'b7176ebc-db78-407d-a151-5e3cefb8a216'
relatedTopicIds:
  - 'fa8a91df-3ad6-4a30-bba7-34ea42c9b1ac'
  - '047209de-a62c-4113-8912-d1e6ee20d834'
---

> **For a typical business application, PostgreSQL is a reasonable starting candidate:**
> flexible queries, enforced relationships, and transactions in one engine.
> Consider another option when it makes an important requirement easier to meet.

**These capabilities overlap:** non-relational engines can also offer rich queries
and transactions. PostgreSQL combines them with **database-enforced foreign keys**.
For organization choices, see **Database data models**. For product capabilities
and guarantees, see **Comparing database engines**.

## Different questions about shared data → relational

**Need:** users search and report across records in different ways—for example,
projects by owner, overdue work by team, and time spent by client.

**Consider PostgreSQL.** Keep each person, project, and client in one place;
combine them differently with **SQL joins, filters, and grouping**. New questions
can often be answered with a new query/index instead of new copies of the data.

**Cost:** expensive joins and reports still need tuning; heavy analytics may need
a separate store. The advantage is smaller when nearly every request retrieves
the same self-contained record.

## Varied, self-contained records → document candidate

**Need:** store questionnaires with different nested answers; usually read and
edit one submission at a time.

**Consider MongoDB or PostgreSQL JSONB.** Store each submission as **one structured
record**, rather than designing tables for every answer shape. MongoDB makes the
document the primary storage/query unit; JSONB keeps nested data alongside SQL tables.

**Cost:** if shared information is copied into many records, updating it requires
updating those copies. Frequent combinations with separately maintained records
strengthen the case for PostgreSQL.

## Large traffic with predictable queries → partitioned key/value candidate

**Need:** very high request volume, mostly fetching one device's readings for a
time range, with few changing query requirements.

**Consider DynamoDB.** Its managed partitioning spreads storage and traffic;
organize readings by **device and time** to match that query.

**Cost:** a different question, such as readings across all devices by location,
may need another index or stored view.
A lookup by ID alone is not a reason to switch; PostgreSQL and MongoDB do that too.

**Hot spots still matter:** partitioning spreads work across data, but heavy traffic
to the same item or group of items can still cause a bottleneck—as with relational
and document databases. The remedy depends on whether the pressure comes from
**reads or writes**.

## Fast temporary state → Redis candidate

**Need:** cached results, expiring sessions, or rate-limit counters.

**Consider Redis:** in-memory access, expiration, and atomic counter operations.
**Cost:** memory capacity/cost and persistence choices matter; a durable business
record needs explicit recovery guarantees.

## Before committing to a candidate

> **Validate performance:** test representative reads and writes with realistic
> data volumes and concurrent requests. Check whether **response times, throughput,
> and cost** meet your requirements.
>
> **You don’t need to benchmark every candidate.** Use access patterns to shortlist,
> test the preferred option, and compare alternatives if performance remains a
> deciding uncertainty.

Include the **busiest read**, **most contentious update**, and **largest record**.

**Downtime and data loss:** how long can the application be unavailable, and how
much recent data could it afford to lose? Check that the proposed setup’s
**failover, backups, and restore times** meet those limits.

**Managed hosting does not choose the engine.**

**Other storage jobs:** files/media → **object storage**; large analytical scans →
consider an **analytical store**.

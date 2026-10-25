---
id: 'f91fe121-b9ee-4bb8-af0a-534e04df75df'
title: 'Idempotency storage choices'
status: 'draft'
summary: 'Choose a shared table, entity fields, an operation table or Redis.'
iconKey: 'persistence'
domains:
  - 'http'
  - 'system-design'
  - 'persistence'
kind: 'decision-aid'
childTopicIds: []
relatedTopicIds:
  - '902437bd-0214-4617-baa7-2730a2e2d45f'
---

## Choose where the record lives

| Store               | Choose when                 |
| ------------------- | --------------------------- |
| **Shared DB table** | Reuse across endpoints      |
| Entity fields       | One simple creation         |
| Operation table     | Domain operation has status |
| Redis               | Shared lookup with expiry   |

**Example choice: shared PostgreSQL table**, when the business write already
uses PostgreSQL. Claim, entity changes and saved response can **commit together**.
The costs are saved-response space and retention cleanup.

## Main tradeoffs

- **Entity fields:** tied to the entity lifecycle; less convenient for rejected
  operations or unrelated actions.
- **Operation table:** fits existing status/result tracking; needs domain-specific
  modeling.
- **Redis:** atomic claims are possible, but **Redis + SQL writes are not one
  local transaction**. Account for durability, eviction and recovery.

> **Retention is part of the contract.** Removing an idempotency record allows
> the same key to execute again later. Keep it for the documented retry window.

## Sources

- [AWS: durable intent records and atomicity](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/)
- [PostgreSQL: unique constraints](https://www.postgresql.org/docs/current/ddl-constraints.html#DDL-CONSTRAINTS-UNIQUE-CONSTRAINTS)
- [Redis: SET with expiry and NX](https://redis.io/docs/latest/commands/set/)

---
id: '8e2ea19b-1ef4-4d5d-8655-446c1a9be1e3'
title: 'Relational database implementations'
status: 'accepted'
summary: 'Recognize common relational engines and their managed AWS and GCP options.'
iconKey: 'database'
domains:
  - 'databases'
  - 'system-design'
kind: 'concept'
childTopicIds: []
relatedTopicIds:
  - '047209de-a62c-4113-8912-d1e6ee20d834'
---

## Managed AWS options

| Engine              | Managed AWS option |
| ------------------- | ------------------ |
| **PostgreSQL**      | RDS for PostgreSQL |
| **MySQL**           | RDS for MySQL      |
| **MariaDB**         | RDS for MariaDB    |
| **SQL Server**      | RDS for SQL Server |
| **Oracle Database** | RDS for Oracle     |

## Managed GCP options

| Engine         | Managed GCP option    |
| -------------- | --------------------- |
| **PostgreSQL** | Cloud SQL             |
| **PostgreSQL** | AlloyDB               |
| **MySQL**      | Cloud SQL             |
| **SQL Server** | Cloud SQL             |
| **Oracle**     | Database@Google Cloud |
| **MariaDB**    | No Cloud SQL option   |

- **Cloud SQL:** choose PostgreSQL, MySQL, or SQL Server as the engine.
- **AlloyDB:** a PostgreSQL-compatible service with a different underlying architecture.
- **Oracle Database@Google Cloud:** a separate Oracle service; not a Cloud SQL engine.

## Engine versus hosting

**The engine and its hosting are separate choices.** PostgreSQL is database
software; RDS for PostgreSQL is a managed deployment of that software.

## What should drive the choice?

- **Existing system:** compatibility with its SQL, drivers, types, and tooling.
- **Team experience:** ability to diagnose queries and operate the chosen engine.
- **Required features:** verify needed extensions, data types, and version support.
- **Cost and constraints:** licensing, service pricing, and provider restrictions.

Being relational does not make engines interchangeable. Check compatibility
before assuming a migration only changes the connection URL.

See [RDS engines](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Welcome.html#Welcome.Concepts.DBInstance.DBEngine),
[Cloud SQL](https://docs.cloud.google.com/sql/docs/postgres/introduction),
[AlloyDB](https://docs.cloud.google.com/alloydb/docs/overview),
and [Oracle Database@Google Cloud](https://docs.cloud.google.com/oracle/database/docs/overview).

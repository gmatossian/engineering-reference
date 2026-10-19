---
id: 'b7176ebc-db78-407d-a151-5e3cefb8a216'
title: 'Comparing database engines'
status: 'accepted'
summary: 'Compare query flexibility, atomic updates, integrity rules, and write distribution in concrete database engines.'
iconKey: 'database'
domains:
  - 'databases'
  - 'system-design'
kind: 'decision-aid'
childTopicIds: []
relatedTopicIds:
  - 'da02eee0-7185-4b6e-9cc3-3593cd5f6cff'
  - 'fa8a91df-3ad6-4a30-bba7-34ea42c9b1ac'
  - '64c5e924-a8ca-4aca-837e-d3b84c5ea1a6'
---

![Database comparison: PostgreSQL and MongoDB support joins; DynamoDB requires application-side combining. PostgreSQL enforces foreign keys; MongoDB and DynamoDB require application logic. All three support multi-record transactions. DynamoDB transactions cover up to 100 distinct items, with a 4 MB total limit, within one account and Region.](./database-engines-at-a-glance.png)

> **Supporting the same features does not mean doing the same work for your application.**
> Compare how each engine queries related records, updates them together, and
> enforces rules—and which responsibilities remain in application code.

## How flexible are non-relational queries?

**PostgreSQL and MongoDB both support filtering, joins, and aggregation.**

- **PostgreSQL:** a strong starting point when queries repeatedly combine
  **separately maintained records in different ways**—for example, reporting
  across employees, projects, and departments.
- **MongoDB:** a strong candidate when most operations work with **one
  self-contained document**, including its nested data. If common requests
  repeatedly reconstruct that unit by joining separate documents, the benefit
  of embedding is largely absent.
- **DynamoDB:** efficient queries are **tightly constrained by the keys you
  design**—for example, device and time for retrieving one device's readings.
  **Predictable access patterns** are particularly important. Without suitable
  table/index keys, you can still **scan and filter**, but may read many unrelated
  items. There are **no server-side joins**; application code must combine separate
  records, or the needed data must be stored together.

**Needing an index is not unique to DynamoDB.** PostgreSQL and MongoDB can run
ordinary field searches without a matching index, but may scan records too.
All three may need indexes for acceptable performance; PostgreSQL and MongoDB
provide **more flexible field queries**.

**Embedding helps when data belongs to one record and is usually read or changed
together.** See **Database data models** for the embedding-versus-reference examples.

**If both PostgreSQL and MongoDB express your queries comfortably, querying alone
may not decide the choice.** Relationship enforcement and **which changes must
succeed or fail together** are compared below. **Choosing a database** covers
performance validation and operational needs.

## Can non-relational databases enforce relationships?

**A stored reference is not an enforced relationship.** For example, a task's
`projectId` identifies a project; it does not itself prove that project exists.

- **PostgreSQL:** declare a **foreign key**. The database rejects an invalid
  project reference and can prevent deletion of a project that still has tasks.
  **Uniqueness constraints** can also reject duplicates.
- **MongoDB / DynamoDB:** **no built-in foreign-key constraint**. Application
  logic must check references and coordinate project deletion with task creation,
  including concurrent requests. Simply checking once before writing is insufficient.

> **Transactions do not automatically enforce relationships.** They can support
> application-written checks, but they do not declare a rule that every future
> write must obey.

**Decision:** many shared records with strict relationship rules favour
PostgreSQL: the database enforces declared constraints for every writer.

## Do non-relational databases support transactions?

**Yes—both document and key/value engines can.** Check the actual engine and
which records its transaction can cover.

- **PostgreSQL:** transactions group writes across rows and tables.
- **MongoDB:** one document write is atomic, including nested fields.
  **Multi-document transactions** provide all-or-none changes across documents,
  with more coordination than a single-document write.
- **DynamoDB:** one item write is atomic; **multi-item transactions** provide
  all-or-none changes across up to **100 distinct items / 4 MB**, within one
  account and Region. Transactional writes consume more capacity than ordinary writes.

> **The application chooses the operations; the database guarantees atomicity.**
> Several ordinary writes inside one service method are **not automatically a
> transaction**—including when the store is key/value.

**Decision:** a transfer between separate accounts needs an atomic change to
both balances; all three engines can provide it. Transaction support alone does
not select the winner.

> **Transactions still need concurrency rules:** choose what concurrent
> transactions may see (**isolation**) and how conflicting updates are handled—for
> example, through **locks or version checks**. Use **constraints** to enforce data
> rules. Calls to **external services** are not automatically part of the database
> transaction.

## Growth: where do additional writes go?

- **PostgreSQL, conventional primary/replica deployment:** writes go to the
  primary. Read replicas do not spread writes; sharding requires additional
  design/tooling, or a distributed SQL product.
- **MongoDB:** built-in sharding distributes data across shards. The shard key
  affects hot spots and whether a query targets one shard or many.
- **DynamoDB:** the service manages partitions and capacity. Key distribution
  still matters: one busy key can become a bottleneck.

**Decision:** distributed writes can justify a different engine when measured
load requires them. **NoSQL is not inherently faster**; neither sharding nor
managed capacity removes poor access patterns or hot records.

Sources: [PostgreSQL joins](https://www.postgresql.org/docs/current/tutorial-join.html),
[constraints](https://www.postgresql.org/docs/current/ddl-constraints.html),
[replication](https://www.postgresql.org/docs/current/different-replication-solutions.html),
[MongoDB atomicity](https://www.mongodb.com/docs/manual/core/write-operations-atomicity/),
[joins](https://www.mongodb.com/docs/manual/reference/operator/aggregation/lookup/),
[reference consistency](https://www.mongodb.com/docs/manual/data-modeling/data-consistency/),
[sharding](https://www.mongodb.com/docs/manual/sharding/),
[DynamoDB queries](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Query.html),
[transaction limits](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Constraints.html),
[partitions](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.Partitions.html).

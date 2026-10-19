---
id: '64c5e924-a8ca-4aca-837e-d3b84c5ea1a6'
title: 'Transactions and concurrent updates'
status: 'accepted'
summary: 'See why atomic transactions can oversell and choose a lock, conditional update, or version check to protect stock.'
iconKey: 'concurrency'
domains:
  - 'concurrency'
  - 'databases'
kind: 'decision-aid'
childTopicIds: []
relatedTopicIds:
  - 'b7176ebc-db78-407d-a151-5e3cefb8a216'
  - '3ee152a5-33e8-4700-8e08-1b35439f5e8e'
---

> **All-or-nothing does not mean one transaction at a time.** Atomicity groups
> changes; concurrency control protects decisions when transactions overlap.

## Why can both purchases succeed?

![At PostgreSQL Read Committed, requests A and B both read stock 1 and calculate 0. A writes 0 and commits its order. B then writes its previously calculated 0 and commits another order. Final result: stock 0, two orders for one unit.](./stale-stock-timeline.svg)

This **lost update** is possible at PostgreSQL's default **Read Committed**
isolation: both requests read `1`, calculate `0` in application code, then write
that literal `0`. Stronger isolation can reject this execution.

An unconditional `SET stock = stock - 1` is different: both decrements can apply,
leaving **−1** unless a constraint or other protection prevents it.

**PostgreSQL automatically locks rows it updates.** Competing writes to one row
wait for each other, but that does not protect an **earlier read/check**. No
explicit locking command does **not** mean no database locks.

## Choose protection for the stock rule

### Lock before checking

Read the stock row with `SELECT … FOR UPDATE`; check availability and update it
in the **same transaction**. Competing writers/locking reads wait until that
transaction ends; ordinary reads can still proceed.

**Cost:** contention and long transactions increase waiting; multiple locks can
introduce deadlocks.

### Atomic conditional update

Check sufficient stock **in the update itself**. Use the affected-row count or
returned row to decide whether the purchase may proceed.

**Cost:** callers must handle an unmet condition. Competing updates can still
wait on database locks; this is not lock-free.

### Version check

Include the **version originally read** in the update condition and increment
it atomically. A changed version rejects the stale write. Availability must
still be checked against the stock read.

**Cost:** conflicts require rollback and deliberate retry/rejection. A retry
must reread and revalidate; it is not permission to oversell. See **Optimistic
locking with @Version** for the JPA implementation.

## PostgreSQL: decrease only if stock remains

Inside the **same transaction as order and line-item creation**, for one unit
of product `42`:

```sql
UPDATE product_stock
SET stock = stock - 1
WHERE product_id = 42 AND stock >= 1
RETURNING stock;
```

Assume `product_id` uniquely identifies a stock row.

- **One returned row:** stock was decreased; commit only if all order/item writes
  also succeed.
- **No returned row:** insufficient stock or missing product; **roll back the
  order/items**. Updating zero rows does not automatically abort the transaction.
- **Any write error:** roll back the whole operation.

At **Read Committed**, a competing updater waits if needed and rechecks the
condition against the committed row. After the last unit is purchased, the next
update matches no row. Other isolation levels may instead raise a conflict.

Sources: PostgreSQL [transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html),
[row locking](https://www.postgresql.org/docs/current/explicit-locking.html),
and [UPDATE results](https://www.postgresql.org/docs/current/sql-update.html).

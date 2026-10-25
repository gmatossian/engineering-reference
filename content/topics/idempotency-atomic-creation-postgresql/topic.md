---
id: '902437bd-0214-4617-baa7-2730a2e2d45f'
title: 'Atomic creation — PostgreSQL'
status: 'draft'
summary: 'Claim a scoped key and commit the entity and saved response in one transaction.'
iconKey: 'persistence'
domains:
  - 'http'
  - 'system-design'
  - 'persistence'
  - 'databases'
kind: 'pattern'
childTopicIds: []
relatedTopicIds:
  - 'f91fe121-b9ee-4bb8-af0a-534e04df75df'
  - 'd1bdbbaf-a304-4848-b5cb-9c654666223b'
---

![A unique scoped key arbitrates a PostgreSQL claim. A competing uncommitted claim can make INSERT wait. One returned row means create the entity, save the response as completed and commit together. No returned row means read the committed record, compare its hash and replay a match or reject changed data. Failure before commit rolls back the claim and writes.](./claim-outcomes.svg)

## Claim inside the creation transaction

```sql
-- READ COMMITTED; business writes use this same transaction.
INSERT INTO idempotency_request
  (caller_scope, operation, idempotency_key,
   request_hash, state, expires_at)
VALUES (:scope, :op, :key, :hash, 'processing', :expiry)
ON CONFLICT (caller_scope, operation, idempotency_key)
DO NOTHING
RETURNING idempotency_key;
```

- **One row:** create the entity; save response + `completed`; **commit together**.
- **No row:** read the existing record in a **subsequent statement**, compare its
  hash, then replay a completed match or reject changed data. If cleanup removed
  the row, retry the claim with a bound.
- **Still waiting:** bound the database wait; roll back on timeout and return a
  documented retry response.

> **Do not use SELECT-then-INSERT as the guard.** The unique constraint arbitrates
> concurrent claims. Other transactions cannot read the uncommitted `processing`
> row in this short-transaction design.

## Shared table — JSON API example

```sql
CREATE TABLE idempotency_request (
  caller_scope     text         NOT NULL,
  operation        text         NOT NULL,
  idempotency_key  varchar(255) NOT NULL,
  request_hash     char(64)     NOT NULL, -- SHA-256 hex
  state            text         NOT NULL
                   CHECK (state IN ('processing', 'completed')),
  response_status  smallint,
  response_headers jsonb,
  response_body    jsonb,
  created_at       timestamptz  NOT NULL DEFAULT now(),
  expires_at       timestamptz  NOT NULL,
  PRIMARY KEY (caller_scope, operation, idempotency_key),
  CHECK (state <> 'completed' OR response_status IS NOT NULL)
);
CREATE INDEX ON idempotency_request (expires_at);
```

**Replay:** save status, JSON body and allowlisted headers such as `Location`.
**Never replay authentication/session headers.**

**Different design:** committing a long-running `processing` claim separately
requires **leases and recovery**. External effects need their own contract.

## Sources

- [PostgreSQL: INSERT, ON CONFLICT and RETURNING](https://www.postgresql.org/docs/current/sql-insert.html)
- [PostgreSQL: Read Committed visibility](https://www.postgresql.org/docs/current/transaction-iso.html)
- [AWS: atomic recording of the key and mutation](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/)

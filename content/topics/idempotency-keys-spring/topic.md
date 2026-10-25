---
id: '82285448-0224-4680-9635-4949d38ace49'
title: 'Backend handling — Spring'
status: 'draft'
summary: 'Recognize the shared-service flow and transaction boundary; open focused implementation references.'
iconKey: 'persistence'
domains:
  - 'http'
  - 'system-design'
  - 'persistence'
kind: 'pattern'
childTopicIds:
  - 'd12dac2e-dc21-459d-a7b8-d36770ae4c0b'
  - 'f91fe121-b9ee-4bb8-af0a-534e04df75df'
  - '902437bd-0214-4617-baa7-2730a2e2d45f'
  - 'd1bdbbaf-a304-4848-b5cb-9c654666223b'
relatedTopicIds:
  - '4d9848d0-0cc6-4cdf-b619-3a1141a2418a'
---

![A controller authenticates and validates the request, then calls a shared idempotency service. In one PostgreSQL transaction, a new claim creates the entity and saves the response before committing together. An existing committed key is checked for a matching fingerprint and replayed or rejected. Local failures roll back the claim and writes.](./backend-transaction.svg)

**Example choice:** a shared Spring service and a PostgreSQL table in the
**same database as the business write**.

## Essential guarantees

- **Identify:** look up **caller scope + operation + key**; compare the request
  fingerprint when that identity is reused.
- **Commit together:** the winning claim, entity changes and saved response
  share **one transaction**. Failed local work rolls them back together.
- **Authorize replays:** the key does not grant access to the saved result.

> **Limits:** deduplication lasts for the documented retention window.
> External effects, such as payment calls or email, need **their own
> idempotency or recovery contract**.

## Sources

- [AWS: caller intent and atomic recording](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/)
- [Spring: TransactionTemplate](https://docs.spring.io/spring-framework/reference/data-access/transaction/programmatic.html)

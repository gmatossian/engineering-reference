---
id: '548afcc9-4743-4fd9-a55f-33ee25f6a664'
title: 'Idempotency keys'
status: 'accepted'
summary: 'Recognize one intended operation across retries without repeating its effects.'
iconKey: 'architecture'
domains:
  - 'http'
  - 'system-design'
kind: 'pattern'
childTopicIds:
  - '4d9848d0-0cc6-4cdf-b619-3a1141a2418a'
  - '82285448-0224-4680-9635-4949d38ace49'
relatedTopicIds:
  - '2ceccf27-219c-479d-96de-229d4e417e3d'
  - '7b77e594-3472-4324-98b9-6705a606f976'
---

![POST /tickets sends key K1 and a JSON body. The saved result contains status 201, relevant headers and a JSON response body. A new key returns 201 Created; a completed matching retry returns the saved status, relevant headers and body. Reusing K1 with changed data returns 422.](./create-and-retry.svg)

**Diagram and stored-entry example:** after the operation completes, matching
retries replay the original **status**, **body** and **relevant headers**
(including `Location`).

**One intended creation → one key.** **Retries reuse it**; a **different intended
creation** gets a **new key**, even for **identical values**.

> **Retry arrives before processing finishes?** The API can **wait** for the first
> operation to finish or return a **documented response** such as `409 Conflict`.
> It **must not start another creation** for the **same key**.

## What should we save?

|                    | Save the response body                             | Save the resource ID                          |
| ------------------ | -------------------------------------------------- | --------------------------------------------- |
| **Stored field**   | `"response_body": { … }`                           | `"resource_id": 42`                           |
| **Matching retry** | Return the saved body                              | Fetch ticket `42`; build the body             |
| **Tradeoff**       | **Larger record**; preserves the **original body** | **Smaller record**; adds an **entity lookup** |

**Example choice: save the response** so matching retries can replay the
**original result**, even if the entity later changes.

The **scope, key, fingerprint and expiry remain** in the idempotency record.
Only the saved-body part changes.

> **Changed or deleted entity?** Rebuilding from it may change the response or
> make it unavailable.

## Shared idempotency table: example row

One completed row, shown as JSON. The entity (e.g., a ticket) and saved response
**commit together** in this local-transaction example.

```json
{
  "caller_scope": "tenant:example",
  "operation": "create-ticket:v1",
  "idempotency_key": "K1",
  "request_hash": "8f5a6a5c3bf4d2e9dda417dc0f8ae885af9089d0db8df8baf01f7583e08f4478",
  "state": "completed",
  "response_status": 201,
  "response_headers": {
    "Location": "/tickets/42"
  },
  "response_body": {
    "id": 42,
    "title": "Deploy",
    "priority": "HIGH"
  },
  "created_at": "2026-10-23T12:00:00Z",
  "expires_at": "2026-10-24T12:00:00Z"
}
```

> **One storage approach.** A **shared table** can serve **multiple endpoints**.
> Alternatives include **idempotency fields on the created entity** or an
> **operation-specific table**. Choose based on reuse, lifecycle and transaction
> boundaries.

**Caller scope**, **request fingerprint** and **expiry** are covered in
**Backend handling — Spring**.

## Same key, different request data?

| Status                        | API policy                                    |
| ----------------------------- | --------------------------------------------- |
| **422 Unprocessable Content** | Valid syntax, invalid key/payload combination |
| **400 Bad Request**           | Broader client-error policy                   |
| **409 Conflict**              | Conflict with the key's existing association  |

The IETF draft recommends **422 for changed payloads** and **409 while the API is still processing
the first operation**. It is work in progress, not a universal requirement.

## Policies and limits

- **API-specific policies:** failure replay, responses while processing, and
  retention.
- **Limits:** deduplication applies within the **caller/operation scope and
  retention window**. It does **not make external side effects atomic**.

## Sources

- [Stripe: idempotent requests](https://docs.stripe.com/api/idempotent_requests)
- [IETF draft: Idempotency-Key error handling](https://www.ietf.org/archive/id/draft-ietf-httpapi-idempotency-key-header-08.html#section-2.7)
- [AWS: caller intent, request identifiers and atomicity](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/)

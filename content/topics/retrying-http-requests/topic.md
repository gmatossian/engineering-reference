---
id: '2ceccf27-219c-479d-96de-229d4e417e3d'
title: 'Retrying HTTP requests'
summary: 'Decide whether and how to retry from the response and operation semantics.'
iconKey: 'operations'
domains:
  - 'http'
kind: 'decision-aid'
childTopicIds: []
relatedTopicIds: []
---

A status code is a **retry signal**, not the complete decision. Also consider the
operation's semantics and whether another attempt can repeat its effects safely.

## Retry signals

| Classification               | Common codes                                           | Before trying again                                                  |
| ---------------------------- | ------------------------------------------------------ | -------------------------------------------------------------------- |
| Often transient              | `408`, `429`, `502`, `503`, `504`                      | Honor `Retry-After`; use bounded backoff and jitter                  |
| Possibly transient           | `500`                                                  | Retry only when the failure is known or expected to be temporary     |
| Requires a meaningful change | `400`, `401`, `403`, `404`, `405`, `409`, `415`, `422` | Change the request, authentication, authorization, or resource state |
| Redirect rather than retry   | `301`, `302`, `303`, `307`, `308`                      | Follow `Location` according to the redirect semantics                |

## Retry constraints

- Repeat the operation only when it is **idempotent or otherwise protected from
  duplicate effects**.
- Limit attempts and total elapsed time.
- Do not turn every `5xx` into an automatic retry loop.

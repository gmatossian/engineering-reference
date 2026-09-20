---
id: '8dd9f085-233c-4256-a012-717137df5473'
title: 'Choosing HTTP response codes'
summary: 'Match common request outcomes to response codes and required response details.'
iconKey: 'operations'
domains:
  - 'http'
kind: 'decision-aid'
childTopicIds: []
relatedTopicIds: []
---

Choose the code that describes the **result from the client's perspective**.

## Successful outcomes

| Situation                                        | Code             | Key response detail                                          |
| ------------------------------------------------ | ---------------- | ------------------------------------------------------------ |
| Request succeeded                                | `200 OK`         | Return the requested representation or result                |
| Resource created                                 | `201 Created`    | Use `Location` when identifying its URI                      |
| Work accepted but not completed                  | `202 Accepted`   | Explain how its eventual outcome can be checked              |
| Operation succeeded; no representation is needed | `204 No Content` | Common after `DELETE` or an update; send no response content |

`204` is still a response: it contains a status and headers, but **no body**. Use
`200` when returning a representation or result. A successful `DELETE` may use
either—choose `204` only when success itself is all the client needs.

## Request and client conditions

| Situation                                            | Code                         | Key response detail                                     |
| ---------------------------------------------------- | ---------------------------- | ------------------------------------------------------- |
| Invalid request syntax or framing                    | `400 Bad Request`            | Correct the request                                     |
| Authentication is missing or invalid                 | `401 Unauthorized`           | Include `WWW-Authenticate`; authenticate and retry      |
| Server refuses the requested access                  | `403 Forbidden`              | Changing credentials alone might not grant access       |
| Resource was not found or is deliberately hidden     | `404 Not Found`              | Do not reveal a protected resource merely to be precise |
| Method is not supported for this resource            | `405 Method Not Allowed`     | Include `Allow`                                         |
| Request conflicts with current resource state        | `409 Conflict`               | Resolve the conflicting state before retrying           |
| Request uses an unsupported content type             | `415 Unsupported Media Type` | Correct `Content-Type` or the representation            |
| Syntax is valid but instructions cannot be processed | `422 Unprocessable Content`  | Correct the semantic or validation problem              |
| Client has exceeded a rate limit                     | `429 Too Many Requests`      | Use `Retry-After` when the delay is known               |

Despite its name, `401 Unauthorized` is the usual response for **missing or
invalid authentication**. Use `403 Forbidden` when the server understands the
request but refuses to authorize it.

## Server and upstream failures

| Situation                                 | Code                        | Typical interpretation                             |
| ----------------------------------------- | --------------------------- | -------------------------------------------------- |
| Unexpected server failure                 | `500 Internal Server Error` | Cause is unspecified                               |
| Invalid response from an upstream service | `502 Bad Gateway`           | An intermediary's upstream failed                  |
| Temporarily unavailable or overloaded     | `503 Service Unavailable`   | `Retry-After` can state when to try again          |
| Timed out waiting for an upstream service | `504 Gateway Timeout`       | An intermediary's upstream did not respond in time |

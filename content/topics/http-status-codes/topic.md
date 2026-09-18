---
id: 'b97384d3-f986-4850-a6b0-a1c3b893ee86'
title: 'HTTP status codes'
summary: 'Choose common response codes and recognize their headers, redirect behavior, and retry implications.'
iconKey: 'operations'
domains:
  - 'http'
kind: 'operations'
childTopicIds: []
relatedTopicIds: []
---

A status code reports the **outcome of handling one HTTP request**. Use response
headers and the body for details the three-digit code cannot express.

## Status families

| Range | Meaning       | Read it as                                                     |
| ----- | ------------- | -------------------------------------------------------------- |
| `1xx` | Informational | Processing is continuing                                       |
| `2xx` | Successful    | The request was successfully received, understood, and handled |
| `3xx` | Redirection   | Further client action may be needed                            |
| `4xx` | Client error  | The request cannot be fulfilled in its current form or context |
| `5xx` | Server error  | The server failed to fulfill an apparently valid request       |

`4xx` does not necessarily mean malformed input. Authentication, authorization,
resource state, rate limits, and the requested method can also prevent fulfillment.

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

## Redirects

For ordinary browser navigation—including a typical `GET` to a short URL—start
with **`301` for a permanent destination** or **`302` for a temporary or changeable
destination**. The other codes address more specific method behavior.

| Intent                                         | Code                     | Method behavior                               |
| ---------------------------------------------- | ------------------------ | --------------------------------------------- |
| Permanent; historical browser behavior allowed | `301 Moved Permanently`  | A `POST` may become `GET`                     |
| Temporary; historical browser behavior allowed | `302 Found`              | A `POST` may become `GET`                     |
| Show the result at another URI                 | `303 See Other`          | Follow with `GET` or `HEAD`                   |
| Temporary and preserve the method              | `307 Temporary Redirect` | Resend using the same method and request body |
| Permanent and preserve the method              | `308 Permanent Redirect` | Resend using the same method and request body |

These redirects normally identify the destination with **`Location`**. Choose
`307` or `308` when preserving the original method matters.

```http
HTTP/1.1 302 Found
Location: https://example.com/destination
```

Use the same **`Location` response header** with `301`; the status code communicates
whether the destination is permanent or temporary. Add caching headers only when
you need to control how the redirect is cached.

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

## Retryability

| Classification               | Common codes                                           | Before trying again                                                  |
| ---------------------------- | ------------------------------------------------------ | -------------------------------------------------------------------- |
| Often transient              | `408`, `429`, `502`, `503`, `504`                      | Honor `Retry-After`; use bounded backoff and jitter                  |
| Possibly transient           | `500`                                                  | Retry only when the failure is known or expected to be temporary     |
| Requires a meaningful change | `400`, `401`, `403`, `404`, `405`, `409`, `415`, `422` | Change the request, authentication, authorization, or resource state |
| Redirect rather than retry   | `301`, `302`, `303`, `307`, `308`                      | Follow `Location` according to the redirect semantics                |

A retry is safe only when repeating the operation is **idempotent or otherwise
protected from duplicate effects**. Do not turn every `5xx` into an automatic retry
loop.

## Standards

- [HTTP Semantics — RFC 9110](https://www.rfc-editor.org/rfc/rfc9110.html)
- [Additional HTTP Status Codes — RFC 6585](https://www.rfc-editor.org/rfc/rfc6585.html)

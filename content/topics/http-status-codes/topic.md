---
id: 'b97384d3-f986-4850-a6b0-a1c3b893ee86'
title: 'HTTP status codes'
summary: 'Choose common response codes and recognize their headers, redirect behavior, and retry implications.'
iconKey: 'operations'
domains:
  - 'http'
kind: 'operations'
childTopicIds:
  - '8dd9f085-233c-4256-a012-717137df5473'
  - '6fa244ce-5f77-427b-b4a6-4217400d54ed'
  - '2ceccf27-219c-479d-96de-229d4e417e3d'
relatedTopicIds: []
---

A status code reports the **outcome of handling one HTTP request**. Use response
headers and the body for details the three-digit code cannot express.

## Status families

| Range | Meaning       | Read it as                                                      |
| ----- | ------------- | --------------------------------------------------------------- |
| `1xx` | Informational | Processing is continuing                                        |
| `2xx` | Successful    | The request was successfully received, understood, and accepted |
| `3xx` | Redirection   | Further client action may be needed                             |
| `4xx` | Client error  | The request cannot be fulfilled in its current form or context  |
| `5xx` | Server error  | The server failed to fulfill an apparently valid request        |

`4xx` does not necessarily mean malformed input. Authentication, authorization,
resource state, rate limits, and the requested method can also prevent fulfillment.

## Common codes at a glance

| Code  | Typical meaning                         |
| ----- | --------------------------------------- |
| `200` | Request succeeded                       |
| `201` | Resource created                        |
| `202` | Work accepted but not completed         |
| `204` | Success with no response content        |
| `301` | Permanent redirect                      |
| `302` | Temporary redirect                      |
| `303` | Retrieve the result from another URI    |
| `307` | Temporary redirect; preserve the method |
| `308` | Permanent redirect; preserve the method |
| `400` | Invalid request syntax or framing       |
| `401` | Authentication missing or invalid       |
| `403` | Access refused                          |
| `404` | Resource not found or hidden            |
| `405` | Method not supported                    |
| `408` | Request timed out                       |
| `409` | Conflict with current resource state    |
| `415` | Unsupported content type                |
| `422` | Semantically invalid request            |
| `429` | Rate limit exceeded                     |
| `500` | Unspecified server failure              |
| `502` | Invalid upstream response               |
| `503` | Temporarily unavailable                 |
| `504` | Upstream response timed out             |

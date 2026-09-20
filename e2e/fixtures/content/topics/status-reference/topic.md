---
id: '00000000-0000-4000-8000-000000000011'
title: 'Status reference'
summary: 'Dense table fixture for wide and narrow layout tests.'
iconKey: 'operations'
domains:
  - 'http'
kind: 'operations'
childTopicIds: []
relatedTopicIds: []
---

Use the table to verify that dense generated content can exceed the prose measure.

## Success family

| Code | Meaning | Typical use | Cacheable |
| ---- | ------- | ----------- | --------- |
| 200  | OK      | Response    | Yes       |
| 204  | Empty   | Mutation    | No        |

## Client-error family

| Code | Meaning     | Typical use     | Cacheable |
| ---- | ----------- | --------------- | --------- |
| 400  | Bad request | Invalid input   | No        |
| 404  | Not found   | Missing fixture | Sometimes |

## Server-error family

Retry only when the operation and failure mode make doing so safe.

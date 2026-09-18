---
id: '131944ce-d9f9-4053-889d-87f229e38516'
title: 'Creating sets'
summary: 'Choose a set construction based on mutability, duplicate handling, nulls, and ordering.'
iconKey: 'creation'
domains:
  - 'java'
  - 'collections'
kind: 'operations'
childTopicIds: []
relatedTopicIds: []
---

Choose the construction by the required **mutability** and how invalid or repeated
input should be handled.

| Construction             | Modifiable? | Duplicate input | `null`?     |
| ------------------------ | ----------- | --------------- | ----------- |
| `new HashSet<>()`        | Yes         | Ignored         | One allowed |
| `new HashSet<>(source)`  | Yes         | Collapsed       | One allowed |
| `Set.of("Ada", "Grace")` | No          | Rejected        | Rejected    |
| `Set.copyOf(source)`     | No          | Collapsed       | Rejected    |

`Set.of(...)` throws `IllegalArgumentException` for repeated values.
`Set.copyOf(...)` instead keeps one representative of each value from its source.

“Unmodifiable” applies to the set structure. It does **not make mutable elements
immutable**.

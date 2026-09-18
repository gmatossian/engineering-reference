---
id: '080e9bef-0cdf-49a8-b812-2a65ff06d78b'
title: 'Creating lists'
summary: 'Choose a list construction based on mutability, copying, and null handling.'
iconKey: 'creation'
domains:
  - 'java'
  - 'collections'
kind: 'operations'
childTopicIds: []
relatedTopicIds: []
---

Choose the construction by the required **mutability** and whether the result should
be an **independent snapshot**.

| Construction              | Modifiable? | Source-linked? | `null`?  |
| ------------------------- | ----------- | -------------- | -------- |
| `new ArrayList<>()`       | Yes         | No source      | Allowed  |
| `new ArrayList<>(source)` | Yes         | No             | Allowed  |
| `List.of("Ada", "Grace")` | No          | No source      | Rejected |
| `List.copyOf(source)`     | No          | No             | Rejected |

“Unmodifiable” applies to the list structure. It does **not make mutable elements
immutable**.

For array-backed views and array conversions, see **Arrays and lists**.

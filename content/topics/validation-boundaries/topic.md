---
id: '0e57098c-0ac7-4b9a-8123-80d696abaa6a'
title: 'Where validation belongs'
status: 'accepted'
iconKey: 'validation'
domains:
  - 'system-design'
kind: 'decision-aid'
childTopicIds:
  - '31ee0d58-0999-457e-9d7c-5fe20ef9be56'
relatedTopicIds:
  - '64c5e924-a8ca-4aca-837e-d3b84c5ea1a6'
  - '8dd9f085-233c-4256-a012-717137df5473'
---

## Choose who owns the guarantee

![HTTP requests pass through controller and DTO validation; jobs and CLI callers enter the shared application operation directly. The shared operation trims SKU and name before checking, constructs domain values with invariant checks, and checks current application state. Storage enforces uniqueness at the write.](./shared-entry-paths.svg)

Isolation-based checks need **only the supplied values**, including relationships
between fields. State-dependent checks need **application data** and can become
**outdated before a write**.

## Reject early, protect every entry point

> Reject at the **earliest point with enough information**, **before side effects**.

- Enforce guarantees needed by every caller in the **shared operation or domain type**.
- Protect object invariants during **construction and mutation**.
- Use an early uniqueness lookup for **feedback**. Concurrent requests may both
  pass it, so enforce uniqueness **at the write**.

## Normalize consistently

For a contract that trims surrounding whitespace:

```text
" BOOK-001 " → "BOOK-001"
```

Use the **same trimmed value** for **length checks, uniqueness lookup, and storage**.

- Checking raw length can **reject valid padded input**.
- Comparing raw SKUs can **miss a duplicate**.

## When to share validation

| Situation                            | Approach                                 |
| ------------------------------------ | ---------------------------------------- |
| Callers share the **same invariant** | Reuse **one implementation of the rule** |
| Different **operation requirements** | Use **operation-specific validation**    |

Creation may **require a name**; a partial update may **omit it**. Any supplied name
must still satisfy the **shared name rules**.

When the same rule is enforced in several places, **keep the checks consistent**.
For example, the DTO and domain constructor should agree on the SKU length limit.

### Where to put a validation method

| Method location            | Typical fit                                          |
| -------------------------- | ---------------------------------------------------- |
| **Static utility**         | **Supplied values only**; reuse across components    |
| **Injected bean**          | Shared checks need **a repository or configuration** |
| **Private service method** | Reuse **within that service only**                   |

Alternatively, use a **type that validates during construction** to enforce the
rule whenever an instance is created.

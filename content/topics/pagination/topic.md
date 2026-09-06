---
id: '4f4a4da6-3a42-4e60-b3b3-8669ba57cf70'
title: 'Pagination: offset vs cursor'
summary: 'Choose a pagination strategy based on page navigation, dataset size, and behavior while data changes.'
iconKey: 'architecture'
childTopicIds: []
---

## Choose by intent

| Need                                                | Prefer     | Why                                                                 |
| --------------------------------------------------- | ---------- | ------------------------------------------------------------------- |
| Simple pagination or numbered pages                 | **Offset** | Easy to understand and supports jumping to an arbitrary page        |
| Large result sets or deep pagination                | **Cursor** | Continues from an indexed position instead of skipping earlier rows |
| Stable traversal while rows are inserted or deleted | **Cursor** | New changes are less likely to shift the next page                  |
| An exact total and “page 7 of 20”                   | **Offset** | Fits naturally with a separate count query                          |

## Offset pagination

```http
GET /orders?limit=20&offset=40
```

```sql
SELECT *
FROM orders
ORDER BY created_at DESC, id DESC
LIMIT 20 OFFSET 40;
```

- **Simple client contract** and straightforward page-number navigation.
- Deep offsets may become **increasingly expensive** because the database still has
  to find and skip earlier rows.
- Concurrent inserts or deletes can shift positions, causing **duplicates or skipped
  rows** between requests.

## Cursor pagination

```http
GET /orders?limit=20&after=opaque-cursor
```

The cursor commonly represents the final row's ordering values:

```sql
SELECT *
FROM orders
WHERE (created_at, id) < (:createdAt, :id)
ORDER BY created_at DESC, id DESC
LIMIT 20;
```

These examples use PostgreSQL/MySQL-style `LIMIT` and row-value comparison. Other
dialects may require different pagination syntax and an expanded predicate:

```sql
WHERE created_at < :createdAt
   OR (created_at = :createdAt AND id < :id)
```

- Efficient deep traversal when the ordering fields are **properly indexed**.
- More stable as data changes, but it does **not freeze the dataset** or provide a
  snapshot by itself.
- Best for next/previous navigation and infinite scrolling; **arbitrary page jumps**
  are difficult.

## Cursor requirements

- Use a **deterministic order**. Add a unique tie-breaker such as `id` when the main
  value—such as `created_at`—can repeat.
- Treat the cursor as an **opaque API token**. Clients should return it unchanged
  rather than interpret its contents.
- Encode all values needed to resume the ordering and validate malformed or
  incompatible cursors.
- Encoding an offset inside a cursor hides the number but **does not provide keyset
  pagination's performance or stability**.

## Practical default

Start with **offset pagination** for small datasets and interfaces that genuinely need
page numbers. Prefer **cursor pagination** for large, changing feeds or APIs primarily
traversed one page at a time.

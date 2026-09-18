---
id: '6d028a15-f716-4862-80e7-ea5e3b89d946'
title: 'List'
summary: 'Choose and use an ordered, indexed collection that permits repeated elements.'
iconKey: 'list'
domains:
  - 'java'
  - 'collections'
  - 'algorithms-data-structures'
kind: 'concept'
childTopicIds:
  - '080e9bef-0cdf-49a8-b812-2a65ff06d78b'
  - '8df831eb-e81b-450e-9f40-0ec30afaace3'
  - 'd4cb13e7-f0de-48c1-b7ea-5ba1b3708954'
  - 'a2fc39d5-9564-4260-b247-f38d53bedecc'
  - 'fd0a59c5-ab12-4492-b862-05bb9e50e3b9'
  - '5b36622e-a904-4891-a546-93bfe53ea51a'
relatedTopicIds: []
---

A `List<E>` is an **ordered sequence** with **zero-based indexes**. Use one when
position or repetition matters; unlike a set, a list permits **duplicate elements**.

Ordered means that elements have **defined positions**, not that their values are
automatically sorted. Appending preserves insertion sequence, while indexed insertion
and reordering operations can change it.

## Choose an implementation

| Implementation                                 | Structure          | Use when                                              |
| ---------------------------------------------- | ------------------ | ----------------------------------------------------- |
| `ArrayList`                                    | Resizable array    | The **default choice** for most list use              |
| `LinkedList`                                   | Doubly linked list | List and `Deque` behavior are both required           |
| `CopyOnWriteArrayList` or synchronized wrapper | Specialized        | Shared indexed access; see **Concurrent lists** below |

`LinkedList` does **not make arbitrary indexed insertion fast**: finding an index
still requires walking through the list.

## `List` interface operations

| Intent             | Operation           |
| ------------------ | ------------------- |
| Append             | `add(value)`        |
| Read by position   | `get(index)`        |
| Replace            | `set(index, value)` |
| Insert at position | `add(index, value)` |
| Remove by position | `remove(index)`     |
| Find               | `contains(value)`   |

Operations that use an index require `0 <= index < size()`—except insertion, which
also permits `index == size()` to append.

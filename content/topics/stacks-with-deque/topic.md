---
id: 'ee84c285-fd32-4572-8ef6-ef92f421bcca'
title: 'Stacks with Deque'
summary: 'Use a deque as a LIFO stack instead of the legacy Stack class.'
iconKey: 'deque'
domains:
  - 'java'
  - 'collections'
  - 'algorithms-data-structures'
kind: 'pattern'
childTopicIds: []
relatedTopicIds: []
---

A stack removes the **most recently added** element first: last in, first out
(**LIFO**). In modern Java, use a `Deque<E>` with `ArrayDeque` rather than the
legacy `Stack<E>` class.

```java
Deque<String> stack = new ArrayDeque<>();

stack.push("first");
stack.push("second");

String next = stack.pop(); // "second"
```

| Intent  | Stack-style method | Equivalent end-specific method | When empty          |
| ------- | ------------------ | ------------------------------ | ------------------- |
| Add     | `push(e)`          | `addFirst(e)`                  | —                   |
| Examine | `peek()`           | `peekFirst()`                  | Returns `null`      |
| Remove  | `pop()`            | `removeFirst()`                | Throws an exception |

Use `pollFirst()` instead of `pop()` when an empty stack is an **expected
outcome** and should return `null`.

`Stack<E>` is a legacy class built on `Vector<E>`. Prefer the `Deque<E>` interface
so the LIFO intent and implementation choice remain separate.

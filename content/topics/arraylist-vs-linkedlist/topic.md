---
id: '8df831eb-e81b-450e-9f40-0ec30afaace3'
title: 'ArrayList versus LinkedList'
summary: 'Compare positional access, insertion costs, and memory behavior before choosing an implementation.'
iconKey: 'complexity'
domains:
  - 'java'
  - 'collections'
  - 'algorithms-data-structures'
kind: 'decision-aid'
childTopicIds: []
relatedTopicIds: []
---

Prefer `ArrayList` unless the workload demonstrates a reason to choose otherwise.

| Operation                   | `ArrayList`    | `LinkedList` |
| --------------------------- | -------------- | ------------ |
| `get(index)` / `set(index)` | O(1)           | O(n)         |
| Append                      | O(1) amortized | O(1)         |
| Insert/remove by index      | O(n)           | O(n)         |
| Add/remove first            | O(n)           | O(1)         |
| Add/remove last             | O(1) amortized | O(1)         |
| Iterate                     | O(n)           | O(n)         |

`ArrayList` stores references together in a resizable array, normally giving it
**lower memory overhead and better locality**.

`LinkedList` stores a node and two links per element. Its relinking is O(1) only
after the position is already known—for example, through a `ListIterator`. Finding
an arbitrary position remains **O(n)**.

Use `LinkedList` mainly when its `Deque` behavior is also required or measurements
show that already-positioned insertions and removals justify its overhead.

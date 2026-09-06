---
id: 'eb48ad81-c168-48ec-a5ac-602901e5d284'
title: 'Set'
summary: 'Choose and use a collection that represents unique membership rather than position.'
iconKey: 'set'
childTopicIds:
  - '131944ce-d9f9-4053-889d-87f229e38516'
  - 'b4959ddf-3236-4fe7-b6a9-d527281a0f6a'
  - 'e080cdee-eecc-4c33-92d8-3a75acbf5d34'
  - '1cfa160f-9b9b-4f56-855d-74b87a5f76da'
  - 'c3707cd5-08e6-46da-b6ba-49b10459c00b'
---

A `Set<E>` contains **no duplicate elements**. Use one when the question is whether
a value belongs to a group—not where it appears. Sets provide **no indexed access**.

## Choose an implementation

| Implementation                  | Iteration order        | Typical operations | Use when                                                     |
| ------------------------------- | ---------------------- | ------------------ | ------------------------------------------------------------ |
| `HashSet`                       | No guarantee           | O(1) expected      | The **default choice** for membership                        |
| `LinkedHashSet`                 | Insertion order        | O(1) expected      | Traversal order must be predictable                          |
| `TreeSet`                       | Sorted order           | O(log n)           | Sorted traversal or range queries matter                     |
| `EnumSet`                       | Enum declaration order | O(1)               | Every element belongs to one enum type                       |
| `ConcurrentHashMap.newKeySet()` | No guarantee           | O(1) expected      | General concurrent membership; see **Concurrent sets** below |

## Membership operations

| Intent            | Operation         | Result                                       |
| ----------------- | ----------------- | -------------------------------------------- |
| Add if absent     | `add(value)`      | `true` only when the set changed             |
| Test membership   | `contains(value)` | `true` when an equivalent element is present |
| Remove if present | `remove(value)`   | `true` only when the set changed             |

## Operations between collections

Given `left = {1, 2, 3}` and `right = {3, 4}`, these operations mutate `left`:

| Intent                           | Java operation          | `left` afterward |
| -------------------------------- | ----------------------- | ---------------- |
| Include elements from either set | `left.addAll(right)`    | `{1, 2, 3, 4}`   |
| Keep elements present in both    | `left.retainAll(right)` | `{3}`            |
| Remove elements present in right | `left.removeAll(right)` | `{1, 2}`         |

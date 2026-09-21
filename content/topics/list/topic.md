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

## Choose an implementation

| Implementation                                 | Use when                                              |
| ---------------------------------------------- | ----------------------------------------------------- |
| `ArrayList`                                    | The **default choice** for most list use              |
| `LinkedList`                                   | List and `Deque` behavior are both required           |
| `CopyOnWriteArrayList` or synchronized wrapper | Shared indexed access; see **Concurrent lists** below |

`LinkedList` does **not make arbitrary indexed insertion fast**: finding an index
still requires walking through the list.

## See the interface hierarchy and operations

![List interface hierarchy showing common Iterable and Collection operations, indexed operations added by List, and common implementing classes](./list-interface-hierarchy.svg)

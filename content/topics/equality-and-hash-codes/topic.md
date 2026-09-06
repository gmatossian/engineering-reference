---
id: 'e080cdee-eecc-4c33-92d8-3a75acbf5d34'
title: 'Equality and hash codes'
summary: 'Keep hash-based set elements and map keys reliable by preserving equality, hashing, and ordering contracts.'
iconKey: 'equality'
childTopicIds: []
---

`HashSet` elements and `HashMap` keys use `hashCode()` to find a candidate bucket,
then `equals()` to identify an equivalent object.

| Contract                                                | Why it matters                             |
| ------------------------------------------------------- | ------------------------------------------ |
| Equal objects must have the **same hash code**          | Equivalent values must reach the same area |
| Unequal objects may share a hash code                   | `equals()` resolves collisions             |
| Equality-relevant state must remain stable while stored | Lookup and removal must find the same area |

Do **not mutate fields used by `equals()` or `hashCode()`** while an object is a
hash-based set element or map key. Remove it first, make the change, then add it
again.

For a map, these rules apply to its **keys**; values do not determine key lookup.
Records derive `equals()` and `hashCode()` from their components, making them useful
elements or keys when those components remain stable.

## Sorted-collection equivalence

`TreeSet` treats elements as duplicates—and `TreeMap` treats keys as equal—when the
comparator returns `0`. Keep comparator ordering **consistent with `equals()`** so
the collection obeys its normal contract.

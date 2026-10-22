---
id: 'e080cdee-eecc-4c33-92d8-3a75acbf5d34'
title: 'Equality and hash codes'
status: 'accepted'
summary: 'Keep hash-based set elements and map keys reliable by preserving equality, hashing, and ordering contracts.'
iconKey: 'equality'
domains:
  - 'java'
  - 'collections'
kind: 'concept'
childTopicIds: []
relatedTopicIds:
  - '7ddf26ac-1481-4b56-a897-e72a8a881c84'
  - '1cfa160f-9b9b-4f56-855d-74b87a5f76da'
---

## Keys, elements, or values?

| Container                 | `Ticket` is a… | What must remain stable?                                    |
| ------------------------- | -------------- | ----------------------------------------------------------- |
| `HashSet<Ticket>`         | Set element    | Fields used by its `equals()` / `hashCode()`                |
| `HashMap<Ticket, ?>`      | Map key        | Fields used by its `equals()` / `hashCode()`                |
| `HashMap<String, Ticket>` | Map value      | The **String key**; Ticket fields do not control key lookup |

> Do **not mutate equality/hash fields** of a stored key or set element.
> Remove it **before** changing those fields, then reinsert it.

## Replace a map value

```java
record Ticket(String id, String title) {}
Map<String, Ticket> tickets = new HashMap<>();
tickets.put("T1", new Ticket("T1", "Original"));
tickets.put("T1", new Ticket("T1", "Renamed")); // Replaces the value
```

**No remove needed:** the key stays `"T1"`; the replacement Ticket's hash code
is irrelevant to key lookup.

## Equality and hashing contract

`HashSet` elements and `HashMap` keys use `hashCode()` to find a candidate bucket,
then `equals()` to identify an equivalent object.

| Contract                                       | Why it matters                             |
| ---------------------------------------------- | ------------------------------------------ |
| Equal objects must have the **same hash code** | Equivalent values must reach the same area |
| Unequal objects may share a hash code          | `equals()` resolves collisions             |

Records derive `equals()` and `hashCode()` from their components; those components'
equality/hash behavior must remain stable when the record is a key or set element.

## Sorted-collection equivalence

`TreeSet` treats elements as duplicates—and `TreeMap` treats keys as equal—when the
comparator returns `0`. Keep comparator ordering **consistent with `equals()`** so
the collection obeys its normal contract.

## References

- [Java 21 Map: mutable keys and put](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Map.html)
- [Java 21 Set: mutable elements](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Set.html)

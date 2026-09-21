---
id: '7ddf26ac-1481-4b56-a897-e72a8a881c84'
title: 'Sorted and navigable maps'
summary: 'Use ordered map interfaces for key ordering, closest matches, endpoints, and live range views.'
iconKey: 'ordering'
domains:
  - 'java'
  - 'collections'
  - 'algorithms-data-structures'
kind: 'operations'
childTopicIds: []
relatedTopicIds:
  - 'e28eb58c-f60a-43df-99e0-7f51d031f5c4'
  - 'b0b3b8e7-8403-4279-8f03-2e8aa2effa69'
---

![SortedMap and NavigableMap interface responsibilities with TreeMap construction choices](./map-ordering-hierarchy.svg)

> **Need the mapping, not only its key?** The `...Key(...)` methods return a key;
> the corresponding `...Entry(...)` methods return both the key and value.
>
> **Need to consume an endpoint?** `firstEntry()` and `lastEntry()` inspect the
> endpoint mappings. `pollFirstEntry()` and `pollLastEntry()` return and remove
> them in one call.

## Define the key ordering

Natural ordering requires mutually comparable keys, normally through `Comparable`.
Alternatively, provide a `Comparator` when creating the map. The same ordering
controls iteration and all navigation methods below.

## Closest matches

| Method            | Result relative to `key` |
| ----------------- | ------------------------ |
| `lowerKey(key)`   | Greatest key `< key`     |
| `floorKey(key)`   | Greatest key `<= key`    |
| `ceilingKey(key)` | Least key `>= key`       |
| `higherKey(key)`  | Least key `> key`        |

`firstKey()` and `lastKey()` throw `NoSuchElementException` when the map is empty.
The nearest-match methods and `firstEntry()` or `lastEntry()` return `null` when
no matching entry exists.

## Range views

```java
NavigableMap<Integer, String> selected = values.subMap(20, true, 50, false);
```

The result contains keys from **20 inclusive to 50 exclusive**. It is a
**backed view**: changes through the view affect the original map, and accepted new
keys must remain within its range.

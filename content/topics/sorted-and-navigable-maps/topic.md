---
id: '7ddf26ac-1481-4b56-a897-e72a8a881c84'
title: 'Sorted and navigable maps'
summary: 'Use ordered map interfaces for key ordering, closest matches, endpoints, and live range views.'
iconKey: 'ordering'
childTopicIds: []
---

`TreeMap` implements `NavigableMap`, which adds closest-match and range operations
to a map sorted by its keys.

![Map interface hierarchy showing SequencedMap, SortedMap, and NavigableMap with LinkedHashMap and TreeMap implementations](./map-ordering-hierarchy.svg)

## Choose the key ordering

| Required order     | Construction                                              |
| ------------------ | --------------------------------------------------------- |
| Natural, ascending | `new TreeMap<Integer, String>()`                          |
| Custom             | `new TreeMap<Integer, String>(Comparator.reverseOrder())` |

Natural ordering requires mutually comparable keys, normally through `Comparable`.
Alternatively, provide a `Comparator` when creating the map. The same ordering
controls iteration and all navigation methods below.

## Find the nearest key

Given stored keys `10`, `20`, and `30`, navigation methods find the nearest key
before or after the requested value:

| Method       | Search for `20` | Search for `25` | Meaning                        |
| ------------ | --------------- | --------------- | ------------------------------ |
| `lowerKey`   | `10`            | `20`            | Nearest key **strictly below** |
| `floorKey`   | `20`            | `20`            | Nearest key **at or below**    |
| `ceilingKey` | `20`            | `30`            | Nearest key **at or above**    |
| `higherKey`  | `30`            | `30`            | Nearest key **strictly above** |

Use the corresponding `lowerEntry`, `floorEntry`, `ceilingEntry`, or
`higherEntry` method when the key and value are both needed. These methods return
`null` when no matching key exists.

`firstEntry()` and `lastEntry()` return the endpoint mappings. `pollFirstEntry()`
and `pollLastEntry()` return and **remove** them, or return `null` when empty.

## Range views

```java
NavigableMap<Integer, String> selected = values.subMap(20, true, 50, false);
```

The result contains keys from **20 inclusive to 50 exclusive**. It is a
**backed view**: changes through the view affect the original map, and accepted new
keys must remain within its range.

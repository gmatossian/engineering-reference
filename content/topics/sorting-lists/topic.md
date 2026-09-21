---
id: 'fd0a59c5-ab12-4492-b862-05bb9e50e3b9'
title: 'Sorting lists'
summary: 'Sort a modifiable list by natural, reverse, or property-based order.'
iconKey: 'ordering'
domains:
  - 'java'
  - 'collections'
kind: 'operations'
childTopicIds: []
relatedTopicIds: []
---

`list.sort(...)` rearranges the **existing list** and requires the list to support
replacement.

```java
List<String> names = new ArrayList<>(List.of("Zoe", "Ana", "Mia"));
names.sort(null);
// names is now [Ana, Mia, Zoe]
```

| Required order         | Operation                                             |
| ---------------------- | ----------------------------------------------------- |
| Natural                | `values.sort(null)`                                   |
| Reverse natural        | `values.sort(Comparator.reverseOrder())`              |
| By one property        | `people.sort(Comparator.comparing(Person::lastName))` |
| By multiple properties | Chain comparators with `thenComparing(...)`           |

Natural ordering requires elements that are **mutually comparable**. A supplied
`Comparator` defines the order otherwise.

```java
people.sort(
    Comparator.comparing(Person::lastName)
        .thenComparing(Person::firstName)
);
```

The sort is **stable**: elements that compare as equal retain their relative order.
Use a mutable copy before sorting an unmodifiable list:

```java
List<Person> sorted = new ArrayList<>(people);
sorted.sort(Comparator.comparing(Person::lastName));
```

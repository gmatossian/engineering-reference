---
id: 'fd0a59c5-ab12-4492-b862-05bb9e50e3b9'
title: 'Sorting lists'
status: 'accepted'
summary: 'Sort a modifiable list by natural, reverse, or property-based order.'
iconKey: 'ordering'
domains:
  - 'java'
  - 'collections'
kind: 'operations'
childTopicIds: []
relatedTopicIds:
  - 'b0b3b8e7-8403-4279-8f03-2e8aa2effa69'
---

`list.sort(...)` rearranges the **existing list** and requires the list to support
replacement.

```java
List<String> names = new ArrayList<>(List.of("Zoe", "Ana", "Mia"));
names.sort(null);
// names is now [Ana, Mia, Zoe]
```

| Required order            | Operation                                             |
| ------------------------- | ----------------------------------------------------- |
| Natural                   | `values.sort(null)`                                   |
| Case-insensitive strings  | `names.sort(String.CASE_INSENSITIVE_ORDER)`           |
| Reverse natural           | `values.sort(Comparator.reverseOrder())`              |
| By one property           | `people.sort(Comparator.comparing(Person::lastName))` |
| Case-insensitive property | Supply the key comparator to `comparing(...)`         |
| By multiple properties    | Chain comparators with `thenComparing(...)`           |

Natural ordering requires elements that are **mutually comparable**. A supplied
`Comparator` defines the order otherwise.

```java
people.sort(
    Comparator.comparing(Person::lastName, String.CASE_INSENSITIVE_ORDER)
        .thenComparing(Person::firstName, String.CASE_INSENSITIVE_ORDER)
);
```

`comparing(keyExtractor, keyComparator)` chooses both the property and how to
order it. Case-insensitive comparison can tie differently cased strings; chain a
domain-specific comparison when those values need a secondary order.

The sort is **stable**: elements that compare as equal retain their relative order.
Use a mutable copy before sorting an unmodifiable list:

```java
List<Person> sorted = new ArrayList<>(people);
sorted.sort(Comparator.comparing(Person::lastName));
```

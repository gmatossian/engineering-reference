---
id: 'd4cb13e7-f0de-48c1-b7ea-5ba1b3708954'
title: 'List operations and traps'
summary: 'Use search, removal, views, and iteration without common overload and backing-list mistakes.'
iconKey: 'operations'
domains:
  - 'java'
  - 'collections'
kind: 'operations'
childTopicIds: []
relatedTopicIds: []
---

## Search and bulk changes

| Intent                   | Operation              |
| ------------------------ | ---------------------- |
| Find first position      | `indexOf(value)`       |
| Find last position       | `lastIndexOf(value)`   |
| Remove matching elements | `removeIf(predicate)`  |
| Transform every element  | `replaceAll(operator)` |

Search operations normally perform a **linear scan** and compare elements using
`equals`.

## Removing an integer

For `List<Integer>`, the argument type selects two different overloads:

```java
numbers.remove(1);                  // removes the element at index 1
numbers.remove(Integer.valueOf(1)); // removes the first value equal to 1
```

## `subList` is a view

```java
List<String> middle = names.subList(fromInclusive, toExclusive);
```

Changes through the view affect the original list. Avoid structurally changing the
backing list directly while using the view.

## Remove safely while iterating

```java
for (Iterator<String> iterator = names.iterator(); iterator.hasNext(); ) {
    if (shouldRemove(iterator.next())) {
        iterator.remove();
    }
}
```

Use the iterator's own `remove()` operation rather than modifying the list directly
during iteration.

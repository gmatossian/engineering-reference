---
id: 'a2fc39d5-9564-4260-b247-f38d53bedecc'
title: 'Arrays and lists'
summary: 'Convert between arrays and lists without overlooking mutability or primitive boxing.'
iconKey: 'conversion'
domains:
  - 'java'
  - 'collections'
kind: 'operations'
childTopicIds: []
relatedTopicIds: []
---

Choose a conversion based on the **array element type** and the required
**mutability**.

## Array → list

| Construction                                              | Result                  | `set`? | `add`/`remove`? | Source-linked? | `null`?        |
| --------------------------------------------------------- | ----------------------- | ------ | --------------- | -------------- | -------------- |
| `Arrays.asList(names)`                                    | Fixed-size view         | Yes    | No              | Yes            | Allowed        |
| `new ArrayList<>(Arrays.asList(names))`                   | Mutable copy            | Yes    | Yes             | No             | Allowed        |
| `List.copyOf(Arrays.asList(names))`                       | Unmodifiable snapshot   | No     | No              | No             | Rejected       |
| `Arrays.stream(values).boxed().toList()`                  | Unmodifiable boxed list | No     | No              | No             | Not applicable |
| `new ArrayList<>(Arrays.stream(values).boxed().toList())` | Mutable boxed copy      | Yes    | Yes             | No             | Not applicable |

## List → reference array

```java
String[] names = list.toArray(String[]::new);
```

## Primitive-array details

- `boxed()` converts each `int` to an `Integer`.
- `Arrays.asList(values)` is a trap: it produces a **one-element `List<int[]>`**, not
  a `List<Integer>`.

## Boxed list → primitive array

```java
List<Integer> numbers = List.of(1, 2, 3);
int[] values = numbers.stream().mapToInt(Integer::intValue).toArray();
```

Any **`null` element** causes a `NullPointerException` during unboxing.

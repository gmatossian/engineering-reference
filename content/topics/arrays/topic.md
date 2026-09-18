---
id: '2fe75411-92f0-4e6f-bfd0-1756dc08ebe2'
title: 'Arrays'
summary: 'Initialize fixed-length Java arrays according to what is known at creation time.'
iconKey: 'array'
domains:
  - 'java'
  - 'algorithms-data-structures'
kind: 'concept'
childTopicIds:
  - 'df423741-8ff2-44ab-a770-32f8e76846b8'
  - 'a2fc39d5-9564-4260-b247-f38d53bedecc'
relatedTopicIds: []
---

Java arrays are **mutable** containers with a **fixed length**. Choose the
initialization form that matches what is known when the array is created.

## Values known now

```java
int[] scores = {90, 82, 95};
```

## Declare now, assign later

```java
int[] scores;

scores = new int[] {90, 82, 95};
```

A later assignment requires **explicit array creation** (`new int[]`). The shorter
`{90, 82, 95}` form is **only valid in a declaration**.

## Length known, values not yet known

```java
int[] counts = new int[10];
boolean[] flags = new boolean[4];
String[] names = new String[3];
```

Every element starts with its **default value**: `0`, `false`, or `null` in these
examples.

## Length known only at runtime

```java
int[] counts = new int[itemCount];
```

## Repeated non-default value

```java
int[] priorities = new int[10];
Arrays.fill(priorities, -1);
```

`Arrays.fill` changes the **existing array**; it does not create another one.

## Length is not logical size

- `array.length` is the **fixed number of positions**.
- An array **does not track** how many positions the application considers occupied.

## Arrays are mutable

```java
final int[] scores = {90, 82, 95};
scores[0] = 100; // allowed
```

- `final` prevents the variable from referring to another array.
- Array elements **can still change**.
- Java has **no immutable array type**; use defensive copies when ownership must not
  be shared.

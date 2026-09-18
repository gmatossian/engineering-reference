---
id: 'df423741-8ff2-44ab-a770-32f8e76846b8'
title: 'Copying arrays'
summary: 'Choose between Arrays.copyOf, Arrays.copyOfRange, and System.arraycopy.'
iconKey: 'copy'
domains:
  - 'java'
kind: 'operations'
childTopicIds: []
relatedTopicIds: []
---

## Whole array

```java
int[] copy = Arrays.copyOf(source, source.length);
```

Result: a **separate array** containing the **same values**.

## Resize while copying

```java
int[] larger = Arrays.copyOf(source, source.length * 2);
```

- Larger length: extra positions receive **default values**.
- Smaller length: **trailing values are discarded**.

## Range

```java
int[] middle = Arrays.copyOfRange(source, 2, 5);
```

Range: `[from, to)` — start **inclusive**, end **exclusive**.

## Existing destination

```java
System.arraycopy(source, 1, destination, 3, 4);
```

- Reads **four elements** beginning at `source[1]`.
- Writes them beginning at `destination[3]`.
- When moving elements within one array, **overlapping ranges are safe**.

## Reference arrays: shallow copy

```java
Person[] copy = Arrays.copyOf(people, people.length);
```

- The array container is **independent**.
- Element objects remain **shared**.

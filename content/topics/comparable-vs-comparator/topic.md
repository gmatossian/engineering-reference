---
id: 'b0b3b8e7-8403-4279-8f03-2e8aa2effa69'
title: 'Comparable vs Comparator'
summary: 'Choose natural or task-specific Java ordering, and recover the essential syntax and traps.'
iconKey: 'ordering'
domains:
  - 'java'
  - 'collections'
kind: 'decision-aid'
childTopicIds: []
relatedTopicIds:
  - 'fd0a59c5-ab12-4492-b862-05bb9e50e3b9'
  - 'e28eb58c-f60a-43df-99e0-7f51d031f5c4'
  - '1cfa160f-9b9b-4f56-855d-74b87a5f76da'
  - '7ddf26ac-1481-4b56-a897-e72a8a881c84'
---

| Choose          | Use when                                     | Method               |
| --------------- | -------------------------------------------- | -------------------- |
| `Comparable<T>` | The type has a **natural order**             | `compareTo(T other)` |
| `Comparator<T>` | You need an **alternate, task-specific** one | `compare(T a, T b)`  |

Both methods return **negative / zero / positive** when the first value comes
before / ties / comes after the second. A supplied comparator can override a
type's natural order for one operation.

## Define a natural order

```java
record Version(int major, int minor) implements Comparable<Version> {
    @Override
    public int compareTo(Version other) {
        int byMajor = Integer.compare(major, other.major);
        return byMajor != 0 ? byMajor : Integer.compare(minor, other.minor);
    }
}
```

## Supply an alternate order

```java
record Job(String owner, int priority) {}

Comparator<Job> byOwner = Comparator.comparing(Job::owner);
Comparator<Job> byPriorityThenOwner =
    Comparator.comparingInt(Job::priority)
        .reversed()
        .thenComparing(Job::owner);

List<Job> jobs = new ArrayList<>(List.of(new Job("Ada", 2), new Job("Bea", 3)));
jobs.sort(byPriorityThenOwner);
// Bea (3), then Ada (2)
```

`comparing(...)` extracts an object key; `comparingInt(...)` extracts a primitive
`int` key. `thenComparing(...)` runs only when the preceding comparison ties.

## No comparator at the call site

| Call                                                | Ordering source                             |
| --------------------------------------------------- | ------------------------------------------- |
| `Arrays.sort(numbers)` with `int[] numbers`         | Built-in numeric order for primitive `int`s |
| `Collections.sort(names)` with `List<String> names` | `String` implements `Comparable<String>`    |
| `names.stream().sorted()`                           | The same `String` natural order             |

Object sorting without an explicit comparator still needs mutually comparable
elements. Primitive-array sorting does not use `Comparable`.

> In a `TreeSet` or `TreeMap`, comparison returning **0** means the same element
> or key. For example, ordering jobs only by `owner` makes distinct jobs with
> the same owner collide, even if their `equals()` results differ.

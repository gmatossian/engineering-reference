---
id: '45d1ae48-9ecf-4186-8df2-2e199ebcb4b4'
title: 'Operations and collectors'
summary: 'Choose common stream transformations, terminal operations, and collectors by the result you need.'
iconKey: 'collection'
domains:
  - 'java'
kind: 'operations'
childTopicIds: []
relatedTopicIds: []
---

## Intermediate operations

| Need                         | Operation                 |
| ---------------------------- | ------------------------- |
| Keep matching elements       | `filter(predicate)`       |
| Transform each element       | `map(function)`           |
| Transform into many elements | `flatMap(streamFunction)` |
| Remove repeated values       | `distinct()`              |
| Sort the elements            | `sorted(comparator)`      |
| Keep only part of the stream | `limit(n)`, `skip(n)`     |

`flatMap` is useful when every input contains another sequence:

```java
List<String> tags = articles.stream()
    .flatMap(article -> article.tags().stream())
    .distinct()
    .sorted()
    .toList();
```

## Terminal operations

| Need                        | Operation                           |
| --------------------------- | ----------------------------------- |
| Create an unmodifiable list | `toList()`                          |
| Count elements              | `count()`                           |
| Find one element            | `findFirst()`, `findAny()`          |
| Test a condition            | `anyMatch`, `allMatch`, `noneMatch` |
| Combine values              | `reduce(...)`                       |
| Perform an action           | `forEach(...)`                      |

Use a primitive stream for numeric aggregation without boxed values:

```java
int totalQuantity = orders.stream()
    .mapToInt(Order::quantity)
    .sum();
```

## Collect into maps and groups

```java
Map<Department, List<Employee>> byDepartment = employees.stream()
    .collect(Collectors.groupingBy(Employee::department));

Map<Boolean, List<Order>> byPaid = orders.stream()
    .collect(Collectors.partitioningBy(Order::isPaid));

Map<Long, User> byId = users.stream()
    .collect(Collectors.toMap(User::id, Function.identity()));
```

The two-argument `toMap` throws `IllegalStateException` when keys repeat. Use its
merge-function overload when duplicate keys are possible and define which value wins.

Use `Collectors.toCollection(ArrayList::new)` when the result specifically needs a
modifiable `ArrayList`.

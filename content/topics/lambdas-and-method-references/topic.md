---
id: '4ca7a180-254f-46f3-9999-4f70f41957eb'
title: 'Lambdas and method references'
summary: 'Represent one-method behavior with lambda expressions and concise references to existing methods.'
iconKey: 'operations'
domains:
  - 'java'
kind: 'operations'
childTopicIds: []
relatedTopicIds: []
---

## Why `WorkItem::priority` works

```java
record WorkItem(String name, int priority) {}

Comparator<WorkItem> byPriority = Comparator.comparingInt(WorkItem::priority);
Comparator<WorkItem> sameOrder = Comparator.comparingInt(item -> item.priority());
```

`WorkItem::priority` is an **unbound instance-method reference**, not a static
call. `Comparator.comparingInt(...)` needs a `WorkItem → int` extractor
(`ToIntFunction<WorkItem>`); each `WorkItem` passed to it becomes the receiver
of `priority()`.

## Read a method reference as a lambda

- **Static — `Type::staticMethod`:** `Integer::parseInt` →
  `text -> Integer.parseInt(text)`
- **Unbound instance — `Type::instanceMethod`:** `WorkItem::priority` →
  `item -> item.priority()`; the argument supplies the receiver.
- **Bound instance — `instance::method`:** `System.out::println` →
  `text -> System.out.println(text)`; the receiver is fixed.
- **Constructor — `Type::new`:** `ArrayList::new` →
  `() -> new ArrayList<>()`

The API's expected functional interface supplies the parameter and return types
for either form. For example, `System.out::println` can target a
`Consumer<String>`, and `ArrayList::new` can target a
`Supplier<ArrayList<String>>`.

## Match the target interface

| Interface          | Input → output | Call                |
| ------------------ | -------------- | ------------------- |
| `Predicate<T>`     | `T → boolean`  | `test(value)`       |
| `Function<T, R>`   | `T → R`        | `apply(value)`      |
| `Consumer<T>`      | `T → void`     | `accept(value)`     |
| `Supplier<T>`      | `() → T`       | `get()`             |
| `ToIntFunction<T>` | `T → int`      | `applyAsInt(value)` |

## Lambda syntax and capture

```java
Predicate<String> nonBlank = value -> !value.isBlank();
Consumer<String> print = value -> { System.out.println(value); };
```

An expression lambda uses one expression; a block lambda uses statements and
needs `return` when its target produces a value. Captured local
variables must be `final` or **effectively final** (not reassigned). The target
interface also determines allowed parameter types, return type, and checked
exceptions.

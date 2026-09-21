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

## Read a method reference as a lambda

**Static method**

`Integer::parseInt` → `text -> Integer.parseInt(text)`

**Instance method · object supplied**

`String::length` → `text -> text.length()`

The method runs on the object passed in (`text`), not on `String` itself.

**Instance method · object fixed**

`System.out::println` → `text -> System.out.println(text)`

**Constructor**

`ArrayList::new` → `() -> new ArrayList<>()`

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

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

Java 8 added lambda expressions and method references. A lambda receives its type
from a **functional interface**—an interface with one abstract method.

```java
Predicate<String> nonBlank = value -> !value.isBlank();
```

| Form              | Example                              | Use when                           |
| ----------------- | ------------------------------------ | ---------------------------------- |
| Expression lambda | `value -> value.trim()`              | One expression produces the result |
| Block lambda      | `value -> { log(value); }`           | The behavior needs statements      |
| Method reference  | `names.forEach(System.out::println)` | An existing method already matches |

A lambda may capture local variables only when they are `final` or **effectively
final**: assigned once and never reassigned.

The same lambda syntax can target different functional-interface types. The target
type determines the parameter types, return requirement, and checked exceptions.

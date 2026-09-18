---
id: '5e30bfec-47fe-46bf-b777-88cd055cd27b'
title: 'Pattern matching'
summary: 'Test a value’s type, bind the matched value, and branch exhaustively without repeated casts.'
iconKey: 'operations'
domains:
  - 'java'
kind: 'operations'
childTopicIds: []
relatedTopicIds: []
---

Java 16 finalized pattern matching for `instanceof`, combining the type test and cast:

```java
if (value instanceof String text) {
    return text.length();
}
```

The pattern variable exists only where the match is known to have succeeded.

Java 21 extended pattern matching to `switch`:

```java
String describe(Object value) {
    return switch (value) {
        case null -> "missing";
        case String text -> "text: " + text;
        case Integer number -> "number: " + number;
        default -> "other";
    };
}
```

Cases must be ordered from more specific to more general; a broad earlier pattern
cannot dominate a later case. Handle `null` explicitly when it is valid input—an
ordinary `default` does not make a null selector safe.

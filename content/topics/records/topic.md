---
id: '9e290750-ab85-4acb-bca2-88d7ad758cd7'
title: 'Records'
summary: 'Declare transparent data carriers with generated accessors, value equality, and concise construction.'
iconKey: 'creation'
domains:
  - 'java'
kind: 'operations'
childTopicIds: []
relatedTopicIds:
  - 'e080cdee-eecc-4c33-92d8-3a75acbf5d34'
---

Java 16 finalized records for classes whose meaning is primarily their data.

```java
record Coordinate(int x, int y) {}
```

The declaration supplies:

- final component fields;
- accessors named `x()` and `y()`;
- a canonical constructor; and
- value-based `equals`, `hashCode`, and `toString` implementations.

Use a compact constructor to validate or normalize components:

```java
record EmailAddress(String value) {
    EmailAddress {
        Objects.requireNonNull(value);
    }
}
```

A record is **shallowly immutable**. Its component references cannot be reassigned,
but a referenced mutable object can still change.

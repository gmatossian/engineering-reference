---
id: '9e290750-ab85-4acb-bca2-88d7ad758cd7'
title: 'Records'
status: 'accepted'
summary: 'Declare transparent data carriers with generated accessors, value equality, and concise construction.'
iconKey: 'creation'
domains:
  - 'java'
kind: 'operations'
childTopicIds: []
relatedTopicIds:
  - 'e080cdee-eecc-4c33-92d8-3a75acbf5d34'
---

## Components define the record

```java
public record Coordinate(int x, int y) {}
```

`x` and `y` are **record components**: the named values declared in the record
header. Together, the components define the record's complete instance state and
drive its generated API.

| Supplied from the header | Result                                            |
| ------------------------ | ------------------------------------------------- |
| Component storage        | Private final fields `x` and `y`                  |
| Access                   | Public accessors `x()` and `y()`                  |
| Construction             | `new Coordinate(x, y)` canonical constructor      |
| Equality and hashing     | `equals(...)` and `hashCode()` use all components |
| Text form                | `toString()` includes component names and values  |
| Type shape               | A final class extending `java.lang.Record`        |

## Should this be a record?

| Use a record when                            | Prefer a class when                                    |
| -------------------------------------------- | ------------------------------------------------------ |
| Components are the **complete state**        | It needs hidden or additional state                    |
| **All-component equality** is correct        | Identity exists independently of values                |
| Declared state needs no later reassignment   | Declared state must be reassigned during its lifecycle |
| `final` with no application superclass works | It needs inheritance, proxies, or JavaBean mutation    |

**Common fits:** value objects, map keys, method results, request data, and
configuration values.

## Validate and protect components

A compact canonical constructor can reject or normalize its parameters. The
compiler assigns the final component fields after the constructor body:

```java
public record User(String name, List<String> roles) {
    public User {
        name = Objects.requireNonNull(name);
        roles = List.copyOf(roles);
    }
}
```

`List.copyOf(...)` matters when the record should expose immutable value semantics.
Without it, callers could still mutate the referenced list.

## Add behavior or alternative construction

Records may contain ordinary instance and static methods. An additional constructor
must delegate to the canonical constructor:

```java
public record Range(int start, int end) {
    public Range {
        if (start > end) {
            throw new IllegalArgumentException("start must not exceed end");
        }
    }

    public Range(int end) {
        this(0, end);
    }

    public int length() {
        return end - start;
    }
}
```

| Allowed                            | Not allowed           |
| ---------------------------------- | --------------------- |
| Instance/static methods            | Extra instance fields |
| Static fields/nested types         | Instance initializers |
| Implement interfaces               | Extend another class  |
| Extra constructors via `this(...)` | Subclass a record     |

You may explicitly declare component accessors, `equals`, `hashCode`, or `toString`,
but their replacements should preserve the record's transparent value meaning.

## Traps

- A record is **shallowly immutable**. A final component reference may still point
  to a mutable object.
- Avoid records with mutable components as `HashMap` keys or `HashSet` elements.
  Changing a component's contents can change the record's `hashCode()`, so the
  collection may no longer find it.
- Array components use the array's normal identity-based `equals` and `hashCode`;
  prefer a value-based collection or provide deliberate custom behavior.
- Generated `toString()` exposes component names and values; do not assume sensitive
  components will stay out of logs.
- Accessors are named after their components, such as `name()`, not `getName()`;
  check frameworks that require JavaBean accessors, mutable properties, proxies, or
  no-argument construction.

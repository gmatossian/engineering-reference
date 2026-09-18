---
id: 'b1e43b80-78cb-48cb-91da-92a562933891'
title: 'Text blocks'
summary: 'Write multiline strings without escaping every quote or line break.'
iconKey: 'java'
domains:
  - 'java'
kind: 'operations'
childTopicIds: []
relatedTopicIds: []
---

Java 15 finalized text blocks. They produce ordinary `String` values while preserving
readable multiline source.

```java
String json = """
    {
      "name": "Ada",
      "active": true
    }
    """;
```

Common incidental indentation is removed based on the closing delimiter and the
content lines. Move the closing delimiter deliberately when whitespace matters.

Text blocks do **not interpolate variables**. Use `formatted(...)` when values must
be inserted:

```java
String message = """
    Hello, %s
    """.formatted(name);
```

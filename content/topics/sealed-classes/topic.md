---
id: '97341609-b898-4072-8f4f-2823fc366ce1'
title: 'Sealed classes'
summary: 'Define a closed set of permitted direct subtypes for a class or interface hierarchy.'
iconKey: 'architecture'
childTopicIds: []
---

Java 17 finalized sealed classes and interfaces. Use them when a hierarchy should be
extensible only through a **known set of direct subtypes**.

```java
sealed interface Result permits Success, Failure {}

record Success(String value) implements Result {}
record Failure(String message) implements Result {}
```

Every permitted direct subtype must declare how the hierarchy continues:

| Modifier     | Meaning                                        |
| ------------ | ---------------------------------------------- |
| `final`      | No further subclasses                          |
| `sealed`     | Only another declared set may extend it        |
| `non-sealed` | Reopens that branch for unrestricted extension |

Records are implicitly `final`, so the two record declarations above satisfy the
rule automatically. A sealed hierarchy also helps the compiler check exhaustive
pattern-matching switches.

---
id: 'dad2f45c-44a0-4667-be7f-4eeda8bafdfe'
title: 'Switch expressions'
summary: 'Return a value from switch using exhaustive arrow cases without accidental fall-through.'
iconKey: 'operations'
domains:
  - 'java'
kind: 'operations'
childTopicIds: []
relatedTopicIds: []
---

Java 14 finalized `switch` expressions. Arrow cases do **not fall through**, and an
expression must cover every possible input.

```java
int fee = switch (tier) {
    case BASIC -> 0;
    case PRO -> 20;
    case ENTERPRISE -> 100;
};
```

Use `yield` when a case needs a block before producing its value:

```java
int fee = switch (tier) {
    case BASIC -> 0;
    default -> {
        audit(tier);
        yield 20;
    }
};
```

For an enum, covering every declared constant makes the expression exhaustive
without a `default`. Omitting `default` can be useful because adding a new enum
constant then creates a compile-time failure at the switch.

---
id: 'f9ff7ed9-ecd3-432c-b2e6-5ae1e323f3b0'
title: 'Streams vs loops'
summary: 'Choose declarative pipelines for transformations and explicit loops for control flow or coordinated mutation.'
iconKey: 'conversion'
domains:
  - 'java'
kind: 'decision-aid'
childTopicIds: []
relatedTopicIds: []
---

Neither form is universally better. Choose the one that makes the operation's intent
and control flow easier to see.

| Shape of the work                              | Usually clearer |
| ---------------------------------------------- | --------------- |
| Filter, transform, group, or aggregate values  | Stream          |
| `break`, `continue`, or early method return    | Loop            |
| Several coordinated mutations                  | Loop            |
| A reusable sequence of stateless operations    | Stream          |
| Step-by-step debugging of complex control flow | Loop            |

## The same transformation

With a loop:

```java
List<String> activeNames = new ArrayList<>();
for (User user : users) {
    if (user.active()) {
        activeNames.add(user.name());
    }
}
activeNames.sort(Comparator.naturalOrder());
```

With a stream:

```java
List<String> activeNames = users.stream()
    .filter(User::active)
    .map(User::name)
    .sorted()
    .toList();
```

The stream emphasizes **what result is produced**. The loop exposes **each control
and mutation step**. Prefer clarity for the actual task rather than converting
between them mechanically.

A sequential stream is not inherently faster than a loop. Use measurements when
performance determines the choice.

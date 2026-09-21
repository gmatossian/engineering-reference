---
id: '5b36622e-a904-4891-a546-93bfe53ea51a'
title: 'Concurrent lists'
summary: 'Choose between copy-on-write reads and synchronized access when a list is shared across threads.'
iconKey: 'concurrency'
domains:
  - 'java'
  - 'collections'
  - 'concurrency'
kind: 'decision-aid'
childTopicIds: []
relatedTopicIds: []
---

Choose a concurrent list only when the program genuinely requires **shared indexed
access across threads**.

## Reads dominate; writes are rare

```java
List<Listener> listeners = new CopyOnWriteArrayList<>();
```

Each mutation creates a **new array**, so frequent writes are expensive. An iterator
sees a **snapshot** from when it was created and does not reflect later changes.

## Reads and writes are more balanced

```java
List<String> names = Collections.synchronizedList(new ArrayList<>());

synchronized (names) {
    for (String name : names) {
        use(name);
    }
}
```

Individual operations are synchronized, but compound actions and traversal still
require synchronization around the complete sequence.

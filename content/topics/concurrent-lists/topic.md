---
id: '5b36622e-a904-4891-a546-93bfe53ea51a'
title: 'Concurrent lists'
status: 'accepted'
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

Choose a concurrent list when threads genuinely need to share a **list's order or
indexed access**.

## `CopyOnWriteArrayList` — reads dominate, writes are rare

```java
List<Listener> listeners = new CopyOnWriteArrayList<>();
listeners.add(listener);
```

Each mutation creates a **new array**, so frequent writes are expensive. An iterator
sees a **snapshot** from when it was created and does not reflect later changes.

## `Collections.synchronizedList(...)` — one lock for access

```java
List<String> names = Collections.synchronizedList(new ArrayList<>());
names.add(name);

synchronized (names) {
    for (String name : names) {
        use(name);
    }
}
```

- **`names.add(name)`:** one call; the wrapper synchronizes it.
- **The `for` loop:** `synchronized (names)` protects the whole iteration. Use the
  same pattern for related calls that must act together.

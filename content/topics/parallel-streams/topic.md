---
id: '57cd79fd-a949-4942-b6bf-34aba40ad7cd'
title: 'Parallel streams'
summary: 'Use data parallelism only for measured workloads that split well and avoid ordering or shared-state costs.'
iconKey: 'concurrency'
domains:
  - 'java'
  - 'concurrency'
kind: 'concept'
childTopicIds: []
relatedTopicIds: []
---

A parallel stream partitions its source, processes partitions concurrently, and
combines their results.

```java
long total = orders.parallelStream()
    .mapToLong(Order::amountInCents)
    .sum();
```

| Better candidate                         | Poor candidate                           |
| ---------------------------------------- | ---------------------------------------- |
| Large, easily split source               | Small source or cheap operation          |
| CPU-bound work per element               | Blocking I/O                             |
| Stateless operations                     | Shared mutable state                     |
| Associative reduction                    | Order-dependent or non-associative logic |
| A benchmark shows meaningful improvement | Performance is merely assumed            |

Parallel execution does **not guarantee which thread processes an element or in what
order functions run**. `forEachOrdered(...)` preserves encounter order for its
effect, but that coordination can reduce the benefit of parallelism.

Parallel streams normally share the JVM's common fork/join pool rather than owning a
dedicated executor. Avoid introducing blocking work or unpredictable contention into
that shared resource.

Changing `stream()` to `parallelStream()` is not a free optimization. Confirm that
the result remains correct, then measure it with representative data and workload.

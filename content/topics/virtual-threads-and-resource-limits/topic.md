---
id: '30e2c64a-8978-447e-bde6-022686cefe8d'
title: 'Virtual threads and resource limits'
summary: 'Use a virtual thread per blocking task while limiting scarce downstream resources separately.'
iconKey: 'concurrency'
domains:
  - 'java'
  - 'concurrency'
kind: 'decision-aid'
childTopicIds: []
relatedTopicIds:
  - '84239686-a565-4af2-ad78-b2c9eee61ea9'
---

Virtual threads are final in **Java 21**. They support large numbers of tasks that
spend much of their time **blocked on I/O**. Create one per task; do **not pool
virtual threads**.

```java
try (ExecutorService executor = Executors.newVirtualThreadPerTaskExecutor()) {
    Future<Response> response = executor.submit(() -> client.fetch());
    use(response.get());
}
```

Virtual threads improve the scalability of blocking code. They do **not** make
CPU-bound work faster and do not increase the capacity of a database or downstream
service.

## Limit the real resource

Use a semaphore when only a fixed number of tasks may access a constrained resource:

```java
Semaphore permits = new Semaphore(20);

permits.acquire();
try {
    callDownstream();
} finally {
    permits.release();
}
```

Always release a permit in `finally`. Prefer the resource's own bounded pool when it
already represents the true capacity, such as a database connection pool.

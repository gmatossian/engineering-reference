---
id: '84239686-a565-4af2-ad78-b2c9eee61ea9'
title: 'Executors and task execution'
summary: 'Submit tasks through an executor and choose its concurrency and scheduling policy deliberately.'
iconKey: 'queue'
childTopicIds: []
---

An `ExecutorService` separates **submitting work** from creating and managing the
threads that run it.

| Need                              | Starting point                                |
| --------------------------------- | --------------------------------------------- |
| Execute one task at a time        | `Executors.newSingleThreadExecutor()`         |
| Bound platform-thread parallelism | `Executors.newFixedThreadPool(size)`          |
| Run many blocking tasks           | `Executors.newVirtualThreadPerTaskExecutor()` |
| Delay or repeat tasks             | `Executors.newScheduledThreadPool(size)`      |

```java
try (ExecutorService executor = Executors.newFixedThreadPool(8)) {
    Future<Result> future = executor.submit(() -> calculate());
    Result result = future.get();
}
```

`submit` returns a `Future`; `get()` **waits for completion** and exposes task
failure. Closing the executor waits for submitted tasks and begins shutdown.

`ExecutorService` implements `AutoCloseable` from **Java 19**. On older releases,
use `try`/`finally` and call `shutdown()` explicitly instead of using
try-with-resources.

## Traps

- A fixed thread pool uses an **unbounded work queue**; bounding threads does not
  bound queued work.
- Tasks can starve when every worker waits for more work submitted to the same
  saturated executor.
- Choose an explicit rejection, timeout, and shutdown policy when overload or
  cancellation matters.

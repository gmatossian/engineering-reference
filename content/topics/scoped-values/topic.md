---
id: 'cd880907-60d6-4874-b8fd-2f9eacf0e5e6'
title: 'Scoped values'
summary: 'Share immutable context down a call chain with a per-thread binding that ends automatically.'
iconKey: 'concurrency'
childTopicIds: []
---

Java 25 finalized `ScopedValue` for passing contextual data to distant methods
without adding it to every method parameter.

```java
private static final ScopedValue<RequestContext> CONTEXT =
    ScopedValue.newInstance();

ScopedValue.where(CONTEXT, context)
    .run(() -> handleRequest());
```

Code called inside `handleRequest()` can read `CONTEXT.get()`. When `run(...)`
finishes—normally or with an exception—the binding **automatically ends**.

The `ScopedValue` object is a reusable key; it is not deleted. The temporary value
bound to that key is what becomes unavailable outside the scope.

|                         | `ScopedValue`                                  | `ThreadLocal`                    |
| ----------------------- | ---------------------------------------------- | -------------------------------- |
| Lifetime                | Bounded by `run(...)` or `call(...)`           | Until removed or the thread ends |
| Change within the scope | Bindings are immutable; nested code may rebind | Callers may call `set(...)`      |
| Cleanup                 | Automatic                                      | Usually requires `remove()`      |

Prefer ordinary method parameters when the data can be passed directly. Use a
scoped value for one-way context such as request or security information that must
travel through a deeper call chain.

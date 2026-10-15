---
id: '6f8943c2-2c77-4280-a2c2-2fff57564f2d'
title: 'Choosing a synchronization strategy'
status: 'accepted'
summary: 'Match the shape of shared state to the smallest mechanism that protects its complete invariant.'
iconKey: 'architecture'
domains:
  - 'java'
  - 'concurrency'
kind: 'decision-aid'
childTopicIds: []
relatedTopicIds:
  - 'a9da2af5-7976-4bcf-abf4-0a9c1ad3458b'
---

Choose the **smallest correct atomic boundary**: everything that must remain true
together must be protected together.

- **No shared mutable state:** immutable or thread-confined state.
- **Publish a flag or reference:** `volatile` when no compound update is needed.
- **Update one independent value:** `AtomicInteger` or `AtomicReference`.
- **Update one map key:** `compute`, `computeIfAbsent`, or `merge` on a concurrent
  map.
- **Protect a multi-step invariant:** `synchronized` with one shared lock.
- **Need timed or interruptible locking, fairness, or conditions:** `ReentrantLock`.

`volatile` makes writes visible to other threads; it does **not** make `count++`
atomic. See **Visibility and atomicity** under Related topics for that distinction.

## AtomicReference: one reference, not its contents

`AtomicReference<T>` supports atomic reads, replacement, and conditional replacement
of **one reference**. `compareAndSet(expected, replacement)` succeeds only if the
current reference is `expected`; it does not make mutations inside the referenced
object, other variables, or subsequent actions atomic.
It is especially useful with **immutable state**: build a new value, then
atomically replace the reference so readers see either the old or new state.

```java
enum Status { OPEN, CLOSED }
AtomicReference<Status> status = new AtomicReference<>(Status.OPEN);
boolean changed = status.compareAndSet(Status.OPEN, Status.CLOSED);
```

## Lock a complete invariant

Every `synchronized` form locks an **object**, not a field:

- **`synchronized void update()`** locks `this`: callers of the **same instance**
  coordinate; separate instances have separate locks.
- **`static synchronized void update()`** locks the class's `Class` object for
  static state.
- **`synchronized (lock) { ... }`** locks the object referenced by `lock`.

An **invariant** is a rule the state must always satisfy, such as `stock >= 0`.
Use the **same lock object** for the reads and writes that must preserve that rule.
If each object has its own `remaining` value, it can also have its own lock:

```java
private final Object lock = new Object(); // private lock object
private int remaining = 10;

boolean reserve() {
    synchronized (lock) {
        if (remaining == 0) return false;
        remaining--;
        return true;
    }
}
```

An instance method's `this`, the class object, and a private lock are **different
locks**. If several instances update the same shared object, **an instance's
`this` or private instance lock is insufficient**. They must all use the **same
lock object**—for example, a lock held by the collaborator or a shared `static
final` lock.

Java locks coordinate threads **within one JVM**, not separate application
processes. Multiple Spring Boot replicas need another coordination mechanism for
shared state.

`ReentrantLock` provides the same mutual exclusion, plus **timed acquisition**
(`tryLock(timeout, unit)`), **interruptible waiting** (`lockInterruptibly()`), and
**conditions** (`newCondition()`). Its optional **fairness policy** can reduce lock
starvation at a **throughput cost**; it **does not make thread scheduling fair or
prevent deadlock**. The untimed `tryLock()` ignores that fairness setting.

Use a `ReentrantLock` with `try`/`finally`:

```java
private final ReentrantLock lock = new ReentrantLock();
private int remaining = 10;

boolean reserve() {
    lock.lock();
    try {
        if (remaining == 0) return false;
        remaining--;
        return true;
    } finally {
        lock.unlock();
    }
}
```

## Traps

- **Thread-safe collection:** separate method calls are not one atomic workflow.
- **Separate atomic variables:** do not protect an invariant spanning all of them.
- **Locking writes but not reads:** does not establish one consistent locking rule.
- **Slow I/O while holding a lock:** move it outside the critical section when safe.
- **Deadlock** means threads wait on each other and none can proceed;
  **starvation** means a thread keeps being denied a chance to proceed while
  others do. A **timeout** can let a caller stop waiting for a lock; it does not by
  itself make a deadlocked workflow correct.

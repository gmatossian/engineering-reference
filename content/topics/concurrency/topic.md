---
id: '750d6258-e1be-4813-9487-18c6ba78af0a'
title: 'Concurrency'
summary: 'Protect shared state, execute tasks, and limit access to constrained resources.'
iconKey: 'concurrency'
childTopicIds:
  - '6f8943c2-2c77-4280-a2c2-2fff57564f2d'
  - 'a9da2af5-7976-4bcf-abf4-0a9c1ad3458b'
  - '84239686-a565-4af2-ad78-b2c9eee61ea9'
  - '30e2c64a-8978-447e-bde6-022686cefe8d'
---

Start by finding the **shared mutable state**. If state can remain immutable or
owned by one thread, no synchronization is required.

Keep these questions separate:

| Question                               | Starting point                                     |
| -------------------------------------- | -------------------------------------------------- |
| How is shared state kept correct?      | Atomics, concurrent collections, or locks          |
| How are tasks submitted and managed?   | `ExecutorService`                                  |
| How are many blocking tasks supported? | Virtual threads                                    |
| How is a scarce resource protected?    | A semaphore, bounded queue, or the resource's pool |

A thread-safe object protects only its documented operations. It does **not** make
an entire multi-step business workflow atomic.

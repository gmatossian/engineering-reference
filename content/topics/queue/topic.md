---
id: '8cbea92a-606e-4ed3-839c-c7fff67f0909'
title: 'Queue'
iconKey: 'queue'
childTopicIds:
  - 'bf417331-9329-42b4-9517-351ef6af3b85'
---

A queue holds elements for processing in a defined order. A FIFO queue removes the
element that has waited the longest.

![Elements entering at the tail and leaving from the head of a queue](./queue-operations.svg)

## Core operations

```java
queue.offer(value);
queue.peek();
queue.poll();
```

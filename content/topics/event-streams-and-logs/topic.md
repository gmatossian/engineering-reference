---
id: '50202977-c30d-4d2e-a1d5-893102a0dcce'
title: 'Event streams and logs'
status: 'draft'
summary: 'Choose retained event history and understand replay, partitions, and consumer positions.'
iconKey: 'queue'
domains:
  - 'system-design'
kind: 'concept'
childTopicIds: []
relatedTopicIds:
  - '7b77e594-3472-4324-98b9-6705a606f976'
  - 'b34b3eca-ea1a-4d87-94f5-ee46a11192f2'
---

**Choose a retained log for history, replay, or ordered event processing.** Multiple subscribers are optional; one consumer can still need replay.

## Kafka-style log model

- **Topic:** Named event collection, divided into partitions.
- **Partition:** Ordered append-only sequence; the ordering boundary.
- **Offset:** Position within one partition.
- **Consumer group:** Independent processing view; group members share partitions.
- **Retention:** Policy controlling how long/how much history remains.

Reading or committing an offset **does not delete the event**. Another group can read at a different position; a group can replay history that is still retained.

## Boundaries and costs

- **Ordering is per partition**, not across an entire multi-partition topic. Parallel application processing must preserve any required order too.
- **Retention limits replay.** Cleanup or compaction may remove records; a log is not automatically a permanent archive of every event.
- **Offsets track progress**, not an atomic commit of arbitrary external effects. A crash can repeat processing.
- **Partitioning affects capacity and ordering.** Hot keys can bottleneck one partition; additional workers do not fix that automatically.

Other products use different terminology and consumption models; check their guarantees.

## Sources

- [Kafka introduction](https://kafka.apache.org/intro/)
- [Kafka design](https://kafka.apache.org/design/)

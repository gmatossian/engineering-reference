---
id: '4ba18cf5-d17f-421b-b707-7c7ebca46c85'
title: 'Messaging'
status: 'draft'
summary: 'Choose a messaging model from workload, fan-out, replay, and ordering requirements.'
iconKey: 'architecture'
domains:
  - 'system-design'
kind: 'area'
childTopicIds:
  - 'dd0ab4c6-2430-46a1-a6b8-5bb116c3e2e7'
  - 'b4252c38-54df-408b-a140-eafa6a5eb5c1'
  - '50202977-c30d-4d2e-a1d5-893102a0dcce'
  - '7b77e594-3472-4324-98b9-6705a606f976'
  - 'b34b3eca-ea1a-4d87-94f5-ee46a11192f2'
relatedTopicIds: []
---

## Choose from the requirement

### Work queue

Distribute thumbnail jobs among workers.

**Tradeoff:** Retries can repeat work; effects must tolerate duplicates.

### Publish/subscribe

Let billing, email, and analytics each react to an order event.

**Tradeoff:** Each subscription needs its own backlog and failure policy.

### Event stream/log

Retain events for replay or process an ordered sequence.

**Tradeoff:** Manage retention and consumer positions; ordering has a defined boundary.

## How delivery differs

![A work queue distributes different jobs among workers; pub/sub sends an event to each subscription; retained-log consumer groups read at independent positions.](./delivery-shapes.svg)

## Before choosing

- **Pub/sub can be durable:** offline consumers do not automatically lose messages. Retention and subscription settings matter.
- **Streams do not require multiple consumers:** retention, replay, and ordered event processing are stronger selection reasons. Ordering is commonly per partition, not global.
- **Products overlap:** queues, pub/sub, and logs are models, not mutually exclusive product categories.

A **producer** sends messages; a **consumer** processes them; a **broker** is infrastructure that routes or stores them. A **topic** names a publication destination; its delivery semantics depend on the product.

> **Database jobs can also fit.** A durable job table avoids another service, but workers need safe claiming, retries, and recovery; polling adds database load.

## Sources

- [RabbitMQ consumers](https://www.rabbitmq.com/docs/consumers)
- [Google Pub/Sub subscriptions](https://docs.cloud.google.com/pubsub/docs/subscription-overview)
- [Kafka design](https://kafka.apache.org/design/)

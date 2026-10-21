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

![Queue: jobs A and B go to different workers.](./queue-delivery.svg)

- **Use:** distribute thumbnail jobs among workers.
- **Plan for:** retries can repeat work; make effects duplicate-safe.

![Pub/sub: billing and email each receive event E.](./pubsub-delivery.svg)

- **Use:** let independent applications each react to the same event.
- **Remember:** durable subscriptions or subscriber queues can retain messages while consumers are offline.

![Stream: retain events and read them again while history remains available.](./stream-delivery.svg)

- **Use:** retained history, replay, or ordered event processing.
- **Plan for:** retention limits replay; ordering is commonly per partition, not global. Multiple consumers are optional.

> **Database jobs can also fit.** A durable job table avoids another service, but workers need safe claiming, retries, and recovery; polling adds database load.

## Terms and boundaries

- **Producer / consumer:** sends / processes messages.
- **Broker:** infrastructure that routes or stores messages.
- **Topic:** named publication destination; delivery semantics depend on the product.
- **Models overlap:** one product can support queues, pub/sub, and logs.

## Sources

- [RabbitMQ consumers](https://www.rabbitmq.com/docs/consumers)
- [Google Pub/Sub subscriptions](https://docs.cloud.google.com/pubsub/docs/subscription-overview)
- [Kafka design](https://kafka.apache.org/design/)

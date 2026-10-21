---
id: 'b34b3eca-ea1a-4d87-94f5-ee46a11192f2'
title: 'Messaging implementations and hosting'
status: 'draft'
summary: 'Name an engine or cloud service that fits the messaging model and operational constraints.'
iconKey: 'queue'
domains:
  - 'system-design'
kind: 'decision-aid'
childTopicIds: []
relatedTopicIds: []
---

## Narrow the candidates

- **Background jobs:** RabbitMQ; AWS SQS; GCP Pub/Sub with workers sharing a subscription
- **Independent event subscribers:** RabbitMQ exchanges + queues; AWS SNS + SQS; GCP Pub/Sub
- **Retained log and replay:** Apache Kafka; AWS MSK; GCP Managed Service for Apache Kafka
- **Existing JMS broker integration:** ActiveMQ Classic; Amazon MQ for ActiveMQ Classic

These are starting points, not exclusive capabilities. Choose the model first, then check ordering, replay, failure handling, and existing platform constraints.

## Engines: self-managed or hosted

### RabbitMQ

- **Fit:** job queues and routed pub/sub through exchanges and queues.
- **Tradeoff:** topology, durability, acknowledgements, and capacity still need design. RabbitMQ also supports streams; it is not limited to queues.
- **Hosting:** run it yourself or use a managed provider, including Amazon MQ.

### ActiveMQ Classic

- **Fit:** existing JMS applications and broker/protocol compatibility.
- **Tradeoff:** select and operate the broker topology and verify client/version compatibility.
- **Hosting:** self-managed or Amazon MQ. Specify **Classic**; do not assume Amazon MQ hosts Artemis.

### Apache Kafka

- **Fit:** retained event history, replay, and the Kafka processing ecosystem.
- **Tradeoff:** partition keys, retention, consumer lag, and ordering remain design responsibilities even with managed hosting.
- **Hosting:** self-managed, Amazon MSK, Google Cloud Managed Service for Apache Kafka, or another provider.

## AWS services

### SQS Standard

Independent jobs; no strict ordering needed.

**Tradeoff:** At-least-once delivery; duplicates and out-of-order delivery are possible.

### SQS FIFO

Ordering within message groups and send deduplication matter.

**Tradeoff:** Group design constrains parallelism; retries can still repeat business effects.

### SNS + SQS

Fan-out with a durable queue for each consumer application.

**Tradeoff:** More queues, subscriptions, and failure policies to manage.

### Amazon MQ

Managed RabbitMQ or ActiveMQ Classic; engine/protocol compatibility matters.

**Tradeoff:** Broker capacity and engine-specific configuration still matter.

### MSK

Managed Kafka and its APIs/ecosystem.

**Tradeoff:** Kafka data-model and consumer responsibilities remain.

**Standard and FIFO are SQS queue types, not pricing tiers.** FIFO deduplication is bounded; a received message that is not deleted can become visible again.

## GCP services

### Pub/Sub

Managed fan-out; shared subscriptions can distribute worker jobs.

**Tradeoff:** Service-specific API and subscription, retention, and ordering policies.

### Managed Service for Apache Kafka

Kafka APIs, tooling, and partitioned-log model are required.

**Tradeoff:** Kafka partitions, retention, and consumer behavior still need design.

## Who operates what?

- **Self-managed engine:** your team owns provisioning, upgrades, storage, replication, monitoring, and recovery.
- **Managed engine:** provider operates the broker infrastructure within the service contract; your team still owns topology, configuration, clients, and workload behavior.
- **Managed service API:** no broker cluster to operate directly; accept service-specific APIs, limits, and guarantees.

## Sources

- [RabbitMQ queues](https://www.rabbitmq.com/docs/queues) and [streams](https://www.rabbitmq.com/docs/streams)
- [ActiveMQ Classic features](https://activemq.apache.org/components/classic/documentation/features)
- [Amazon MQ engines](https://docs.aws.amazon.com/amazon-mq/latest/developer-guide/welcome.html)
- [SQS Standard](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/standard-queues.html) and [FIFO delivery logic](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/FIFO-queues-understanding-logic.html)
- [Amazon MSK](https://docs.aws.amazon.com/msk/latest/developerguide/what-is-msk.html)
- [Google Pub/Sub versus managed Kafka](https://docs.cloud.google.com/pubsub/docs/choose-pubsub-kafka)

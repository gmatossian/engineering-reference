---
id: 'b34b3eca-ea1a-4d87-94f5-ee46a11192f2'
title: 'Messaging implementations and hosting'
status: 'draft'
summary: 'Narrow an interview scenario to five messaging options using workload, platform, and one tradeoff.'
iconKey: 'queue'
domains:
  - 'system-design'
kind: 'decision-aid'
childTopicIds: []
relatedTopicIds: []
---

![Worker-job choices: SQS Standard for a managed AWS queue, accepting duplicates and out-of-order delivery; RabbitMQ for an existing platform or its broker features, accepting setup and capacity decisions.](./queue-choices.svg)

![Fan-out choices: SNS plus SQS on AWS needs a queue and policy per subscriber application; GCP Pub/Sub uses service-specific APIs and subscription policies and also supports workers sharing one subscription.](./fanout-choices.svg)

![History and replay: Apache Kafka, self-managed or hosted, still needs partitioning, retention, and consumer-progress design.](./replay-choice.svg)

> **Thumbnail jobs:** compare **SQS Standard** and **RabbitMQ** first; **Pub/Sub** is a GCP option. Retained-history or replay requirements give Kafka a stronger reason.

**Broker setup ≠ self-managed hosting.** Defining queues, routing rules, and retries also applies to a hosted broker. Self-management adds servers, upgrades, availability, and recovery.

These are starting points, not exclusive capabilities. Standard is an SQS queue type; ordering requirements may lead to FIFO. Managed hosting reduces infrastructure work, not application delivery responsibilities.

## Sources

- [SQS Standard](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/standard-queues.html) and [FIFO delivery](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/FIFO-queues-understanding-logic.html)
- [RabbitMQ queues](https://www.rabbitmq.com/docs/queues) and [managed RabbitMQ on Amazon MQ](https://docs.aws.amazon.com/amazon-mq/latest/developer-guide/welcome.html)
- [SNS + SQS fan-out](https://docs.aws.amazon.com/sns/latest/dg/sns-sqs-as-subscriber.html)
- [Google Pub/Sub versus managed Kafka](https://docs.cloud.google.com/pubsub/docs/choose-pubsub-kafka)

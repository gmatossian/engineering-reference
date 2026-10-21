---
id: 'b4252c38-54df-408b-a140-eafa6a5eb5c1'
title: 'Publish/subscribe'
status: 'draft'
summary: 'Fan out events to independent subscriptions while workers can share each subscription.'
iconKey: 'queue'
domains:
  - 'system-design'
kind: 'concept'
childTopicIds: []
relatedTopicIds:
  - '7b77e594-3472-4324-98b9-6705a606f976'
  - 'b34b3eca-ea1a-4d87-94f5-ee46a11192f2'
---

**Choose pub/sub when independent consumers each need the same event.** For an order event, billing and email need separate deliveries; they should not compete for one shared job.

## Topic versus subscription

- **Topic:** Producer publishes an event to a named destination.
- **Subscription or subscriber queue:** Holds one consumer application's delivery/backlog state.
- **Workers sharing a subscription:** Share that application's workload, where supported.
- **Independent subscriptions:** Each receives its own eligible events.

## Offline consumers

**Pub/sub does not necessarily lose messages while consumers are offline.** Durable subscriptions or subscriber queues retain eligible messages within their configured retention limits. Ephemeral subscriptions may provide only live delivery.

An SNS topic can fan out the same order event to:

- **Billing SQS queue** → billing workers.
- **Email SQS queue** → email workers.

SNS fans out to the queues; their workers can process later. Create subscriptions before relying on delivery; historical replay is product- and retention-dependent.

## Sources

- [SNS fan-out to SQS](https://docs.aws.amazon.com/sns/latest/dg/sns-sqs-as-subscriber.html)
- [Google Pub/Sub subscriptions](https://docs.cloud.google.com/pubsub/docs/subscription-overview)

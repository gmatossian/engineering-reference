---
id: 'dd0ab4c6-2430-46a1-a6b8-5bb116c3e2e7'
title: 'Message queues'
status: 'draft'
summary: 'Distribute background jobs among workers and recover from interrupted processing.'
iconKey: 'queue'
domains:
  - 'system-design'
kind: 'concept'
childTopicIds: []
relatedTopicIds:
  - '7b77e594-3472-4324-98b9-6705a606f976'
  - 'b34b3eca-ea1a-4d87-94f5-ee46a11192f2'
---

**Choose a work queue to distribute jobs among workers.** For thumbnails, each job needs one successful result, rather than an independent result from every worker.

## Job lifecycle

1. Receive a job.
2. Generate the thumbnail.
3. Persist the result.
4. Acknowledge/delete the message.

- **Workers compete:** adding workers shares the backlog; it does not broadcast each job to every worker.
- **Worker fails before acknowledgement:** a recoverable delivery can be retried. The result may already exist, so repeats must be safe.
- **Queue accepts a message:** publication succeeded; thumbnail generation has not necessarily finished.
- **Backlog grows:** buffer bursts, limit worker concurrency, and monitor oldest-job age. A queue does not create processing capacity.

## Durability is a configuration choice

Use persistent storage and appropriate replication, publication confirmation, and retention settings. An in-memory queue inside the API process cannot preserve pending work across process loss.

For large images, queue an **image ID or object-storage reference**, not the image bytes. Workers need access to the referenced object.

## Sources

- [RabbitMQ reliability](https://www.rabbitmq.com/docs/reliability)
- [SQS Standard queues](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/standard-queues.html)

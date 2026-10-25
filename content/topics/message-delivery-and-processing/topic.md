---
id: '7b77e594-3472-4324-98b9-6705a606f976'
title: 'Message delivery and processing'
status: 'draft'
summary: 'Recognize delivery guarantees and make retrying consumers safe.'
iconKey: 'queue'
domains:
  - 'system-design'
kind: 'decision-aid'
childTopicIds: []
relatedTopicIds:
  - '548afcc9-4743-4fd9-a55f-33ee25f6a664'
---

## Delivery versus business effects

- **At-most-once:** A delivery can be lost; duplicates are avoided within the stated scope.
- **At-least-once:** Redelivery is possible; make effects duplicate-safe.
- **Exactly-once:** Ask **within which boundary?** Broker deduplication or log transactions do not automatically cover external APIs or databases.

A broker accepting a message does not prove business completion. Retention expiry, repeated failures, or dead-lettering can leave a job unfinished.

## Acknowledge after a durable result

1. Receive the message.
2. Apply a duplicate-safe effect and durably record success.
3. Acknowledge the message.

- **Acknowledge too early:** a later crash can lose the job's effect.
- **Crash after the effect but before acknowledgement:** expect processing again.
- **Visibility timeout / acknowledgement deadline:** temporary delivery ownership; extend it for long work where supported. Expiry can allow redelivery.
- **Transient failure:** retry with backoff and an attempt/time budget.
- **Persistent failure:** isolate in a dead-letter queue where supported; alert, investigate, and deliberately retry or resolve it.

For thumbnails, a deterministic output key based on image version and thumbnail variant can make repeating generation safe. Ensure an older job cannot overwrite a newer image's output.

A database deduplication marker must commit with its local effect; marking “seen” before doing work can lose the work after a crash. External effects need their own idempotency or recovery contract.

## Sources

- [RabbitMQ acknowledgements and confirms](https://www.rabbitmq.com/docs/confirms)
- [SQS visibility timeout](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html)
- [Kafka delivery semantics](https://kafka.apache.org/design/#semantics)

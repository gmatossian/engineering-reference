---
id: 'a23fb8cf-158a-4c8f-b2b5-d4c8995f6d5c'
title: 'URL Frontier'
status: 'draft'
summary: 'Schedule discovered URLs by priority while controlling request rates for each host.'
iconKey: 'queue'
domains:
  - 'system-design'
kind: 'concept'
childTopicIds: []
relatedTopicIds: []
---

The URL Frontier holds discovered URLs waiting to be downloaded. A single FIFO
queue preserves discovery order but does not provide **priority** or **host-level
politeness**.

The frontier therefore uses two scheduling layers:

- **Priority front queues** decide which URLs should move forward.
- **Politeness back queues** decide when each host may be contacted.

## Priority front queues

![A prioritizer routes discovered URLs into queues with different priorities, and a weighted selector favors higher-priority queues](./priority-front-queues.svg)

- The prioritizer scores URLs using signals such as PageRank or site traffic and
  routes each URL to a front queue.
- The weighted selector chooses higher-priority queues more often without
  permanently starving lower-priority work.

## Politeness back queues

![A hostname router assigns URLs to one queue per host, and an eligibility selector releases ready queues to downloader workers](./politeness-back-queues.svg)

- The hostname router uses a host-to-queue mapping so **each back queue contains
  URLs for one host**.
- Each queue tracks when its host may be contacted again. The selector releases
  only eligible queues, preventing concurrent or overly frequent requests to one
  host.
- Downloader workers fetch only the URLs released by the selector.

## Storage

Large frontiers do not fit safely in memory, while a disk-only queue can make every
enqueue and dequeue expensive. A **hybrid frontier** keeps the durable bulk of
queued URLs **on disk** and uses **bounded in-memory buffers** for active enqueue
and dequeue work.

Persist enough frontier state to resume after a worker or process failure without
silently losing the queued crawl.

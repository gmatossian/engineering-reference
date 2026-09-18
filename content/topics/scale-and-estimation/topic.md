---
id: '17e411bb-2c99-49e8-93ec-18b767e4a890'
title: 'Scale and estimation'
summary: 'Turn traffic, payload, retention, and peak assumptions into useful capacity estimates.'
iconKey: 'complexity'
domains:
  - 'system-design'
kind: 'operations'
childTopicIds: []
relatedTopicIds: []
---

Start with the **workload**, not the infrastructure. An order-of-magnitude answer
with visible assumptions is more useful than false precision.

## A repeatable estimate

| Question             | Calculation                                         |
| -------------------- | --------------------------------------------------- |
| Events per day       | active users × events per user per day              |
| Average rate         | events / seconds in the time window                 |
| Peak rate            | average rate × expected peak factor                 |
| Data growth          | new items × bytes per item                          |
| Retained storage     | daily growth × retention × number of stored copies  |
| Network bandwidth    | requests per second × bytes transferred per request |
| In-flight operations | operations per second × average duration in seconds |

Convert network results from bytes to bits with **bytes per second × 8**.

Keep units attached to each value so they cancel visibly. Work in one unit at a
time, round deliberately, and keep the assumptions beside the result.

## Useful shortcuts

| Starting quantity | Approximate rate |
| ----------------- | ---------------- |
| 1 million / day   | 12 / second      |
| 100 million / day | 1,200 / second   |
| 1 billion / day   | 12,000 / second  |

- 1 day = 86,400 seconds; use **100,000** for quick mental arithmetic.
- 1 KB is approximately 1,000 bytes; 1 KiB is exactly 1,024 bytes. State which
  convention matters when precision is required.

## Worked example

Assume:

- 10 million reads per day;
- peak traffic is 5× the average;
- each response is 4 KB;
- 500,000 new 2 KB records per day;
- records are retained for 365 days; and
- storage keeps three copies.

| Estimate      | Result                                    |
| ------------- | ----------------------------------------- |
| Average reads | 10,000,000 / 86,400 ≈ **116 requests/s**  |
| Peak reads    | 116 × 5 ≈ **580 requests/s**              |
| Peak egress   | 580 × 4 KB ≈ **2.3 MB/s**, or **19 Mb/s** |
| Raw storage   | 500,000 × 2 KB × 365 ≈ **365 GB**         |
| Three copies  | 365 GB × 3 ≈ **1.1 TB**                   |

These estimates do not yet include indexes, metadata, backups, protocol overhead,
compression, future growth, or operational headroom.

## Make uncertainty visible

State the assumptions that can materially change the answer:

- average-to-peak multiplier;
- request and response sizes;
- read/write split and cache-hit rate;
- retention and replication;
- expected growth; and
- headroom for failures or traffic spikes.

When an assumption is weak, calculate a **range** instead of hiding the uncertainty
inside one number.

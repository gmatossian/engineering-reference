---
id: '047209de-a62c-4113-8912-d1e6ee20d834'
title: 'Managed vs self-managed databases'
status: 'accepted'
summary: 'Compare operational ownership, control, and costs when choosing database hosting.'
iconKey: 'database'
domains:
  - 'databases'
  - 'system-design'
kind: 'decision-aid'
childTopicIds: []
relatedTopicIds:
  - '8e2ea19b-1ef4-4d5d-8655-446c1a9be1e3'
---

## Compare the operating model

| Area            | Self-managed | Managed    |
| --------------- | ------------ | ---------- |
| **Ops owner**   | Your team    | Provider   |
| **Host access** | Greater      | Restricted |
| **Upkeep**      | More work    | Less work  |
| **Cost**        | Team time    | Fees       |

## Still your responsibility

> **Schema, queries, indexes, transactions, access configuration, and recovery verification remain yours.**

You also choose **capacity, backup retention, and availability settings**.
Managed hosting does not automatically make every deployment highly available.

## Choose by need

- **Self-managed:** required **control or features** justify the operating work.
- **Managed:** **less operating work** outweighs service costs and restrictions.

Managed services can limit host access, extensions, and supported versions;
check the features your workload requires before choosing.

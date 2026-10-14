---
id: '92179879-7f1c-49b1-8751-cf296302bb82'
title: 'Content delivery networks (CDNs)'
status: 'accepted'
summary: 'Compare CDN benefits and tradeoffs, and recall common providers.'
iconKey: 'architecture'
domains:
  - 'http'
  - 'system-design'
kind: 'concept'
childTopicIds:
  - '80ab766c-74cc-422b-9c36-fdc3b28d27b7'
  - 'cf8efa87-1231-4038-a650-e6aee282c406'
relatedTopicIds:
  - '4aa75f9e-93ce-46e3-80d7-ac13d14a77c0'
  - '9009159b-54aa-4724-94a2-5189a1e21437'
  - '17e411bb-2c99-49e8-93ec-18b767e4a890'
---

## Main use

Deliver **cacheable content near users** for **lower latency** and **less origin
load**: images, JavaScript, CSS, downloads, and video.

## Benefits and tradeoffs

- **Faster delivery:** cache misses still require an **origin fetch**.
- **Less origin load:** depends on **cache hits**; miss bursts can overload origin.
- **Reuses content:** may serve **stale data**; freshness needs explicit rules.
- **Distributed delivery:** the CDN remains an **availability dependency**.

**Cost:** delivery fees; pricing may depend on **traffic**, requests, and features,
or use a subscription or contract.

## Common implementations

**Cloudflare · Amazon CloudFront · Akamai**

Compare **coverage**, **cache controls**, **origin integration**, and **cost**.
Features such as **DDoS protection**, WAF, and edge computing vary by provider and
plan.

> **Origin access:** some origins accept **only CDN requests**. Direct-origin
> fallback requires permitted access and enough origin capacity.

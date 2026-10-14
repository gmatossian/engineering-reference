---
id: 'cf8efa87-1231-4038-a650-e6aee282c406'
title: 'CDN caching and freshness'
status: 'accepted'
summary: 'Look up cache-miss behavior, TTL, revalidation, invalidation, and versioned URLs.'
iconKey: 'architecture'
domains:
  - 'http'
  - 'system-design'
kind: 'concept'
childTopicIds: []
relatedTopicIds:
  - '4aa75f9e-93ce-46e3-80d7-ac13d14a77c0'
---

## Hits and misses

![The client requests content from the CDN and receives its response. Only on a cache miss does the CDN fetch content from the origin.](./cdn-hit-miss.svg)

**On a miss:** the CDN fetches and serves the response. Whether it caches that
response—and for how long—depends on **origin response headers and CDN
configuration**.

**Simultaneous misses:** some providers can combine requests into **one fetch**;
behavior depends on configuration.

## Freshness controls

- **Long TTL:** more **cache hits**; changes appear later.
- **Short TTL:** more **origin checks and load**.
- **Revalidation:** ask the origin whether content **changed**.
- **Purge / invalidation:** remove content **before expiration**.
- **Versioned URLs:** new content uses a **new URL**.

**TTL** is the freshness lifetime, controlled by **HTTP cache headers** and CDN
configuration. **Versioned URLs** suit assets that never change at the same URL.

> **Expiration ≠ deletion:** an expired response may be revalidated. Content can
> also be **evicted before expiration**. Policies may allow **stale responses**
> during revalidation or origin failure.

Provider details: [CloudFront freshness controls](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Expiration.html)
and [origin requests](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/RequestAndResponseBehaviorCustomOrigin.html).

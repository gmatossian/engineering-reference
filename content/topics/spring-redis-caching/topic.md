---
id: '0eab5dfb-d4ab-4cf8-a56c-41b4548da56c'
title: 'Spring caching with Redis'
status: 'draft'
summary: 'Recall who handles a cache miss with @Cacheable and configure Redis-backed cache expiration.'
iconKey: 'java'
domains:
  - 'java'
  - 'system-design'
kind: 'operations'
childTopicIds: []
relatedTopicIds: []
---

## Cache a method result

```java
@Cacheable(cacheNames = "products", key = "#p0")
public ProductDetails getProduct(long productId) {
    return repository.findDetailsById(productId);
}
```

Assumes a Spring-managed service, caching enabled with `@EnableCaching`, a
Redis-backed `CacheManager`, and configured Redis connectivity and value
serialization. `#p0` selects the first argument without relying on parameter names.

| Component                          | Responsibility                                                                                    |
| ---------------------------------- | ------------------------------------------------------------------------------------------------- |
| Spring caching interceptor         | Checks the cache; hit returns without executing the method; miss invokes it and caches its result |
| `RedisCacheManager` / `RedisCache` | Implements Spring cache operations using Redis                                                    |
| Service method                     | Loads the result from PostgreSQL                                                                  |
| Redis server                       | Stores and retrieves cached values                                                                |

**Read-through-style caller experience; application-side cache-aside mechanism.**
Redis itself does not call the repository.

## Configure a 30-second TTL

In a caching configuration class:

```java
@Bean
RedisCacheManager cacheManager(RedisConnectionFactory factory) {
    return RedisCacheManager.builder(factory)
        .cacheDefaults(RedisCacheConfiguration.defaultCacheConfig()
            .entryTtl(Duration.ofSeconds(30)))
        .build();
}
```

These are defaults for all caches managed here; override individual caches when
their freshness requirements differ. Configure a value serializer compatible
with `ProductDetails`; TTL configuration alone does not provide one.

## Traps

- **Self-invocation:** a same-object call bypasses the caching proxy by default.
- **Writes:** `@Cacheable` does not invalidate results when the database changes;
  coordinate updates and invalidation with transaction completion.
- **Concurrent misses:** do not assume annotation-based caching guarantees one
  database load across the application fleet; coordination is provider-dependent.

See [Spring caching annotations](https://docs.spring.io/spring-framework/reference/integration/cache/annotations.html)
and [Spring Data Redis cache configuration](https://docs.spring.io/spring-data/redis/reference/redis/redis-cache.html).

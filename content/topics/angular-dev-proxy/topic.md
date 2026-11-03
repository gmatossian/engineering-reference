---
id: 'b35c83b3-ae4d-405b-a06c-21bc3d24bfd5'
title: 'Proxy Angular development requests to an API'
status: 'accepted'
summary: 'Forward relative /products requests to Spring Boot without changing the browser-facing origin.'
iconKey: 'network'
domains:
  - 'javascript'
  - 'http'
kind: 'operations'
childTopicIds: []
relatedTopicIds: []
---

## Local request path

![The browser sends /products to the Angular dev server at localhost:4201. The dev server proxies the request to the Spring API at localhost:8080, retaining /products.](./local-api-proxy.svg)

## Configure and run

Create **`ui/src/proxy.conf.json`**:

```json
{
  "/products/**": {
    "target": "http://localhost:8080"
  }
}
```

From **`ui/`**:

```bash
npm start -- --port 4201 --proxy-config src/proxy.conf.json
```

| Request path in frontend code | Forwarded destination                 |
| ----------------------------- | ------------------------------------- |
| `/products`                   | `http://localhost:8080/products`      |
| `/products/UUID`              | `http://localhost:8080/products/UUID` |

With the current `@angular/build:dev-server`, `/products/**` matches the base
path **and nested paths**. No path rewrite is needed for this API.

## Avoid these traps

- Use **relative URLs** in frontend code. Calling `http://localhost:8080`
  directly bypasses the proxy and requires the API's CORS configuration.
- Run Spring Boot separately; the proxy **does not start the API**.
- **Restart `ng serve` after changing proxy configuration.**
- This is **development-server configuration**. A production host needs its own
  reverse proxy/routing, or an explicit API origin with appropriate CORS.

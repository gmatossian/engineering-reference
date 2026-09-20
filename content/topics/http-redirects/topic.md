---
id: '6fa244ce-5f77-427b-b4a6-4217400d54ed'
title: 'HTTP redirects'
summary: 'Choose a redirect by permanence and method-preservation behavior.'
iconKey: 'conversion'
domains:
  - 'http'
kind: 'decision-aid'
childTopicIds: []
relatedTopicIds: []
---

For ordinary browser navigation—including a typical `GET` to a short URL—start
with **`301` for a permanent destination** or **`302` for a temporary or changeable
destination**. The other codes address more specific method behavior.

## Choose by method behavior

| Intent                                         | Code                     | Method behavior                               |
| ---------------------------------------------- | ------------------------ | --------------------------------------------- |
| Permanent; historical browser behavior allowed | `301 Moved Permanently`  | A `POST` may become `GET`                     |
| Temporary; historical browser behavior allowed | `302 Found`              | A `POST` may become `GET`                     |
| Show the result at another URI                 | `303 See Other`          | Follow with `GET` or `HEAD`                   |
| Temporary and preserve the method              | `307 Temporary Redirect` | Resend using the same method and request body |
| Permanent and preserve the method              | `308 Permanent Redirect` | Resend using the same method and request body |

These redirects normally identify the destination with **`Location`**. Choose
`307` or `308` when preserving the original method matters.

```http
HTTP/1.1 302 Found
Location: https://example.com/destination
```

Use the same **`Location` response header** with `301`; the status code communicates
whether the destination is permanent or temporary. Add caching headers only when
you need to control how the redirect is cached.

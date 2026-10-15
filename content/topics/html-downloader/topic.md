---
id: '2cd52177-f0fe-451f-a482-a5f2504e4d44'
title: 'HTML Downloader'
status: 'draft'
summary: 'Fetch permitted pages efficiently while containing slow hosts, failures, and malformed responses.'
iconKey: 'operations'
domains:
  - 'system-design'
kind: 'concept'
childTopicIds: []
relatedTopicIds: []
---

The HTML Downloader receives scheduled URLs from the frontier, resolves their hosts,
and fetches the corresponding pages over HTTP.

## Respect `robots.txt`

Before crawling a host, retrieve and apply its Robots Exclusion Protocol rules for
the crawler's user agent. **Cache the parsed rules** according to the protocol so
every page does not require another `robots.txt` request.

`robots.txt` communicates requested crawl permissions. It is **not access control**,
and its contents must be treated as untrusted input.

## Distribute downloads

**Partition hosts or URLs across downloader processes** so crawl work can scale
horizontally. Stable partitioning, such as consistent hashing, limits reassignment
when downloader capacity changes.

**Keep crawl state outside an individual downloader.** A failed worker can then be
replaced and its outstanding work recovered through the frontier rather than being
lost with the process.

## Reduce avoidable waiting

- **Cache DNS results** so repeated URLs from the same host do not require a blocking
  lookup each time.
- **Use connection and response deadlines** so one slow or unresponsive server does
  not occupy a worker indefinitely.
- **Place download capacity near target hosts** when geographic locality materially
  reduces latency.
- **Bound concurrency** so slow dependencies cannot consume every worker or outbound
  connection.

## Handle failures deliberately

- **Validate responses** by status, content type, size, and page structure before
  further processing.
- **Isolate malformed content** instead of treating it as a process-level failure.
- **Retry transient failures** with a bounded policy and backoff.
- **Do not retry permanent failures indefinitely.**
- **Persist outcome and scheduling state** so interrupted work can be recovered
  without silently dropping URLs.

## References

- [RFC 9309: Robots Exclusion Protocol](https://www.rfc-editor.org/rfc/rfc9309.html)
- [Troubleshoot Google Search crawling errors](https://developers.google.com/search/docs/crawling-indexing/troubleshoot-crawling-errors)
- [Mercator: A Scalable, Extensible Web Crawler](https://www.cs.ucr.edu/~vagelis/classes/CS242/publications/scalable-crawler.pdf)

# Authoring sources

Retrieval job: choose sequential await, Promise.all, or Promise.allSettled from operation dependencies and required failure behavior.

- [ECMAScript Await](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#await) — suspension of the current function.
- [ECMAScript Promise.all](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-promise.all) — ordered result values and rejection before other inputs settle; no cancellation step.
- [ECMAScript Promise.allSettled](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-promise.allsettled) — waits for every input and preserves input order with status records.
- [Fetch Standard: abort fetch](https://fetch.spec.whatwg.org/#abort-fetch) — operation-specific cancellation through a signal.

# Authoring sources

- [MDN Promise constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/Promise) — executor timing, resolving functions, and deferred handlers.
- [ECMAScript Promise objects](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-promise-objects) — constructor execution and reaction jobs.
- [HTML microtask queuing](https://html.spec.whatwg.org/multipage/webappapis.html#microtask-queuing) — browser integration of Promise jobs.
- Local study guide: `study-library/generated/javascript-async-execution-and-reactivity/guide.md`, section 4, in the engineering-career repository.

- [ECMAScript Await](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#await) — suspension and later continuation, including for an already fulfilled native Promise.

2026-11-03 revision: compare the next statement after resolve(7) with the next statement after await Promise.resolve(7). Replace the existing resolve-is-not-return bullet with the comparison to avoid duplication. The timing example and accepted status are preserved.

- [ECMAScript Promise.resolve](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-promise.resolve) — resolving an ordinary value and reusing an existing Promise when its constructor matches.

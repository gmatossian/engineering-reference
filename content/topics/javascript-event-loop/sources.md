# Authoring references

Retrieval job: identify what is scheduled as a task or microtask and determine the ordinary execution order. Scope: guide section 2 and requested discussion clarifications. The sequence is explicitly simplified; checkpoints can also occur after callback cleanup with an empty JS stack.

- [HTML event loops and processing model](https://html.spec.whatwg.org/multipage/webappapis.html#event-loops): task sources, task queues, checkpoints, rendering opportunities.
- [MDN microtask guide](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide): draining, enqueue order, queueMicrotask, Promise and observer callbacks.
- Local study guide: `engineering-career/study-library/generated/javascript-async-execution-and-reactivity/guide.md`, section 2.

- [ECMAScript Await operation](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#await): awaits an ordinary native Promise through a continuation reaction.
- [PerformPromiseThen](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-performpromisethen): pending reactions are registered until settlement; already fulfilled Promises enqueue their reactions immediately.

2026-11-02 revision: compare the same direct async call and then registration in opposite orders, using one already fulfilled native Promise. The queue labels identify [a, b] versus [b, a]; synchronous 1 precedes both. Each case runs separately. A returned-Promise dependency supplies explicit sequencing. Agent-run checks confirm both outputs; the existing topic status is preserved.

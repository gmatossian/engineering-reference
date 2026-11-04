# Authoring references

Retrieval job: choose and implement polling that waits for completion before scheduling another operation. Diagram times are illustrative, measured from the first request start; not timer guarantees. Code adapted from the local guide, including its error, stop, and non-settlement caveats.

- [MDN setInterval: ensure execution is shorter than interval frequency](https://developer.mozilla.org/en-US/docs/Web/API/Window/setInterval#ensure_that_execution_duration_is_shorter_than_interval_frequency): overlapping requests and recursive timeout approach.
- [HTML timers](https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#timers): repetition and cancellation.
- Local study guide: `engineering-career/study-library/generated/javascript-async-execution-and-reactivity/guide.md`, section 3.

- [MDN closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures): nested functions retain access to their outer lexical environment after the outer function returns; separate calls have separate environments.

2026-11-03 revision: add the start/stop usage and distinguish one-time setup from per-tick refresh. A short shared-state note explains the nesting. Polling implementation, first-tick delay, cancellation limits and accepted status are unchanged.

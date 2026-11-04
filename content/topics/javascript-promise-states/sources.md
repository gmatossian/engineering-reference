# Authoring sources

- [MDN Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) — the three states and resolved versus settled.
- [Promise proposal: states and fates](https://github.com/domenic/promises-unwrapping/blob/master/docs/states-and-fates.md) — resolution as commitment to an outcome.
- [MDN Promise constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/Promise) — adoption and ignored subsequent resolving calls.
- Local study guide: `study-library/generated/javascript-async-execution-and-reactivity/guide.md`, section 4, in the engineering-career repository.

2026-11-03 retrieval revision: lead with resolve(value) versus resolve(pendingPromise), distinguish settled states with a compact text flow, replace the saved-resolver example with timer-backed adoption, and separate handler execution in one callout. Resolution includes rejection; no fourth state or guarantee that a handler has run is implied. The timer delay is illustrative. Identity, relationships and accepted status are preserved.

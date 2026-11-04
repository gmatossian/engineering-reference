# Authoring sources

- [MDN async function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) — returned Promises, synchronous entry, and the await-enabled function body.
- [MDN await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await) — accepted inputs, rejection behavior, suspension, and microtask continuations.
- [ECMAScript Await](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#await) — suspension and resumption semantics.
- Local study guide: `study-library/generated/javascript-async-execution-and-reactivity/guide.md`, section 5, in the engineering-career repository.

2026-11-03 revision: the existing ready-value example now awaits the ordinary string '3' and shows 1 → outside → 3. The input table gives that concrete value, and a nearby callout separates unchanged result from deferred continuation. The already-fulfilled-Promise equivalence is retained. No additional timing example or topic-status change is introduced.

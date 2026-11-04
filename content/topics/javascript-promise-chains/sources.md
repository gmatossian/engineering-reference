# Authoring sources

Retrieval job: determine what a Promise handler passes downstream and where failure and cleanup are handled.

- [ECMAScript Promise.prototype.then](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-promise.prototype.then) — new derived Promise and reaction propagation.
- [ECMAScript NewPromiseReactionJob](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-newpromisereactionjob) — handler return values and throws determine the derived outcome.
- [ECMAScript Promise.prototype.catch](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-promise.prototype.catch) — rejection handler placement.
- [ECMAScript Promise.prototype.finally](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-promise.prototype.finally) — no result argument, outcome preservation, waiting, and failure replacement.

- [RxJS Observable source, 7.8.2](https://github.com/ReactiveX/rxjs/blob/7.8.2/src/internal/Observable.ts) — subscribe registers a next handler and returns a Subscription; handler return values do not transform the source.

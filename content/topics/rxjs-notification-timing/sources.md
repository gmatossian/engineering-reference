# Authoring references

Retrieval job: determine the execution context of an RxJS notification handler. Verified against locally installed RxJS 7.8.2 source. The Promise row assumes a native Promise, not an arbitrary thenable. No scheduler overrides in the table.

- [RxJS of](https://rxjs.dev/api/index/function/of): synchronous emission and completion.
- [RxJS innerFrom source, 7.8.2](https://github.com/ReactiveX/rxjs/blob/7.8.2/src/internal/observable/innerFrom.ts): fromArrayLike and fromPromise call subscriber methods directly.
- [RxJS Subscriber source, 7.8.2](https://github.com/ReactiveX/rxjs/blob/7.8.2/src/internal/Subscriber.ts): notification delivery.
- [RxJS interval source, 7.8.2](https://github.com/ReactiveX/rxjs/blob/7.8.2/src/internal/observable/interval.ts): asyncScheduler default.
- [RxJS observeOn](https://rxjs.dev/api/operators/observeOn): scheduler-controlled notification delivery.

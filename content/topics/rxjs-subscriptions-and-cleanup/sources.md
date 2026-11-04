# Authoring sources

Retrieval job: distinguish source termination from consumer unsubscription and decide who owns subscription cleanup. Checked against the locally installed RxJS 7.8.2 implementation.

- [RxJS Observable guide](https://rxjs.dev/guide/observable) — subscribing and disposing execution; cold versus shared/hot sources.
- [RxJS Observable source, 7.8.2](https://github.com/ReactiveX/rxjs/blob/7.8.2/src/internal/Observable.ts) — subscriber setup and registering returned teardown.
- [RxJS Subscriber source, 7.8.2](https://github.com/ReactiveX/rxjs/blob/7.8.2/src/internal/Subscriber.ts) — complete/error call unsubscribe; unsubscribe does not deliver a complete notification.
- [RxJS Subscription source, 7.8.2](https://github.com/ReactiveX/rxjs/blob/7.8.2/src/internal/Subscription.ts) — disposal of registered resources.
- [RxJS finalize source, 7.8.2](https://github.com/ReactiveX/rxjs/blob/7.8.2/src/internal/operators/finalize.ts) — finalizer on complete, error, and explicit unsubscribe.
- [Angular: making HTTP requests](https://angular.dev/guide/http/making-requests#http-observables) — requests start per subscription, usual completion, abort on unsubscribe, and interceptors.
- [Angular: RxJS interop](https://angular.dev/ecosystem/rxjs-interop) — default automatic toSignal destruction cleanup and takeUntilDestroyed. The topic describes defaults, without manualCleanup or a custom lifetime.

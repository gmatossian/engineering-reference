# Authoring sources

Retrieval job: choose async, toSignal or writable signals by how the reader consumes and changes a value, and distinguish the underlying abstractions. Targets Angular 22 and RxJS; checked 2026-11-02. This is a decision aid, not a complete reactive programming guide.

- [Angular signals](https://angular.dev/guide/signals): current values, tracked template reads, writable state and computed derivations. No independent next/error/complete notification API is exposed by signals; this does not mean a signal getter can never throw.
- [RxJS Observable guide source](https://github.com/ReactiveX/rxjs/blob/master/apps/rxjs.dev/content/guide/observable.md): notifications, subscription, synchronous/asynchronous emission and completion/error semantics. Observable is not a synonym for asynchronous work; stateful Observable sources also exist.
- [Angular HTTP requests](https://angular.dev/guide/http/making-requests): subscription starts a request; the response may feed component state. Re-reading a separately stored signal does not subscribe again.
- [Angular RxJS interop](https://angular.dev/ecosystem/rxjs-interop): toSignal exposes the latest Observable value as a read-only signal usable in TypeScript and computed derivations. The ownership comparison contrasts read-only conversion with explicit subscription into writable state. Basic conversion syntax and destruction cleanup are shown; request-error handling is intentionally omitted from the labeled component fragments.
- [Angular AsyncPipe](https://angular.dev/api/common/AsyncPipe): template consumption of the latest emitted value, with automatic subscription cleanup.

The matrix compares the abstractions, while the text flow shows the product exercise's boundary between a response and retained state. It is intentionally a compact text flow, not an additional SVG repeating those labels. The two related operational topics retain their implementation snippets. No exercise code is changed and no learner proficiency is inferred from this agent-authored reference.

- [Angular takeUntilDestroyed](https://angular.dev/ecosystem/rxjs-interop/take-until-destroyed): automatic subscription cleanup using an explicit DestroyRef when subscribing in ngOnInit.

- [Angular unhandled errors](https://angular.dev/best-practices/error-handling): AsyncPipe forwards unhandled errors to the root ErrorHandler; expected HTTP failures should become operation-specific feedback.
- [Angular ErrorHandler](https://angular.dev/api/core/ErrorHandler): default behavior logs errors to the console.
- [RxJS catchError](https://rxjs.dev/api/operators/catchError): replaces an error with a replacement Observable. The example emits an explicit error state rather than disguising failure as a successful empty list.

The async error example uses a stable field and one template subscription. It covers one-shot success/failure feedback, not loading state, refresh or retry orchestration. Initial failure without handling leaves AsyncPipe's initial null value; an error after prior emissions does not imply clearing the previous value.

The opening decision table replaces the earlier UI-state/request-flow split, since both abstractions can represent displayed data. The conceptual matrix is secondary and no longer includes a prescriptive Use for row.

The toSignal example combines fetched products with a writable local search signal through computed. Both dependencies update the filtered result; it is not a claim that filtering requires signals or cannot be expressed with RxJS.

- [RxJS 7.8.2 BehaviorSubject](https://github.com/ReactiveX/rxjs/blob/7.8.2/src/internal/BehaviorSubject.ts): retains a current value, emits it to active new subscribers and exposes value/getValue access.
- [RxJS 7.8.2 ReplaySubject](https://github.com/ReactiveX/rxjs/blob/7.8.2/src/internal/ReplaySubject.ts): configurable value/time buffer replayed to new subscribers; not the same getter API as BehaviorSubject.

The conceptual comparison omits the former Represents row to avoid implying that Observables cannot represent current state. The Consume row distinguishes the general APIs; the short note identifies stateful Observable sources. Route snapshots are a separate Angular API and are not needed for this comparison.

- [RxJS switchMap 7.8.2](https://github.com/ReactiveX/rxjs/blob/7.8.2/src/internal/operators/switchMap.ts): new source values unsubscribe the previous inner subscription; mergeMap does not implement this replacement behavior.
- [RxJS debounceTime 7.8.2](https://github.com/ReactiveX/rxjs/blob/7.8.2/src/internal/operators/debounceTime.ts): waits for the due time without another source emission.
- [RxJS retry 7.8.2](https://github.com/ReactiveX/rxjs/blob/7.8.2/src/internal/operators/retry.ts): resubscription after failure.
- [Angular HTTP Observable cancellation](https://angular.dev/guide/http/making-requests#http-observables): unsubscribing aborts an in-progress HttpClient request; separate from guaranteed server cancellation or transaction rollback.

Cancellation wording is scoped to a direct HttpClient subscription. General Observable cleanup is source-dependent; a shared source may continue for other subscribers. No claim is made that aborting HTTP guarantees server rollback or stops an already-started operation.

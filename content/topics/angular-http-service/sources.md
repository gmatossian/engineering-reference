# Authoring sources

Retrieval job: recover the DI declaration, typed HTTP call and bounded one-request consumer with pending/error state. Targets Angular 22; verified 2026-10-30.

- [Injectable API](https://angular.dev/api/core/Injectable): providedIn registration and injectable metadata.
- [Injection context](https://angular.dev/guide/di/dependency-injection-context): inject in Angular-created class fields; ordinary event handlers are not injection contexts.
- [HTTP setup](https://angular.dev/guide/http/setup): HttpClient injectable by default since Angular 21; provideHttpClient configures features.
- [Making requests](https://angular.dev/guide/http/making-requests): subscriptions send requests, each subscription is independent, generics do not validate JSON, and get/post signatures.
- [DestroyRef](https://angular.dev/api/core/DestroyRef): supplied without manual registration; injected in a component, its destruction callbacks follow that component's lifetime.
- [takeUntilDestroyed](https://angular.dev/ecosystem/rxjs-interop/take-until-destroyed): explicit DestroyRef outside injection context and teardown on destruction.
- [RxJS finalize](https://rxjs.dev/api/operators/finalize): completion, error and unsubscribe cleanup.

Installed Angular common packages 22.2.4 and 22.1.x declare HttpClient providedIn root. Scratch verification checks service injection, request URL/method, successful rendering, HTTP error rendering, pending duplicate suppression and destruction/cancellation; it does not contact the learner's live API. Form validation, retry policy and latest-request-wins lookup are separate concerns; this example suppresses overlapping calls.

2026-11-01 retrieval revision: move default HttpClient availability before the service example and identify Angular-supplied DestroyRef beside the component example; implementation snippets are unchanged.

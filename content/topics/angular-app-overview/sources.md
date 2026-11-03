# Authoring sources

Retrieval job: recognize the roles of the Angular app pieces encountered in the product exercise and identify when each becomes useful. Targets standalone Angular 22; checked 2026-10-31. Configuration and implementation syntax remain in the related operational references.

- [Components](https://angular.dev/guide/components): class/template/selector, rendering child components, component tree.
- [bootstrapApplication](https://angular.dev/api/platform-browser/bootstrapApplication): chosen standalone root component and application configuration.
- [ApplicationConfig](https://angular.dev/api/core/ApplicationConfig): application-level provider setup.
- [Dependency injection](https://angular.dev/guide/di): dependencies supplied to consumers, sharing behavior and substituting test doubles.
- [Creating and using services](https://angular.dev/guide/di/creating-and-using-services): services and inject.
- [Defining providers](https://angular.dev/guide/di/defining-dependency-providers): provider recipes, automatic providedIn registration and explicit replacement.
- [Hierarchical injectors](https://angular.dev/guide/di/hierarchical-dependency-injection): application and local provider scopes, component sharing and injector lookup; detailed scope choice lives in the child reference.
- [HTTP interceptors](https://angular.dev/guide/http/interceptors): shared request/response behavior, authentication and logging examples, functional interceptor form.

Product component names illustrate composition, not Angular-mandated filenames or special page component types. The startup/composition diagram adapts docs/design/diagrams/starter.svg and preserves the embedded font bytes and complete font licenses. Dependency injection uses a short sentence instead of a redundant diagram. No learner implementation or additional framework API is introduced here.

2026-11-01 retrieval revision: distinguish Angular-supplied dependencies and feature registrations from providers the application author must register. HttpClient version details and the contextual DestroyRef example remain in the HTTP service reference.

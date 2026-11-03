# Authoring sources

Retrieval job: recognize a concrete need for application-wide configuration and recover its provider entry, including the distinction between centralized error reporting and request-specific feedback. Targets Angular 22; reviewed 2026-10-31.

- [ApplicationConfig](https://angular.dev/api/core/ApplicationConfig): providers available during bootstrap and to the root component and descendants.
- [provideBrowserGlobalErrorListeners](https://angular.dev/api/core/provideBrowserGlobalErrorListeners): listens to window error and unhandledrejection and forwards to ErrorHandler.
- [ErrorHandler](https://angular.dev/api/core/ErrorHandler): default console reporting and useClass replacement.
- [Unhandled errors](https://angular.dev/best-practices/error-handling): local handling for operation-specific recovery; global reporting is not UI recovery.
- [provideRouter](https://angular.dev/api/router/provideRouter): route provider setup.
- [HTTP setup](https://angular.dev/guide/http/setup): provideHttpClient with withInterceptors configures request features. Default HTTP availability is already covered by the related HTTP topic.
- [provideAppInitializer](https://angular.dev/api/core/provideAppInitializer): runs at startup in an injection context; loading language data is an explicit use case; returned Promise resolution or Observable completion delays initialization.
- [Dependency providers](https://angular.dev/guide/di/defining-dependency-providers): useClass replacement and providedIn root registration.
- [HTTP interceptors](https://angular.dev/guide/http/interceptors): shared request handling, authentication-header use case and withInterceptors registration.
- [Cognito access tokens](https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-user-pools-using-the-access-token.html): access tokens authorize API operations; the reader-facing example stays provider-neutral.
- [Using components](https://angular.dev/guide/components#using-components): component imports make template dependencies available.

The optional examples are entries for an existing providers array, not complete files. routes, authInterceptor, loadStartupData and GlobalErrorHandler are application-defined identifiers; the reference does not implement routing, authentication, remote configuration or monitoring. The generic useValue/API_BASE_URL example, bootstrap plumbing and detached import-location paragraph were removed after owner retrieval review. No product exercise code is changed by this reference.

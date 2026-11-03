# Authoring sources

Retrieval job: choose the registration scope that gives the intended consumers a shared or isolated dependency. Targets standalone Angular 22 with a compact NgModule compatibility note; checked 2026-10-31.

- [Defining dependency providers](https://angular.dev/guide/di/defining-dependency-providers): automatic versus explicit registration, application/component/directive/route locations, and class-provider shorthand.
- [Hierarchical injectors](https://angular.dev/guide/di/hierarchical-dependency-injection): root environment versus component element scope; provider resolution and overrides; component-owned service destruction; providers versus viewProviders; eager and lazy NgModule scopes.
- [Route.providers](https://angular.dev/api/router/Route#providers): environment injector for the route and its children. Registration alone does not promise a fresh instance on every navigation.
- [Injectable](https://angular.dev/api/core/Injectable): @Injectable() allows DI construction; providedIn controls automatic registration.

The comparison matrix compares only who shares an instance; automatic versus explicit application registration are alternatives within the same scope. A callout exposes local overrides before the syntax sections. Small code examples carry registration syntax; no additional diagram is needed to repeat those mappings. Provider recipes and advanced/custom injector APIs are outside this retrieval job. Empty service/component bodies are scaffolding for syntax examples, not changes to the learner's product exercise.

# Authoring sources

Retrieval job: recover a standalone component/template pair with signal-backed list state and the syntax needed to display and change it. Targets Angular 22; verified 2026-10-30.

- [Component anatomy](https://angular.dev/guide/components): metadata, relative template/style paths, standalone imports and selector composition.
- [Angular signals](https://angular.dev/guide/signals): read/set/update and default equality; deep mutation is not prevented or independently notified.
- [Template bindings](https://angular.dev/guide/templates/binding): interpolation and property bindings; reading signals in templates.
- [Event listeners](https://angular.dev/guide/templates/event-listeners): event-handler syntax.
- [Control flow](https://angular.dev/guide/templates/control-flow): for/track/empty and built-in control flow. Tracking is required; prefer stable unique keys for changing collections, and $index for static collections. Tracking guidance reviewed 2026-11-01.
- [Style guide](https://angular.dev/style-guide): protected template members and readonly references.

Snippets are purpose-built reference examples. Local sample IDs are preview data, not the UUID API model. Compile/render verification is performed in a scratch Angular workspace, separate from the learner exercise.

- [Using components](https://angular.dev/guide/components#using-components): standalone components are directly imported by consuming components; standalone defaults to true from Angular 19. Parent example replaces the former metadata-label table; composition wording reviewed 2026-11-02.

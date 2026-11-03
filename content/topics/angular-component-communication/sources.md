# Authoring sources

Retrieval job: choose an explicit component boundary and recover the syntax for parent/child data, action events and imperative UI methods. Targets Angular 22; drafted 2026-11-02.

- [Inputs](https://angular.dev/guide/components/inputs): required input signals, parent binding, read-only signals versus mutable referenced objects.
- [Outputs](https://angular.dev/guide/components/outputs): typed output emitters and $event payloads; outputs are not browser events or RxJS Observables.
- [Child queries](https://angular.dev/guide/components/queries): signal view queries, required/optional results, view lifetime and conditional children.
- [Component composition](https://angular.dev/guide/components#using-components): parent imports and selectors.
- [Style guide](https://angular.dev/style-guide): UI responsibilities and separation of behavior. Container/presentational boundaries here are contextual design advice, not an Angular-enforced architecture.

The ProductRow example is a self-contained reference with a two-field local Product shape, not a change to the learner exercise. Parent event handling only selects an edit target; it does not implement an editor or HTTP mutation. The final dialog fragment assumes an existing dialog with a public open(Product) method; query availability and required-child preconditions are stated. Detailed form handling and HTTP lifecycle belong to the related topics. No new dependencies or changes to the exercise are required.

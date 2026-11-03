# Authoring sources

Retrieval job: recover reactive-form wiring and choose where validation rules live. Targets Angular 22; reviewed 2026-11-02.

- [Reactive forms](https://angular.dev/guide/forms/reactive-forms): FormGroup/FormControl, ReactiveFormsModule, formControlName and ngSubmit.
- [Validation](https://angular.dev/guide/forms/form-validation): validator placement, errors/touched feedback, disabled native validation and server validation.
- [RequiredValidator](https://angular.dev/api/forms/RequiredValidator), [MaxLengthValidator](https://angular.dev/api/forms/MaxLengthValidator), [PatternValidator](https://angular.dev/api/forms/PatternValidator): attribute directives support reactive controls, not only ngModel.
- [Validators](https://angular.dev/api/forms/Validators): required uses emptiness, regex input retains its matching semantics.
- [FormGroupDirective source](https://github.com/angular/angular/blob/main/packages/forms/src/directives/reactive_directives/form_group_directive.ts): submit forwarding. Installed Angular 22 implementation checked for default prevention on ordinary forms; method=dialog is outside this topic's scope.

Examples are local form previews, not the learner exercise or an HTTP implementation. Only the distinction between field state and request state is noted; API request lifecycle implementation and success-message dismissal remain outside this topic. Supported-attribute validation and TypeScript validation are alternatives, not a required pair. No new diagram is needed for this syntax/placement lookup.

Verification: the exact paired snippets pass strict Angular template compilation in a scratch workspace. Agent-run TestBed checks confirm model required/nonblank/maxlength validation, submit default prevention and rendered result, and equivalent rules attached through template attributes with no model validators. No learner exercise files are changed.

- [Template variables](https://angular.dev/guide/templates/variables): template reference variables on native elements expose the element and its value.
- [HTML Standard — form](https://html.spec.whatwg.org/multipage/forms.html#the-form-element): native submission and validation semantics.
- [NgForm](https://angular.dev/api/forms/NgForm): FormsModule attaches NgForm to ordinary forms; ngNoForm opts out.

The native lookup fragment is compiled separately with no Angular forms imports and a stub load(id) handler; agent-run TestBed checks confirm passing the input text, required-field blocking on button submission and default prevention. It is illustrative and does not change ProductsPage.

Revision 2026-11-02: submission behavior and field-state tracking are complementary decisions. Replaced the dictionary table with the exact FormGroup/template-control wiring, moved the paired reactive example earlier, and consolidated native/Angular submission guidance. ngNoForm excludes both NgForm attachment and NgNoValidate; either forms module otherwise exports the shared no-validation directive. ngNativeValidate preserves native validation while retaining Angular form submission.

- [Native and Angular validation](https://angular.dev/guide/forms/form-validation#interaction-with-native-html-form-validation): Angular normally adds novalidate; ngNativeValidate opts into browser validation.
- Installed Angular 22 forms source (NgForm, NgNoValidate and forms-module exports) checked for selector exclusions and shared directive availability. Native example verified with no forms import and with each forms module in scope, including required blocking and prevented navigation.

Verification 2026-11-02: exact reactive/native snippets compile with strict Angular templates. Fresh TestBed checks pass for model required/nonblank/maxlength rules, template-only equivalent validators, reactive submit default prevention/result, native ngNoForm submission under no imports/FormsModule/ReactiveFormsModule, and FormsModule ngSubmit plus ngNativeValidate preserving required checks. Desktop tables fit; mobile tables/code scroll within their containers without page overflow.

- [Springdoc introduction](https://springdoc.org/intro.html): exports supported Bean Validation annotations, including NotNull/Min/Max/Size, to OpenAPI metadata. The shared-rule note describes an optional schema-to-Angular-validator generator/adapter, not a built-in Angular feature or a guarantee that generated client types enforce runtime rules. Detailed tooling and implementation remain outside this topic.

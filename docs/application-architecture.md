# Engineering Reference MVP Application Architecture and Build Pipeline

## Status

This document defines the accepted application architecture and build pipeline
for the MVP. It implements the decisions in the
[product brief](product-brief.md), [content model](content-model.md),
[content storage representation](content-storage.md), and
[navigation interaction model](interaction-model.md).

It does not define detailed visual design, select a deployment provider, or
implement the application and content generator.

## Decision Summary

Engineering Reference is a single, statically deployed Angular application.
Authored content is validated and converted before the Angular build, then the
generated catalog is imported into the application bundle.

- Angular 22 runs as a standalone, zoneless, client-rendered application.
- Node.js 24 and npm provide the development and build environment.
- The installed TypeScript 6 release must satisfy Angular 22's supported
  version range.
- Strict TypeScript and Angular template checking are enabled.
- The application uses the Angular Router, signals, and a small read-only
  catalog service rather than an external state-management library.
- The content generator uses a typed Markdown abstract-syntax-tree pipeline
  and emits deterministic, ignored build artifacts.
- The browser trusts the internally generated catalog and does not duplicate
  its build-time schema validation.
- Angular's sanitizer remains active when generated HTML is rendered.
- Plain CSS, automated tests, accessibility checks, and one reproducible CI
  command support the initial implementation.

## Framework Baseline

The MVP uses:

- Angular 22;
- Node.js 24;
- a TypeScript 6 release compatible with the selected Angular release;
- npm with a committed `package-lock.json`; and
- the Angular CLI's standard `application` builder.

The exact compatible dependency versions are recorded in `package.json` and
locked by `package-lock.json` when the application is scaffolded. `package.json`
uses ECMAScript modules through `"type": "module"`, declares Angular 22's
supported Node.js 24 range through `engines`, and `.nvmrc` pins the actual
compatible Node.js 24 release used by the project rather than only its major
version.

The application uses standalone components and `bootstrapApplication`; it does
not introduce application NgModules. Angular's strict TypeScript and template
defaults remain enabled.

Angular 22's default zoneless change detection is retained. The application
does not add `zone.js` or `provideZoneChangeDetection`. Router-bound inputs,
signals, computed state, Angular template bindings, and native event handlers
provide the notifications needed to update views.

The application is client-side rendered. Server-side rendering and static
route generation are not required for the MVP. A deployment host must serve
the application shell for direct requests to client-side routes, but the
provider and its rewrite configuration are separate deployment decisions.

## Repository Layout

The repository contains one Angular application at its root:

```text
.
├── .generated/
├── content/
├── contracts/
│   └── runtime-catalog.ts
├── docs/
├── tools/
│   └── content/
│       └── generate.ts
├── src/
│   └── app/
│       ├── app.*
│       ├── app.config.ts
│       ├── app.routes.ts
│       ├── catalog/
│       │   └── catalog.service.ts
│       ├── landing/
│       │   └── landing-page.*
│       └── topic/
│           ├── topic-page.*
│           ├── topic-content.*
│           ├── topic-link-list.*
│           └── topic-not-found.*
├── angular.json
├── package.json
└── package-lock.json
```

Application source is organized by small product feature. Generic `components`,
`services`, or `shared` directories are not created pre-emptively; code moves
to a shared boundary only after a concrete reuse requirement appears.

`contracts/runtime-catalog.ts` is a framework-neutral boundary containing the
`RuntimeCatalog` and `RuntimeTopic` TypeScript types. Both the generator and
Angular application import these types. It contains neither Angular-specific
nor Node.js-specific behavior.

## Content Generation Pipeline

`tools/content/generate.ts` is a TypeScript program executed directly by
Node.js 24:

```json
{
  "scripts": {
    "content:generate": "node tools/content/generate.ts"
  }
}
```

A dedicated generator TypeScript configuration uses `module: "nodenext"` and
enables `erasableSyntaxOnly`, `verbatimModuleSyntax`,
`allowImportingTsExtensions`, and `noEmit`. Generator modules use explicit
`.ts` extensions for relative value imports and `import type` for erased
contracts. The generator is checked with `tsc --noEmit` before execution. These
settings make the source valid for both Node.js 24's type stripping and the
TypeScript gate without requiring a TypeScript runner or a custom Webpack,
esbuild, or Vite configuration.

The generator uses:

- `yaml` to parse YAML source data;
- Zod to validate authored catalog and Topic metadata;
- unified with remark to parse Markdown and the GitHub Flavored Markdown
  extension needed for tables;
- explicit syntax-tree checks for prohibited HTML and unsafe links or images;
  and
- rehype conversion, allowlist sanitization, and serialization to produce
  semantic HTML.

The authored format is deliberately bounded to the semantic constructs listed
in the content storage decision. Understanding additional syntax does not make
it supported: task lists, footnotes, strikethrough, raw HTML, and other
unaccepted constructs fail generation with a clear error. The pipeline does
not generate heading IDs. New constructs require an explicit content-contract
change plus styling, sanitization, and test coverage.

Custom catalog validation enforces UUID identity, references, ordering,
uniqueness, acyclicity, and reachability. The generator reports all discovered
validation errors in one run and exits unsuccessfully when any are present.

### Generated boundary

Generation recreates this ignored directory deterministically:

```text
.generated/
├── catalog.json
└── assets/
    └── topics/
        └── <topic-uuid>/
            └── <readable-name>.<content-hash>.<extension>
```

The generated JSON has the shape defined in the content storage decision and
is type-checked against `RuntimeCatalog`. Angular imports
`.generated/catalog.json` at build time, so the catalog is compiled into the
application bundle rather than fetched as a runtime resource.

Supported Topic images are copied without resizing or optimization for the
MVP. The generator keeps the readable source filename, inserts a deterministic
short SHA-256 content hash before its extension, and rewrites the generated
HTML to the corresponding deployed path, for example:

```text
/assets/topics/<topic-uuid>/queue-operations.<hash>.svg
```

Angular's asset configuration copies `.generated/assets` to `/assets` in the
production output. The content hash changes the URL when an image changes,
allowing long-lived browser caches without serving stale content.

Topic directories are processed in ascending code-point order, and
`topicsById` keys are emitted in ascending UUID order. JSON uses two-space
indentation and one trailing LF. Asset hashes use the first 12 lowercase
hexadecimal characters of the file's SHA-256 digest. These rules define the
canonical output rather than relying on filesystem enumeration order or local
serialization conventions.

PNG and WebP files are data assets. Committed SVG files are treated as trusted,
reviewable project source, like TypeScript and configuration, rather than as
sanitized user content. Supporting content from an untrusted authoring path
would require proper SVG sanitization or rasterization, or removal of SVG
support; simple string checks are not treated as a security boundary.

The generated directory is never committed. Authored content and the generator
remain the source of truth, while local and CI builds recreate the same output.

## Runtime Application Architecture

### Routes

The router defines:

- `/` for the landing view;
- `/topics/:id` for a Topic identified by its stable UUID; and
- a wildcard route for the explicit Topic-not-found view.

The landing and wildcard routes use static router titles of
`Engineering Reference` and `Topic not found | Engineering Reference`.
`TopicPageComponent` supplies `<Topic title> | Engineering Reference` for a
resolved Topic.

Topic titles and storage directory names do not participate in URLs. The host's
SPA fallback must preserve direct and refreshed Topic URLs.

`withComponentInputBinding()` binds the route parameter to a required `id`
input on `TopicPageComponent`. The component derives the selected Topic from
that input and the catalog service, for example with a computed signal. A route
resolver or manual `ActivatedRoute` subscription is unnecessary for this
synchronous lookup.

`withInMemoryScrolling({ scrollPositionRestoration: "enabled" })` starts
forward navigation at the top and restores stored positions on browser-history
navigation. Back restoration focuses the returned view's main heading with
`preventScroll` so focus movement does not overwrite the restored position.

An unknown UUID produces the same explicit not-found presentation as another
unmatched application path. It is not treated as a catalog failure and does not
redirect to the landing page.

### Catalog and state

`CatalogService` imports the generated catalog and exposes read-only operations
for:

- resolving the ordered landing Topics;
- looking up a Topic by UUID; and
- resolving a Topic's ordered child UUIDs to navigable Topic summaries.

The service does not fetch, retry, mutate, or persist catalog data. Generation
and compilation guarantee the internal artifact's schema, so the browser does
not run Zod or another duplicate runtime validator.

All UUID lookups are own-property-safe. The service uses `Object.hasOwn` before
reading a `topicsById` value so arbitrary route strings such as `constructor`,
`toString`, and `__proto__` resolve as unknown Topics rather than inherited
JavaScript object properties.

The Angular Router owns the current addressable Topic selection and browser
history. Signals and computed values hold only local or derived presentation
state. The MVP introduces neither an external state library nor a separate
navigation history derived from the Topic graph.

### Component responsibilities

- `AppComponent` supplies the application shell, visible Home and Back
  controls, and router outlet. It treats Back as unavailable when
  `window.history.length <= 1`; this is a documented browser-history
  approximation rather than a guarantee about the destination.
- `LandingPageComponent` displays the ordered landing Topics.
- `TopicPageComponent` resolves the route input, sets view metadata, and
  composes the selected Topic presentation.
- `TopicContentComponent` renders a Topic's generated main-content HTML.
- `TopicLinkListComponent` renders ordered landing or child Topics as native
  links.
- `TopicNotFoundComponent` provides the explicit unknown-route or unknown-Topic
  view.

This is a starting boundary rather than a mandate to retain one file per small
piece forever. Implementation may combine trivial code when that improves
clarity without mixing responsibilities.

### Generated HTML trust boundary

The build-time pipeline is responsible for validating and allowlist-sanitizing
Topic HTML. Angular treats the catalog as an internal build artifact, but
`TopicContentComponent` still renders it through ordinary `[innerHTML]`
binding. It never calls `bypassSecurityTrustHtml`, so Angular's sanitizer
remains a second line of defense.

Styles for generated semantic elements live in the global stylesheet under a
`.topic-content` namespace. This deliberately handles elements inserted by
`[innerHTML]`, which do not receive Angular's emulated component-scoping
attributes. Other component styles retain normal Angular encapsulation; the
application does not use `::ng-deep` or disable encapsulation globally.

## Styling

The MVP uses plain CSS with CSS custom properties and component-scoped styles.
It does not add Angular Material, another component framework, Tailwind, or a
Sass compilation layer.

Responsive implementation preserves the same content and navigation across
viewports. Topic-content tables and code blocks receive bounded horizontal
overflow without making the full page scroll horizontally.

## Local Development and Builds

Content generation runs once before the Angular development server starts.
The MVP does not watch authored content files. After editing content, a
developer runs `npm run content:generate`; the Angular development server can
then rebuild from the changed generated artifact.

Production builds and CI always generate content before compiling Angular.
The script surface includes, at minimum:

- `content:generate` for validation and deterministic generation;
- type checks for the Angular application and content generator;
- `start` for generation followed by local development;
- `build` for generation followed by a production Angular build;
- `test` and `test:e2e` for automated verification;
- `lint`, `format`, and `format:check`; and
- `check` as the single local equivalent of the required CI workflow.

The exact composition of these scripts is established during scaffolding, but
`npm run check` must cover formatting, linting, application and generator type
checks, content generation and validation, unit/component tests, a production
build, and end-to-end accessibility checks.

## Verification Strategy

The project uses:

- Vitest through Angular's standard test tooling for catalog-service and
  component tests;
- a separate Vitest configuration with a Node environment for generator and
  graph-validation tests;
- Playwright for browser-level navigation and responsive behavior; and
- axe-core through Playwright for automated WCAG 2.2 Level A and AA checks.

`npm test` runs both Vitest configurations. Keeping the generator suite outside
Angular's browser-oriented test builder gives `tools/` its required Node.js
environment and prevents silent test-discovery gaps.

Chromium runs the full end-to-end suite at representative wide and narrow
viewports, including focus and automated accessibility checks. Firefox and
WebKit run a smaller smoke suite covering the landing view, a direct Topic URL,
child navigation, and the not-found view.

Coverage is reported without an initial numeric threshold. Tests explicitly
cover every catalog validation rule, Markdown safety constraints,
deterministic generation, catalog lookup, valid Topic shapes, routing,
navigation, focus behavior, and not-found behavior. Catalog lookup tests
include JavaScript prototype property names. An Angular integration test
verifies that its sanitizer preserves the supported generated elements and
attributes semantically; it does not require byte-identical HTML serialization.

Automated tooling supplements rather than replaces manual keyboard and
assistive-technology review. A manual keyboard and screen-reader pass is
required before the MVP is released.

Formatting uses Prettier. TypeScript and Angular linting use the Angular 22
version of `angular-eslint` with flat configuration. The MVP does not add
Husky, lint-staged, or other local Git hooks.

## Continuous Integration

A GitHub Actions workflow runs for pull requests targeting `main` and pushes
to `main`. It installs Node.js 24, uses `npm ci`, installs the required
Playwright browsers, and executes `npm run check`.

Playwright exercises the compiled production artifact through a static server
configured with an SPA fallback. It does not use Angular's development server
for this gate. Direct Topic requests and refreshed Topic URLs therefore verify
the same hosting behavior required of a deployment.

The workflow begins as one straightforward job so its order and local
equivalent remain easy to understand. It can be split or parallelized later if
measured execution time justifies the extra configuration.

## Failure Behavior

Invalid authored content, unsafe Markdown, an invalid Topic graph, a missing
generated artifact, or type errors fail before a production application
artifact is accepted. Determinism is verified by generating twice from the
same source and comparing the complete output trees.

Because the catalog is imported into the bundle, the application has no
separate runtime catalog request, loading state, catalog-unavailable state, or
Retry action. The deliberate runtime failure case is an unknown Topic or route,
which displays the Topic-not-found view defined by the interaction model.

## Alternatives Considered

### Runtime catalog fetch

Fetching a same-origin JSON file would separate the catalog from the main
bundle, but the small MVP catalog does not need independent loading, retry, or
caching behavior. Importing it produces fewer runtime states and lets a failed
generation or missing artifact stop the build.

### Backend, database, or authentication

The MVP is read-only and its content changes through version control and
deployment. A backend, persistent database, and authenticated user model would
add operational and security surface without supporting an accepted use case.

### Server-side rendering or static route generation

The reference can meet its current navigation, sharing, and responsive-use
requirements as a static client-rendered application. Rendering infrastructure
can be reconsidered if discovery, indexing, or performance measurements later
justify it.

### External state management

The router already represents addressable selection, while the catalog is
immutable and synchronously available. An additional state library would
duplicate these responsibilities for the MVP.

### Custom application or generator bundling

Angular CLI's standard application builder and Node.js 24's direct execution
of erasable TypeScript cover the two build targets. Custom Webpack or another
generator runtime would add configuration without a current requirement.

### UI framework or CSS preprocessor

The initial interface contains a small set of semantic views and controls.
Plain CSS keeps styling decisions visible and avoids adopting a component
system or preprocessing layer before the visual design requires one.

## Follow-up Implementation Slices

Implementation should proceed through independently reviewable issues:

1. scaffold the strict, standalone, zoneless Angular workspace and baseline
   formatting, linting, test, and CI commands;
2. implement the shared runtime contract and deterministic content generator,
   including representative authored content and generator tests;
3. implement routing, the bundled catalog service, application shell, landing
   view, and not-found view;
4. implement Topic content and child navigation, focus and history behavior,
   generated-content styling, and responsive overflow; and
5. complete cross-browser end-to-end, axe, keyboard, and assistive-technology
   verification for the MVP.

Each issue may refine file-level implementation details, but it must preserve
the boundaries and behavior accepted here. Deployment-provider selection and
production deployment remain separate work.

## Deliberately Unresolved

This decision does not select:

- a deployment provider, domain, or hosting rewrite configuration;
- detailed branding, typography, spacing, breakpoints, or visual composition;
- image optimization beyond deterministic copying and cache-busting names; or
- post-MVP capabilities and scaling changes.

These decisions are deferred because the accepted MVP can be scaffolded and
implemented without them.

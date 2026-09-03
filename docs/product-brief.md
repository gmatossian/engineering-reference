# Engineering Reference Product Brief

## Status

The product direction and MVP boundary are defined. Detailed content modeling,
architecture, implementation, and deployment decisions remain in discovery.

## Product Purpose

Engineering Reference is a responsive, read-only web application for quickly
finding and exploring practical software-engineering knowledge.

It addresses a common limitation of compact reference material: showing too
little leaves important operations unclear, while showing every detail at once
makes the reference slow to scan. Engineering Reference presents the smallest
useful answer first and makes deeper material available progressively.

## Intended User

The primary user is a software engineer who needs to recall a concept or common
operation while working, studying, or preparing to discuss technical topics.
The user may know the general subject without remembering the exact interface,
implementation, method, trade-off, or pitfall they need.

## Primary Job

> Help a software engineer quickly find or explore technical reference
> knowledge, beginning with a concise useful answer and allowing progressively
> deeper detail.

The product is a reference browser. It is not a content-management system,
course platform, or learning-progress tracker.

## Experience Principles

### Broad to specific

Users begin with broad technical areas and navigate through progressively
narrower topics. A representative path is:

```text
Java -> Collections -> Queue
```

The navigation model must support a deliberately sparse catalog. Adding a
resource should not require special-case routes, menus, or relationship logic
in application code.

### Concise first

A concept page initially exposes only the information needed for ordinary use.
For example, a Queue reference can lead with:

```text
Interface:       Queue<E>
Implementation:  ArrayDeque<E>
Core methods:    offer, peek, poll
```

Equivalent APIs, alternative implementations, complexity, examples, warnings,
and related concepts belong in deeper sections rather than competing with the
initial answer.

### Progressive disclosure

A concept page shows essential information first and lets users reveal
additional sections—such as examples, alternatives, and complexity—on the same
page. A concept is the smallest independently navigable content resource; its
deeper material is organized into named sections that can be displayed
progressively.

### Read-only presentation

The application displays externally maintained reference content. It does not
provide content authoring or editing controls.

## MVP Scope

### Functional scope

The MVP will provide:

- hierarchical browsing from broad categories to individual concepts;
- concise-first concept pages with progressively disclosed detail;
- generic rendering driven by content rather than resource-specific UI code;
- navigation between parent and child resources; and
- links to related resources when those relationships are present in the
  content model.

The MVP must remain useful through browsing alone. Search is intentionally not
required for the first release.

### Initial content catalog

The initial catalog is deliberately small and Java-focused:

- collections;
- concurrency; and
- array operations.

Queue and List are the first concrete collection concepts used to validate the
content and presentation model. The catalog will grow incrementally in response
to real reference needs; completeness is not an MVP requirement.

Each UI resource is authoritative for its own concise reference content. The
content is purpose-built for this product rather than copied from another
artifact.

### Responsive and accessible use

The same core browsing and reference experience must work on desktop, tablet,
and mobile layouts.

Accessibility is a product requirement, not a final polishing step. Navigation
and progressive disclosure must remain understandable and operable for keyboard
and assistive-technology users. The exact conformance target, validation tools,
and automated accessibility gates remain to be selected before implementation
is considered complete.

### Other quality expectations

The MVP should:

- preserve a consistent information hierarchy across viewport sizes;
- avoid requiring application-code changes for ordinary content additions;
- keep the default branch in a releasable state once implementation begins;
- include verification appropriate to each implemented behavior; and
- handle configuration without exposing secrets or environment-specific data.

Initial product validation may be manual. Analytics and behavioral tracking are
not required to evaluate the MVP.

## Explicit MVP Exclusions

The MVP does not include:

- content creation or editing in the application;
- content-management or collaborative publishing workflows;
- global search;
- recent items, favorites, or usage history;
- personalization or recommendations based on behavior;
- analytics, behavioral tracking, or product metrics;
- quizzes, spaced repetition, or learning-state management;
- a complete software-engineering taxonomy or comprehensive content catalog;
- automated product instrumentation.

## Content Ownership

Engineering Reference owns purpose-built, concise content maintained for the
application. It does not depend on importing or synchronizing content from
other reference formats.

A future resource may link outward to deeper reading, but such links are not
required for the MVP and do not change the application's ownership of its
concise reference content.

## Possible Post-MVP Capabilities

The following remain possibilities rather than commitments:

- global search and direct access to a known concept or section;
- recent items, favorites, or other explicitly justified personal state;
- optional outbound references to deeper material;
- a broader catalog beyond the initial Java topics;
- richer resource relationships and recommendations; and
- usage-informed features, only after their purpose, privacy, and persistence
  have been deliberately decided.

## Unresolved Decisions

The product brief does not settle:

- stable resource identity;
- the complete resource schema and supported content-entry types;
- content storage and file representation;
- taxonomy rules, multiple parents, breadcrumbs, tags, and facets;
- detailed page structure and interaction behavior;
- search indexing and ranking;
- explicit versus derived relationships;
- runtime and distribution model;
- personal-state storage, if personal state is later justified;
- authoring, schema-validation, and link-validation workflow;
- migration and rollout sequencing beyond the initial catalog;
- implementation framework and detailed application architecture;
- deployment approach and environments;
- exact automated engineering and accessibility gates; and
- the criteria for making the repository and its delivery project public.

These decisions should be made in dependency order and recorded explicitly.
They must not be inferred from exploratory implementation.

## MVP Success

The MVP succeeds when a user can browse from a broad Java category to a concept,
understand its ordinary-use essentials quickly, reveal deeper information when
needed, and do so through an accessible, coherent experience on desktop,
tablet, and mobile. It must demonstrate that new content can be added through
the generic model without resource-specific application behavior.

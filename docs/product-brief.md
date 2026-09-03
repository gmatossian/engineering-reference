# Engineering Reference Product Brief

## Status

The product direction, MVP boundary, content model, and content representation
are defined. Detailed architecture, interaction, implementation, and deployment
decisions remain in discovery.

## Product Purpose

Engineering Reference is a responsive, read-only web application for quickly
finding and exploring practical software-engineering knowledge.

It addresses a common limitation of compact reference material: showing too
little leaves important operations unclear, while putting every related topic
on one page makes the reference slow to scan. Engineering Reference presents
concise content for the selected topic and makes narrower topics available
through hierarchical navigation.

## Intended User

The primary user is a software engineer who needs to recall a concept or common
operation while working, studying, or preparing to discuss technical topics.
The user may know the general subject without remembering the exact interface,
implementation, method, trade-off, or pitfall they need.

## Primary Job

> Help a software engineer quickly find or explore technical reference
> knowledge, moving from broad subject areas to concise, increasingly specific
> topics.

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
Topic should not require special-case routes, menus, or relationship logic
in application code.

### Concise and focused

A content-bearing Topic presents all of its concise main content. For example,
a Queue reference can include:

```text
Interface:       Queue<E>
Implementation:  ArrayDeque<E>
Core methods:    offer, peek, poll
```

When material deserves its own focused Topic, it can be represented as an
immediate child Topic. A Queue Topic might therefore link to a separate
Complexity Topic rather than accumulating every adjacent topic in one
document.

### Progressive disclosure

A Topic displays its main content in full and provides an ordered list of its
immediate children. Progressive disclosure happens by navigating to those
increasingly specific Topics, not by hiding sections of the current Topic's
main content.

Some broad Topics, such as Java, may exist only to organize immediate children.
Other Topics may contain main content, children, or both.

### Read-only presentation

The application displays externally maintained reference content. It does not
provide content authoring or editing controls.

## MVP Scope

### Functional scope

The MVP will provide:

- hierarchical browsing from broad categories to individual concepts;
- fully displayed, formatted main content for content-bearing Topics;
- ordered navigation to immediate child Topics;
- generic rendering driven by content rather than Topic-specific UI code;
- stable identity for every Topic; and
- support for broad navigational Topics that do not require main content.

The MVP must remain useful through browsing alone. Search is intentionally not
required for the first release.

### Initial content catalog

The initial catalog is deliberately small. Java is a landing Topic with
immediate children that include:

- Arrays;
- Collections;
- Concurrency; and
- JPA.

Queue and List are the first concrete children of Collections used to validate
the content and presentation model. The landing page can later include other
broad subject areas such as System Design and Algorithms. The catalog will grow
incrementally in response to real reference needs; completeness is not an MVP
requirement.

Each Topic is authoritative for its own concise reference content. The
content is purpose-built for this product rather than copied from another
artifact.

### Responsive and accessible use

The same core browsing and reference experience must work on desktop, tablet,
and mobile layouts.

Accessibility is a product requirement, not a final polishing step. Content and
hierarchical navigation must remain understandable and operable for keyboard
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

A Topic may link outward to deeper reading, but such links are optional and do
not change the application's ownership of its concise reference content.

## Possible Post-MVP Capabilities

The following remain possibilities rather than commitments:

- global search and direct access to a known concept or section;
- recent items, favorites, or other explicitly justified personal state;
- a broader catalog beyond the initial Java topics;
- richer Topic relationships and recommendations; and
- usage-informed features, only after their purpose, privacy, and persistence
  have been deliberately decided.

## Unresolved Decisions

The product brief does not settle:

- detailed taxonomy, breadcrumbs, tags, and facets;
- detailed page structure and interaction behavior;
- search indexing and ranking;
- application runtime packaging and deployment details;
- personal-state storage, if personal state is later justified;
- specific authoring, schema-validation, and link-validation tooling;
- migration and rollout sequencing beyond the initial catalog;
- implementation framework and detailed application architecture;
- deployment approach and environments;
- exact automated engineering and accessibility gates; and
- the criteria for making the repository and its delivery project public.

These decisions should be made in dependency order and recorded explicitly.
They must not be inferred from exploratory implementation.

## MVP Success

The MVP succeeds when a user can browse from a broad landing Topic such as Java
to a specific concept, understand its ordinary-use essentials quickly, navigate
to narrower child Topics when needed, and do so through an accessible,
coherent experience on desktop, tablet, and mobile. It must demonstrate that
new content can be added through the generic model without Topic-specific
application behavior.

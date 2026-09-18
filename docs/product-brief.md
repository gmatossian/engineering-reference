# Engineering Reference Product Brief

## Status

The accepted MVP scope has been implemented and locally validated. Based on
that implementation and the accumulated dogfooding record, the owner has
accepted the MVP as complete. Deployment and production verification are
separate delivery work and are not requirements for MVP completion. The
repository and its delivery project may be public as a work in progress under
the posture below. The accepted interaction behavior is documented in the
[Navigation and Responsive Interaction Model](interaction-model.md), and
the technical boundary is documented in the
[Application Architecture and Build Pipeline](application-architecture.md).
The accepted presentation direction is documented in the
[Visual Design](visual-design.md).

The accepted post-MVP retrieval direction is **Direction C** from the
[Topic findability audit](topic-findability-audit.md): retain broad-to-specific
browsing while adding a Topic finder, an all-Topics browse surface,
classification-aware domain views, path-independent Browse contexts, and
curated Related Topics. These capabilities are delivered incrementally and do
not replace the completed MVP baseline.

## Product Purpose

Engineering Reference is a responsive, read-only web application for quickly
finding, recognizing, and exploring practical software-engineering knowledge.

It addresses a common limitation of compact reference material: showing too
little leaves important operations unclear, while putting every related topic
on one page makes the reference slow to scan. Engineering Reference presents
concise content for the selected Topic and provides several complementary
retrieval paths: broad-to-specific navigation, title search, classified
browsing, and contextual links to narrower or related Topics.

## Intended User

The primary user is a software engineer who needs to recall a concept or common
operation while working, studying, or preparing to discuss technical topics.
The user may know the general subject without remembering the exact interface,
implementation, method, trade-off, or pitfall they need.

## Primary Job

> Help a software engineer quickly retrieve or explore technical reference
> knowledge, whether they know its title, its technical area, its content kind,
> or only a related Topic.

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

### Multiple retrieval paths

Hierarchy remains a useful path, not the complete information architecture.
The same canonical Topic can also be found by title, browsed through one or
more technical domains, distinguished by its primary content kind, reached
through a derived Browse context, or selected from a small curated Related
Topics list.

These paths answer different questions:

- **ordered children** answer “what is narrower here?”;
- **domains** answer “where could I reasonably browse for this?”;
- **content kind** answers “what sort of reference is this?”;
- **Browse contexts** answer “where is this Topic found?”; and
- **Related Topics** answer “what nearby reference is useful next?”.

Classification and relationships improve retrieval without changing Topic
identity or copying canonical content into several locations.

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

## Accepted Product Scope

### Implemented MVP baseline

The completed MVP provides:

- hierarchical browsing from broad categories to individual concepts;
- fully displayed, formatted main content for content-bearing Topics;
- ordered navigation to immediate child Topics;
- generic rendering driven by content rather than Topic-specific UI code;
- stable identity for every Topic; and
- support for broad navigational Topics that do not require main content.

The product remains useful through browsing alone. Search supplements rather
than replaces that path.

### Direction C retrieval expansion

The accepted incremental expansion adds:

- a landing-page Topic finder;
- an addressable all-Topics browse and search surface;
- a deliberately small domain and content-kind classification;
- domain browsing grouped by kind where that improves recognition, beginning
  with System Design;
- path-independent Browse contexts on every Topic; and
- a small, explicitly curated Related Topics region.

The initial finder performs deterministic client-side title matching over the
bundled catalog. It does not require a backend, network request, account,
personalization, analytics, or behavioral tracking. Richer aliases, full-text
ranking, typed relationships, and authored collections require separate
evidence and decisions.

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
and assistive-technology users. The interaction model establishes WCAG 2.2
Level AA as the target, and the application architecture defines the automated
checks and manual verification expected for the MVP.

### Other quality expectations

The product should:

- preserve a consistent information hierarchy across viewport sizes;
- avoid requiring application-code changes for ordinary content additions;
- keep the default branch in a releasable state once implementation begins;
- include verification appropriate to each implemented behavior; and
- handle configuration without exposing secrets or environment-specific data.

Initial product validation may be manual. Analytics and behavioral tracking are
not required to evaluate the MVP.

## Explicit Exclusions

The product does not include:

- content creation or editing in the application;
- content-management or collaborative publishing workflows;
- recent items, favorites, or usage history;
- personalization or recommendations based on behavior;
- analytics, behavioral tracking, or product metrics;
- quizzes, spaced repetition, or learning-state management;
- a complete software-engineering taxonomy or comprehensive content catalog;
- backend, hosted, semantic, or behaviorally ranked search;
- automatically generated Related Topics or recommendations;
- typed relationship graphs and an authored collection system before a
  concrete retrieval need justifies them;
- automated product instrumentation.

## Content Ownership

Engineering Reference owns purpose-built, concise content maintained for the
application. It does not depend on importing or synchronizing content from
other reference formats.

A Topic may link outward to deeper reading, but such links are optional and do
not change the application's ownership of its concise reference content.

## Public Work-in-Progress Posture

The source repository and its delivery project may be public while the product
remains undeployed and is not production-ready. Public availability is for
visibility and feedback only; it does not mean that the product is deployed,
production-ready, open source, or accepting external code contributions.

The repository's proprietary [LICENSE](../LICENSE) governs use of the software.
Before publication, maintainers must audit the full Git history and relevant
GitHub collaboration surfaces, run a dedicated full-history secret scan, resolve
the disposition of personal information, complete the repository and project
messaging, and record an explicit human go/no-go decision. After publication,
maintainers must enable the available repository protections and verify the
public experience while signed out.

## Possible Later Capabilities

The following remain possibilities rather than commitments:

- search aliases, content-text search, richer ranking, and finer-grained links
  to sections within a Topic;
- recent items, favorites, or other explicitly justified personal state;
- a broader catalog beyond the initial Java topics;
- typed Topic relationships, authored ordered collections, and other
  explicitly curated discovery aids; and
- usage-informed features, only after their purpose, privacy, and persistence
  have been deliberately decided.

## Unresolved Decisions

The product brief does not settle:

- remaining implementation details for the accepted visual direction, beyond
  the presentation metadata governed by the content and visual-design
  authorities;
- whether a focused Stitch exercise is useful for the new wide and narrow
  compositions after the information model is accepted;
- deployment packaging and hosting details;
- personal-state storage, if personal state is later justified;
- migration and rollout sequencing beyond the initial catalog;
- deployment approach and environments.

These decisions should be made in dependency order and recorded explicitly.
They must not be inferred from exploratory implementation.

## Product Success

The product succeeds when a user can browse from a broad landing Topic such as
Java, retrieve a known Topic by title without knowing its parent, distinguish
different kinds of references within a domain, understand the context of a
directly opened Topic, and move to narrower or related material. Those journeys
must remain accessible and coherent on desktop, tablet, and mobile, and new
content must continue to use the generic model without Topic-specific
application behavior.

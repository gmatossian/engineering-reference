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

The accepted post-MVP retrieval direction is a **browse-first hybrid**
refinement of Direction C from the
[Topic findability audit](topic-findability-audit.md): make title retrieval and
classification-aware domain browsing the primary discovery paths while
retaining useful broad-to-specific navigation as a secondary curated path.
The complete all-Topics surface, path-independent Browse contexts, and curated
Related Topics complement those entry points. These capabilities are delivered
incrementally and do not invalidate the completed MVP baseline.

## Product Purpose

Engineering Reference is a responsive, read-only web application for quickly
finding, recognizing, and exploring practical software-engineering knowledge.

It addresses a common limitation of compact reference material: showing too
little leaves important operations unclear, while putting every related topic
on one page makes the reference slow to scan. Engineering Reference presents
concise content for the selected Topic and provides several complementary
retrieval paths: title search, classified browsing, broad-to-specific curated
navigation, and contextual links to narrower or related Topics.

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

### Browse first

Users can begin from the title they remember or the technical domain they
recognize. The landing page makes both paths immediately available and keeps
the complete catalog directly reachable. A user does not need to know a
Topic's parent, container Topic, or one canonical taxonomy path before finding
it.

Domain browsing is classification-based rather than a traversal through a
container Topic. Selecting System Design, for example, opens its filtered
browse view, where content kinds make exercises and decision aids recognizable.

### Curated broad-to-specific progression

Ordered child relationships remain useful when they express genuine
progression from a broad reference to narrower material. A representative path
is:

```text
Java -> Collections framework -> Queue
```

This hierarchy is an optional retrieval path rather than the catalog's entry
structure. The navigation model must support a deliberately sparse catalog,
and adding a Topic should not require special-case routes, menus, or
relationship logic in application code.

### Multiple retrieval paths

The same canonical Topic can be found by title, browsed through one or more
technical domains, distinguished by its primary content kind, reached through
a derived Browse context, selected through a useful ordered-child path, or
selected from a small curated Related Topics list. Domain entry and the
complete catalog are primary; persistent title search complements them, while
hierarchy is deliberately secondary.

These paths answer different questions:

- **ordered children** answer “what is narrower here?”;
- **domains** answer “where could I reasonably browse for this?”;
- **content kind** answers “what sort of reference is this?”;
- **Browse contexts** answer “where is this Topic found?”; and
- **Related Topics** answer “what nearby reference is useful next?”.

Classification and relationships improve retrieval without changing Topic
identity or copying canonical content into several locations.

### Discovery direction decision

The accepted presentation is **browse-first hybrid**:

- complete domain entry is the primary landing path;
- compact persistent title search remains available from every view;
- the alphabetical/filterable index is always directly available;
- ordered-child hierarchy remains as secondary curated progression; and
- Topic context and Related Topics provide onward navigation after selection.

A hierarchy-first presentation was rejected because adding search beside the
existing cards would leave parent guessing and mixed container lists visually
dominant. An index/facets-only presentation was rejected because it would
discard useful curated progression and make every exploratory journey begin in
the complete catalog. Pure search-first, pure flat-catalog, and graph/network
navigation are also rejected as primary experiences: each serves fewer of the
accepted retrieval jobs or introduces unnecessary complexity. They can be
reconsidered only with evidence that the browse-first hybrid fails a concrete
job.

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

The product remains useful without search through domain browsing and the
complete catalog. Search complements those browse paths, while ordered-child
navigation remains available where curated progression adds value.

### Direction C retrieval expansion

The accepted incremental expansion adds:

- a compact persistent Topic title search in the application header;
- landing-page entry points for the complete supported domain vocabulary;
- an addressable all-Topics browse and search surface;
- a deliberately small domain and content-kind classification;
- domain browsing grouped by kind where that improves recognition, beginning
  with System Design;
- path-independent Browse contexts on every Topic; and
- a small, explicitly curated Related Topics region.

The initial header search performs deterministic client-side title matching over the
bundled catalog. It does not require a backend, network request, account,
personalization, analytics, or behavioral tracking. Richer aliases, full-text
ranking, typed relationships, and authored collections require separate
evidence and decisions.

### Initial content catalog

The initial catalog is deliberately small. Java remains a curated landing
Topic with immediate children that include:

- Arrays;
- Collections framework;
- Concurrency; and
- JPA.

Queue and List are the first concrete children of Collections framework used
to validate the content and presentation model. The landing page derives its
primary domain entry points from the complete supported domain vocabulary and
presents the catalog's ordered landing Topics as secondary curated paths. The
catalog will grow incrementally in response to real reference needs;
completeness is not an MVP requirement.

Each Topic is authoritative for its own concise reference content. The
content is purpose-built for this product rather than copied from another
artifact.

### Responsive and accessible use

The same core browsing and reference experience must work on desktop, tablet,
and mobile layouts.

Accessibility is a product requirement, not a final polishing step. Content,
search and filter controls, domain browsing, and secondary hierarchical
navigation must remain understandable and operable for keyboard and
assistive-technology users. The interaction model establishes WCAG 2.2 Level
AA as the target, and the application architecture defines the automated
checks and manual verification expected for the MVP.

### Other quality expectations

The product should:

- preserve consistent discovery priorities and information relationships
  across viewport sizes;
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

- exact responsive breakpoints and component-level styling within the accepted
  browse-first wide and narrow compositions;
- whether a focused Stitch exercise would improve those accepted compositions
  without reopening the information model;
- deployment packaging and hosting details;
- personal-state storage, if personal state is later justified;
- migration and rollout sequencing beyond the initial catalog;
- deployment approach and environments.

These decisions should be made in dependency order and recorded explicitly.
They must not be inferred from exploratory implementation.

## Product Success

The product succeeds when a user can retrieve a known Topic by title without
knowing its parent, enter a complete technical domain directly, distinguish
different kinds of references within that domain, follow a useful curated path
such as Java to Collections framework to Queue, understand the context of a
directly opened Topic, and move to narrower or related material. Those
journeys must remain accessible and coherent on desktop, tablet, and mobile,
and new content must continue to use the generic model without Topic-specific
application behavior.

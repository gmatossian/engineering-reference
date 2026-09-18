# Engineering Reference Content Model

## Status

This document defines the accepted content-domain model. It preserves the
implemented MVP Topic identity, content, and ordered-child graph and extends
them with the classification, context, and lateral relationships accepted as
Direction C in the [Topic findability audit](topic-findability-audit.md). The
source and generated representations are defined separately in
[Content Storage and File Representation](content-storage.md), and the accepted
browsing behavior is defined in the
[Navigation and Responsive Interaction Model](interaction-model.md). The
[Application Architecture and Build Pipeline](application-architecture.md)
defines how the model is generated and consumed.

The Direction C fields below are the implemented content contract. The shared
runtime contract, generator, and complete published corpus introduced them
atomically so the catalog does not contain a partially migrated Topic shape.

## Model Overview

The catalog contains an ordered list of secondary curated landing Topics and a
collection of Topics. The application's primary landing-domain entries are
derived from the closed domain vocabulary rather than represented as Topics.
A Topic remains the single navigable content entity; broad subject overviews
and individual concepts do not require different entity types.

The model can be expressed conceptually as:

```text
Catalog
  landingTopicIds: ordered list of UUIDs
  topics: collection of Topic records

Topic
  id: UUID
  title: string
  summary: optional concise plain text
  iconKey: optional supported icon key
  domains: non-empty set of supported domain keys
  kind: supported content-kind key
  mainContent: optional formatted document
  childTopicIds: ordered list of UUIDs
  relatedTopicIds: ordered list of UUIDs
```

This notation describes the domain model only. It does not prescribe how the
catalog is represented in files or loaded by the application.

## Topic Identity

Each Topic receives a UUID when it is created. That UUID:

- is the Topic's stable identity;
- is independent of its title, content, location, and navigation paths;
- does not change when the Topic is renamed, edited, or referenced by another
  parent; and
- is not reused after the Topic is deleted.

The Topic's content has the same meaning regardless of the path used to reach
it. For example, `ConcurrentHashMap` remains one canonical Topic whether
the user reaches it through Collections or Concurrency. Navigation history and
the current path are temporary UI state rather than Topic data.

## Titles

Every Topic has a non-empty title. Titles are display text and are not
identifiers, so they do not need to be globally unique. Two distinct Topics
may both be titled `Complexity` when their content belongs to different
contexts.

## Presentation Metadata

A Topic may define a concise plain-text `summary`. The summary describes the
Topic when it appears in a compact navigational presentation; it is not a
replacement for main content. A summary is optional for the Topic generally,
but every Topic selected for the landing page must define one. Summaries are a
single line, contain at most 160 characters, and are presented as text rather
than interpreted as Markdown or HTML.

A Topic may also select a decorative icon through an `iconKey` from the
application's supported icon vocabulary. The key identifies a reusable visual
concept rather than a file, URL, markup fragment, or unique Topic identity.
Topics may share an icon key. When it is absent, the UI supplies a generic
fallback so navigation never depends on every Topic having a specific icon.

Topic content does not select colors or accent families. Color treatment
belongs to the shared visual and icon system, and must not introduce domain
meaning that the content model does not define.

## Retrieval Classification

Classification is independent of hierarchy. It improves finding and
recognition without changing Topic identity, canonical content, or child
relationships.

### Domains

Every Topic belongs to one or more supported technical domains. Domain
membership answers “where could I reasonably browse for this?” and does not
assert exclusive ownership or a canonical parent.

The initial domain vocabulary is deliberately small and derived from the
published corpus:

| Key | Display label | Scope |
| --- | --- | --- |
| `java` | Java | The Java language, runtime, and general ecosystem |
| `collections` | Collections | Collection APIs, collection choices, and collection-backed structures |
| `concurrency` | Concurrency | Concurrency, parallel execution, coordination, and resource limits |
| `persistence` | Persistence | JPA, ORM, repositories, and application persistence behavior |
| `databases` | Databases | Database systems, SQL, storage, and data-access design |
| `http` | HTTP | HTTP protocol semantics and lookup references |
| `system-design` | System Design | Architecture decisions, estimation, and design exercises |
| `algorithms-data-structures` | Algorithms and data structures | Complexity, algorithms, and language-independent data-structure concepts |

These keys are a closed contract rather than author-defined tags. A Topic can
belong to several domains, such as Java and Collections or Persistence and
Databases. Membership has no authored priority; generated and displayed order
follows the vocabulary above.

Changing the vocabulary is a shared content-contract and interaction decision,
not an ordinary Topic edit.

### Content kind

Every Topic has exactly one primary retrieval-oriented content kind:

| Key | Display label | Meaning |
| --- | --- | --- |
| `area` | Area | An organizing overview such as Java or Databases; not the domain itself or its required gateway |
| `concept` | Concept | An explanatory reference for a principle or behavior |
| `operations` | Operations | API, syntax, task, or lookup material used while doing work |
| `decision-aid` | Decision aid | A comparison, selection guide, or trade-off reference |
| `exercise` | Exercise | An applied problem or case-study container |
| `pattern` | Pattern or technique | A reusable solution shape or engineering technique |

Kind describes how a reader uses the Topic, not its technical domain or visual
style. Every Topic is already a reference, so `reference` is not a useful
kind. A comparison such as offset versus cursor pagination is a decision aid;
a system-design case such as URL shortener is an exercise.

The vocabulary supplies a stable initial grouping order. Extending or changing
it requires reviewing the full corpus and the affected browse experience.

## Main Content

`mainContent` is an optional, ordered, formatted document. When present, it is
non-empty and may use:

- paragraphs and headings;
- strong emphasis, inline code, and code blocks;
- ordered and unordered lists;
- links;
- tables; and
- locally stored images with alternative text.

The content supplies semantic structure; the UI controls its visual
presentation, including placement, typography, alignment, sizing, overflow,
and responsive behavior.

All of a Topic's main content is displayed. Headings can organize a longer
document, but sections are not individually collapsed or progressively
revealed. The main content appears before navigation to immediate children,
and the user can scroll when necessary.

Main content is optional because some Topics exist primarily to organize
navigation. For example, selecting `Java` may display its ordered children
without requiring artificial introductory content.

## Child Relationships

Each Topic owns an ordered list of child Topic UUIDs. The order expresses how its
immediate children should be presented. The parent stores only the UUIDs; the
UI resolves each UUID to the child's canonical title when it constructs a
navigation item. Presentation metadata is resolved from that same canonical
child Topic rather than stored on the relationship.

Child relationships follow these rules:

- a Topic may have no children;
- the same child may be referenced by more than one parent;
- a parent cannot reference the same child more than once;
- a Topic cannot reference itself;
- indirect cycles are not allowed; and
- every referenced UUID must identify an existing Topic.

The resulting hierarchy is a directed acyclic graph rather than necessarily a
strict tree. The application supports navigation from a Topic to its children;
child Topics do not store parent references. Reverse parent context is derived
during generation.

Child relationships remain distinct from domains, content kind, and Related
Topics. They communicate intentional broad-to-specific progression rather than
every useful retrieval path. They are secondary curated relationships: a
Topic's findability never depends on the reader discovering one of its parents.

## Related Topics

Each Topic owns an ordered `relatedTopicIds` list for a small set of curated
lateral links. A Related Topic answers “what nearby reference is useful next?”;
it does not assert containment, domain membership, sequence, or a canonical
parent.

Related relationships follow these rules:

- a Topic may have no Related Topics;
- every referenced UUID identifies an existing Topic;
- a Topic cannot reference itself or the same Related Topic twice;
- list order controls presentation;
- the relationship is directed and is not made reciprocal automatically;
- related relationships may form cycles; and
- related relationships do not make an otherwise empty Topic valid.

The initial relationship is deliberately untyped. Typed edges or automatic
recommendations require a demonstrated presentation or authoring need and a
separate contract change. Authors should not repeat links already exposed as
immediate children or Browse contexts unless the distinct retrieval value is
deliberate and reviewable.

## Browse Collections and Contexts

The initial browse collections are derived views rather than authored content
entities. The all-Topics surface can select a domain and optionally a kind;
landing domain entries link directly to those filtered views, and domain views
can group their members by kind. A named view such as **System Design —
Exercises** is therefore the intersection of accepted classification, not
another parent relationship or duplicated membership list.

There is no authored `collectionIds` field or standalone Collection record in
the initial contract. An explicitly ordered curated collection can be added
later only when a real retrieval need cannot be represented by domain, kind,
hierarchy, or Related Topics.

Browse contexts are generated from canonical data and are the same regardless
of the route used to reach a Topic. They include:

- the Topic's domain memberships;
- its content kind; and
- reverse parent links derived from `childTopicIds`.

Browse contexts are not a breadcrumb and do not select one canonical path.
They may show several valid contexts for a Topic with several parents or
domains. Domain and kind context can link to those individual browse filters;
their intersection remains available by applying both filters on the
all-Topics surface.

## Landing Domains and Curated Topics

The primary landing browse entries represent every supported domain in the
closed vocabulary. They use canonical domain display order and link to the
corresponding filtered all-Topics view. A domain is classification rather than
a Topic, so selecting **System Design** as a domain opens
`/topics?domain=system-design`; it does not require the reader to enter the
canonical `System Design` Area Topic first.

Separately, the catalog owns a non-empty ordered list of Topic UUIDs to display
as secondary curated paths on the landing page. The existing
`landingTopicIds` name remains part of the implemented contract, but membership
does not make those Topics the primary catalog gateways. Being included in this
list is not an intrinsic property of a Topic, so there is no `isRoot` field.

A landing Topic may also appear as another Topic's child. The terms *landing
Topic* and *top-level Topic* therefore describe placement on the landing page,
not a graph-theory root with no parents.

Every curated landing Topic defines a summary for its landing presentation.
This is a catalog-level rule because the requirement depends on where the Topic
is presented rather than on an intrinsic Topic type.

Every Topic appears in the all-Topics index and at least one domain because
domain membership is required. An Area Topic remains an ordinary, directly
addressable Topic and can appear as an explicitly labelled overview result in
each matching domain view. It is not interchangeable with the domain and does
not own that browse collection.

Child-graph reachability from a curated landing Topic is not required: the
hierarchy is one useful secondary retrieval view rather than the complete
information architecture. Landing and child references must still form a valid
directed acyclic graph.

## Valid Topic Shapes

A Topic may contain:

- main content and children;
- main content only; or
- children only.

A Topic with neither main content nor children is invalid because navigating
to it would produce an empty page. Domain membership, kind, Browse contexts,
and Related Topics do not make an otherwise empty Topic valid.

## Illustrative Catalog

The following example demonstrates the model without prescribing the final
catalog:

```text
Curated Landing Topics
├── Java                         children only
│   ├── Arrays                   content, possibly children
│   ├── Collections framework    content and children
│   │   ├── List                 content and children
│   │   └── Queue                content and children
│   │       └── Complexity       content only
│   ├── Concurrency              content and children
│   │   └── ConcurrentHashMap    content only
│   └── JPA                      content, possibly children
├── System Design                content, children, or both
└── Algorithms                   content, children, or both
```

`Java`, `System Design`, and `Algorithms` are ordinary Area Topics that may be
selected as curated landing paths. They remain distinct from the Java, System
Design, and Algorithms and data structures domain entries. Broad organizing
Topics can contain children without main content, while increasingly specific
Topics can provide content, further navigation, or both.

## Catalog Validation

A valid catalog satisfies all of the following:

- at least one landing Topic is declared;
- every Topic has a UUID and a non-empty title;
- summaries, when present, are non-empty single-line plain text of at most 160
  characters;
- icon keys, when present, belong to the supported vocabulary;
- every Topic has at least one supported domain and no duplicate domain;
- every Topic has exactly one supported content kind;
- every landing Topic has a summary;
- every Topic has non-empty main content, at least one child, or both;
- every landing and child UUID resolves to an existing Topic;
- every Topic declares an ordered Related Topics list, which may be empty;
- landing Topics and each Topic's children preserve their declared order;
- no parent contains a duplicate child reference;
- the child graph contains neither self-references nor indirect cycles; and
- every Related Topic UUID resolves, with no self-reference or duplicate in a
  Topic's ordered related list.

## Deliberately Unresolved

This model does not define authored ordered collections, typed relationships,
search aliases, or open-ended tags. Those capabilities require evidence that
the accepted domain, kind, hierarchy, derived collections, and untyped Related
Topics cannot meet.

Storage and application decisions are recorded in their respective documents
without changing the accepted domain semantics above.

# Engineering Reference MVP Content Model

## Status

This document defines the accepted content-domain model for the MVP. The source
and generated representations are defined separately in
[MVP Content Storage and File Representation](content-storage.md); application
architecture and implementation remain separate decisions.

## Model Overview

The catalog contains an ordered list of landing Topics and a collection of
Topics. A Topic is the single navigable content entity; broad subject areas and
individual concepts do not require different entity types.

The model can be expressed conceptually as:

```text
Catalog
  landingTopicIds: ordered list of UUIDs
  topics: collection of Topic records

Topic
  id: UUID
  title: string
  mainContent: optional formatted document
  childTopicIds: ordered list of UUIDs
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

## Main Content

`mainContent` is an optional, ordered, formatted document. When present, it is
non-empty and may use:

- paragraphs and headings;
- inline code and code blocks;
- ordered and unordered lists;
- links;
- tables; and
- locally stored images with alternative text.

The content supplies semantic structure; the UI controls its visual
presentation, including placement, typography, alignment, sizing, overflow,
and responsive behavior.

All of a Topic's main content is displayed. Headings can organize a longer
document, but sections are not individually collapsed or progressively
revealed in the MVP. The main content appears before navigation to immediate
children, and the user can scroll when necessary.

Main content is optional because some Topics exist primarily to organize
navigation. For example, selecting `Java` may display its ordered children
without requiring artificial introductory content.

## Child Relationships

Each Topic owns an ordered list of child Topic UUIDs. The order expresses how its
immediate children should be presented. The parent stores only the UUIDs; the
UI resolves each UUID to the child's canonical title when it constructs a
navigation item such as `{ id, title }`.

Child relationships follow these rules:

- a Topic may have no children;
- the same child may be referenced by more than one parent;
- a parent cannot reference the same child more than once;
- a Topic cannot reference itself;
- indirect cycles are not allowed; and
- every referenced UUID must identify an existing Topic.

The resulting hierarchy is a directed acyclic graph rather than necessarily a
strict tree. The MVP supports navigation from a Topic to its children; child
Topics do not store parent references.

Relationship-specific labels, descriptions, related-topic links, and other
edge metadata are not part of the MVP. If a later use case requires them, the
UUID references can be replaced by richer relationship records without
changing Topic identity.

## Landing Topics

The catalog owns an ordered list of Topic UUIDs to display on the landing page.
Being included in this list is not an intrinsic property of a Topic, so there
is no `isRoot` field.

A landing Topic may also appear as another Topic's child. The terms *landing
Topic* and *top-level Topic* therefore describe placement on the landing page,
not a graph-theory root with no parents.

Every Topic in the MVP catalog must be reachable from at least one landing
Topic.

## Valid Topic Shapes

A Topic may contain:

- main content and children;
- main content only; or
- children only.

A Topic with neither main content nor children is invalid because navigating
to it would produce an empty page.

## Illustrative Catalog

The following example demonstrates the model without prescribing the final
catalog:

```text
Landing Topics
├── Java                         children only
│   ├── Arrays                   content, possibly children
│   ├── Collections              content and children
│   │   ├── List                 content and children
│   │   └── Queue                content and children
│   │       └── Complexity       content only
│   ├── Concurrency              content and children
│   │   └── ConcurrentHashMap    content only
│   └── JPA                      content, possibly children
├── System Design                content, children, or both
└── Algorithms                   content, children, or both
```

`Java`, `System Design`, and `Algorithms` are ordinary Topics selected for the
landing page. Broad organizing Topics can contain children without main
content, while increasingly specific Topics can provide content, further
navigation, or both.

## Catalog Validation

A valid MVP catalog satisfies all of the following:

- every Topic has a UUID and a non-empty title;
- every Topic has non-empty main content, at least one child, or both;
- every landing and child UUID resolves to an existing Topic;
- landing Topics and each Topic's children preserve their declared order;
- no parent contains a duplicate child reference;
- the child graph contains neither self-references nor indirect cycles; and
- every Topic is reachable from at least one landing Topic.

## Deliberately Unresolved

This model does not decide:

- URL structure or routing;
- desktop, tablet, or mobile navigation interactions;
- specific authoring, validation, and migration tooling; or
- post-MVP relationships such as related Topics, tags, and facets.

Those decisions can be made separately without changing the accepted domain
semantics above.

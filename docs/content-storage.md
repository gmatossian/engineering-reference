# Content Storage and File Representation

## Status

This document defines the accepted source and generated content
representations. It preserves the implemented MVP format and specifies the
classification, related-link, and derived-index extensions required by
Direction C. The tools and application integration that implement this
representation are defined in the
[application architecture](application-architecture.md). The deployment
platform and any future authoring interface remain separate decisions.

The Direction C source and runtime fields below are the implemented
representation. They are required for every published Topic and are validated
and generated through the shared contract introduced with the atomic catalog
migration.

## Decision Summary

Content is maintained as static, version-controlled source. Once the
application is deployed, content changes are published by rebuilding and
redeploying it.

- Each Topic is authored as Markdown with YAML front matter.
- Each Topic has its own human-readable directory under `content/topics/`.
- Local image assets live alongside the Topic that owns them.
- `content/catalog.yaml` contains the ordered landing Topic UUIDs.
- The build discovers Topic files rather than relying on a central registry.
- Topic front matter owns domain membership, one content kind, ordered
  children, and ordered curated Related Topics.
- A build-time generator validates the complete catalog, converts Markdown to
  sanitized semantic HTML, copies referenced assets, derives reverse and
  classification indexes, and emits one runtime JSON catalog.
- Angular imports the generated catalog into its application bundle.
- The generated JSON is build output and is not committed.
- The Angular application uses a generic renderer; Topics do not require
  Topic-specific templates or components.

This representation keeps authored content readable and independent of the
application framework while producing simple, deterministic runtime data.

## Source Layout

The source layout is:

```text
content/
├── catalog.yaml
└── topics/
    ├── java/
    │   └── topic.md
    ├── collections/
    │   └── topic.md
    ├── queue/
    │   ├── topic.md
    │   └── queue-operations.svg
    └── queue-complexity/
        └── topic.md
```

The build inspects every direct directory under `content/topics/`, and each one
must contain a `topic.md` file. Topic directories are peers; they do not mirror
the navigation hierarchy because the content model permits a Topic to have
multiple parents.

Directory names are unique, human-readable storage labels. They are not Topic
identifiers, do not appear in relationships, and do not need to change when a
Topic title changes. Contextual names such as `queue-complexity` and
`list-complexity` distinguish directories for Topics whose display titles are
both `Complexity`.

## Catalog Source

`content/catalog.yaml` contains only the ordered landing Topic UUIDs:

```yaml
landingTopicIds:
  - "11111111-1111-4111-8111-111111111111"
```

The file does not list every Topic. Topic discovery supplies the complete
collection, avoiding a duplicated registry that would need to be maintained
for every content change.

`landingTopicIds` must contain at least one UUID. Its order is significant and
controls landing-page presentation. Every UUID must resolve to a discovered
Topic.

## Topic Source

Each `topic.md` begins with YAML front matter containing exactly the Topic
metadata accepted in this document:

```yaml
---
id: "33333333-3333-4333-8333-333333333333"
title: "Queue"
iconKey: "queue"
domains:
  - "java"
  - "collections"
  - "algorithms-data-structures"
kind: "concept"
childTopicIds:
  - "44444444-4444-4444-8444-444444444444"
relatedTopicIds: []
---
```

Six properties are required:

- `id` is the Topic's stable UUID;
- `title` is its non-empty, non-unique display title;
- `domains` is its non-empty set of supported technical-domain keys;
- `kind` is its single supported retrieval-oriented content-kind key;
- `childTopicIds` is its ordered list of immediate child UUIDs; and
- `relatedTopicIds` is its ordered list of curated lateral Topic UUIDs.

Two presentation properties are optional for a Topic generally:

- `summary` is concise landing-card text. It is trimmed, must be a non-empty
  single line of at most 160 characters, and is treated as plain text rather
  than Markdown or HTML. Complete-catalog validation requires it for every
  Topic referenced by `landingTopicIds`.
- `iconKey` selects a decorative icon from the supported vocabulary. It is a
  registry key rather than a filename, URL, or markup fragment. When omitted,
  the UI supplies its generic icon fallback.

The supported icon keys are `java`, `architecture`, `algorithm`, `database`,
`array`, `collection`, `conversion`, `copy`, `creation`, `deque`, `heap`, `list`,
`map`, `operations`, `priority`, `queue`, `set`, `complexity`, `concurrency`,
`equality`, `ordering`, and `persistence`. Topics may reuse a key. Extending this
closed vocabulary is a deliberate shared-contract change rather than an ordinary
content edit.

The supported domain keys, in canonical generated and display order, are
`java`, `collections`, `concurrency`, `persistence`, `databases`, `http`,
`system-design`, and `algorithms-data-structures`. Source membership order is
not meaningful; generation normalizes it to this shared order. Every Topic has
at least one domain and cannot repeat a domain key.

The supported content-kind keys, in grouping order, are `area`, `concept`,
`operations`, `decision-aid`, `exercise`, and `pattern`. Every Topic has exactly
one kind. The [content model](content-model.md) defines their semantics and
display labels.

`childTopicIds` remains present as `[]` for a Topic with no children. Requiring
the field distinguishes an intentional leaf from accidentally incomplete
metadata and gives every generated Topic the same predictable relationship
shape.

`relatedTopicIds` likewise remains present as `[]` when no curated lateral
link is intended. Its order controls presentation. References are directed and
are not made reciprocal automatically; related cycles are valid, while
missing, duplicate, and self references are rejected.

The Markdown body after the front matter is the optional `mainContent`. When a
body is present, it must contain meaningful content. A Topic with no body is
valid only when `childTopicIds` is non-empty.

### Navigation-only Topic

`content/topics/java/topic.md` can contain only metadata:

```markdown
---
id: "11111111-1111-4111-8111-111111111111"
title: "Java"
summary: "Core language, collections, concurrency, and persistence concepts."
iconKey: "java"
domains:
  - "java"
kind: "area"
childTopicIds:
  - "22222222-2222-4222-8222-222222222222"
relatedTopicIds: []
---
```

### Topic with content and children

`content/topics/queue/topic.md` can contain both formatted content and a child
reference:

````markdown
---
id: "33333333-3333-4333-8333-333333333333"
title: "Queue"
iconKey: "queue"
domains:
  - "java"
  - "collections"
  - "algorithms-data-structures"
kind: "concept"
childTopicIds:
  - "44444444-4444-4444-8444-444444444444"
relatedTopicIds: []
---

A queue processes elements in a defined order.

![Elements entering and leaving a queue](./queue-operations.svg)

## Core operations

```java
queue.offer(value);
queue.peek();
queue.poll();
```
````

### Content-only Topic

`content/topics/queue-complexity/topic.md` can contain a table and an explicit
empty child list:

```markdown
---
id: "44444444-4444-4444-8444-444444444444"
title: "Complexity"
iconKey: "complexity"
domains:
  - "collections"
  - "algorithms-data-structures"
kind: "concept"
childTopicIds: []
relatedTopicIds: []
---

| Operation | Typical complexity |
| --- | --- |
| `offer` | O(1) |
| `peek` | O(1) |
| `poll` | O(1) |
```

The examples use recognizable UUIDs for readability. Production Topics receive
normally generated UUIDs.

## Supported Markdown

The [content-authoring guide](content-authoring.md) defines how to use the supported
syntax to produce concise, scannable Topics.

The source format supports:

- paragraphs and headings;
- strong emphasis, inline code, and fenced code blocks;
- ordered and unordered lists;
- external HTTPS links;
- tables; and
- local images.

Raw HTML is not an authoring escape hatch. It is rejected so that the source
format retains a bounded semantic contract. The generated HTML is sanitized as
a defense-in-depth measure before it reaches the application.

During generation, fenced code blocks and tables are placed inside predictable
`topic-content-overflow` presentation wrappers. Each wrapper is a labelled,
keyboard-focusable region that owns horizontal scrolling; the semantic `pre`,
`code`, and `table` elements remain intact inside it.

An authored external link must begin with the canonical lowercase `https://`
scheme. Other spellings and protocols are rejected so that the validated HTML
can pass through the sanitizer without its meaning changing.

Inline navigation to another Topic is also excluded. Internal Topic navigation
is represented by stable UUID relationships in `childTopicIds` and
`relatedTopicIds`; domain and reverse-parent navigation is derived by the
generator. Relative links to Topic files and application routes are invalid
because storage paths and routes are not stable Topic identity.

## Images

A Topic references an owned image using a relative Markdown path:

```markdown
![Elements entering and leaving a queue](./queue-operations.svg)
```

The MVP permits SVG, PNG, and WebP assets. Each image:

- is stored in the same directory as its `topic.md`;
- is checked into version control;
- has meaningful, non-empty alternative text;
- has a readable filename before the extension that begins with an ASCII letter
  or digit and otherwise contains only ASCII letters, digits, dots, hyphens, and
  underscores;
- is referenced by a relative path from that Topic; and
- is copied into the application assets during generation.

Remote images and base64-encoded image data are not allowed. Text-based diagram
languages and diagram rendering are also excluded from the MVP; a completed
diagram can instead be committed as an ordinary supported image.

Committed SVG files are trusted, reviewable project source rather than
sanitized user content. If a future authoring path accepts untrusted content,
SVG must be properly sanitized or rasterized, or removed from the supported
formats; partial string checks are not a sufficient security boundary.

The generator copies images unchanged for the MVP and rewrites references to
`/assets/topics/<topic-uuid>/<readable-name>.<content-hash>.<extension>`. The
deterministic short SHA-256 content hash provides cache busting. Image resizing
and optimization are not part of the MVP pipeline.

## Generated Runtime Catalog

The generator emits a single JSON document for the deliberately small catalog.
Its conceptual shape is:

```json
{
  "landingTopicIds": [
    "11111111-1111-4111-8111-111111111111"
  ],
  "allTopicIds": [
    "22222222-2222-4222-8222-222222222222",
    "11111111-1111-4111-8111-111111111111"
  ],
  "topicIdsByDomain": {
    "java": [
      "22222222-2222-4222-8222-222222222222",
      "11111111-1111-4111-8111-111111111111"
    ],
    "collections": [
      "22222222-2222-4222-8222-222222222222"
    ],
    "concurrency": [],
    "persistence": [],
    "databases": [],
    "http": [],
    "system-design": [],
    "algorithms-data-structures": []
  },
  "topicIdsByKind": {
    "area": [
      "11111111-1111-4111-8111-111111111111"
    ],
    "concept": [
      "22222222-2222-4222-8222-222222222222"
    ],
    "operations": [],
    "decision-aid": [],
    "exercise": [],
    "pattern": []
  },
  "parentTopicIdsById": {
    "11111111-1111-4111-8111-111111111111": [],
    "22222222-2222-4222-8222-222222222222": [
      "11111111-1111-4111-8111-111111111111"
    ]
  },
  "topicsById": {
    "11111111-1111-4111-8111-111111111111": {
      "title": "Java",
      "summary": "Core language, collections, concurrency, and persistence concepts.",
      "iconKey": "java",
      "domains": ["java"],
      "kind": "area",
      "mainContentHtml": null,
      "childTopicIds": [
        "22222222-2222-4222-8222-222222222222"
      ],
      "relatedTopicIds": []
    },
    "22222222-2222-4222-8222-222222222222": {
      "title": "Collections",
      "summary": null,
      "iconKey": "collection",
      "domains": ["java", "collections"],
      "kind": "concept",
      "mainContentHtml": "<p>Collections group and organize objects.</p>",
      "childTopicIds": [],
      "relatedTopicIds": []
    }
  }
}
```

`topicsById` is an unordered registry keyed by stable Topic UUID. The key is the
serialized identity, while the values contain the data needed for generic
rendering and navigation. `landingTopicIds`, each `childTopicIds`, and each
`relatedTopicIds` list preserve authored order. Topic domain arrays follow the
canonical domain-vocabulary order.

`allTopicIds`, each classification index, and each reverse-parent list are
derived. Topic lists in those indexes use case-insensitive title order with the
UUID as a deterministic tie-breaker. The domain and kind maps contain every
supported key, including an empty array when the current catalog has no member.
The application can intersect these indexes to produce domain-and-kind browse
collections without an authored collection registry.

Every generated Topic contains `title`, `summary`, `iconKey`,
`domains`, `kind`, `mainContentHtml`, `childTopicIds`, and `relatedTopicIds`.
Optional source presentation metadata is emitted as explicit `null`, giving
every generated Topic a predictable shape. `mainContentHtml` is likewise
explicitly `null` for a navigation-only Topic; an empty string is invalid.

The single-file runtime representation is emitted as
`.generated/catalog.json` and imported into the Angular bundle. It therefore
introduces no separate catalog request or runtime loading state. The generator
can later emit a manifest and per-Topic files without changing any authored
source.

## Build-Time Processing

Content generation performs these steps before the Angular application is
built:

1. Read `content/catalog.yaml`.
2. Discover every `content/topics/*/topic.md` file.
3. Parse and validate YAML front matter and Markdown bodies.
4. Index Topics by UUID and validate the complete child and related graphs.
5. Validate links and local image references.
6. Convert supported Markdown to semantic HTML.
7. Sanitize the generated HTML.
8. Copy referenced images with content-hashed names and rewrite their output
   paths.
9. Derive the alphabetical, classification, and reverse-parent indexes.
10. Emit the deterministic runtime JSON catalog.

The same generator and validation path runs locally, in CI, and as a required
dependency of the application build. Content changes therefore require a commit
and rebuild; once the application is deployed, publishing those changes also
requires redeployment. No backend, database, or runtime content service is
required.

The generated JSON is not committed. Authored Markdown, YAML, and image assets
are the only content source of truth. Excluding derived output prevents noisy
duplicate diffs and eliminates discrepancies between a committed generated
file and the artifact produced by the actual build.

## Validation Policy

Generation fails when it encounters:

- missing, unknown, or malformed catalog or Topic properties;
- an empty `landingTopicIds` array;
- a direct Topic directory without a `topic.md` file;
- an invalid or duplicate UUID;
- a missing or blank title;
- a blank, multiline, or overlong summary;
- an unsupported icon key;
- a missing, empty, duplicate, or unsupported domain membership;
- a missing or unsupported content kind;
- a landing Topic without a summary;
- a missing or non-array `childTopicIds` value;
- a missing or non-array `relatedTopicIds` value;
- a Topic with neither meaningful main content nor children;
- a missing landing or child Topic reference;
- a duplicate child reference, self-reference, or indirect cycle;
- a missing, duplicate, or self-referential Related Topic reference;
- raw HTML or an internal file, route, or Topic link;
- a noncanonical external link or an unsupported or unsafe link protocol;
- a missing image, unsupported image type, unsafe image filename, or image
  without alternative text;
  or
- unsuccessful content generation.

External HTTPS link syntax and protocol are validated without making network
requests. Third-party availability must not determine whether the application
can be built.

Determinism is a generator verification concern rather than an authored-content
validation error. Automated tests generate twice from the same source and
compare the complete output trees under the canonical ordering, serialization,
and hashing rules defined by the application architecture.

The application architecture selects the schema, Markdown, sanitization, and
test tool families. Those tools must enforce this same policy in local
development, CI, and production builds.

## Alternatives Considered

### JSON or YAML records containing main content

Structured records are direct to parse but make prose, code examples, tables,
and longer documents awkward to author and review. Embedding Markdown or HTML
as multiline values also produces noisier diffs than a Markdown document.

### Raw HTML with separate metadata

HTML provides precise markup control but exposes more syntax and security
surface than the accepted content requires. It also makes semantic consistency
and public review harder.

### Structured content blocks

A typed syntax tree would provide a strong schema and allow Angular to render
each block as a component. It would also make the source format and generic
renderer substantially more complex without an MVP requirement for that
control.

### Angular templates or components per Topic

Topic-specific application code provides maximum presentation flexibility but
violates the requirement that ordinary content additions need no
Topic-specific application logic.

### Central Topic registry

A registry mapping every UUID to a source path would duplicate discoverable
information and require another edit for each Topic addition or location
change. Build-time discovery keeps the catalog source focused on global browse
configuration. Classification and reverse-parent indexes are generated from
canonical Topic front matter rather than maintained as duplicate source.

### Runtime Markdown parsing

Shipping Markdown to the browser would add parser code and defer content errors
until runtime. Build-time conversion produces validated, deterministic HTML and
a simpler application.

### One generated file per Topic

Per-Topic runtime files can reduce the initial payload for a large catalog, but
they introduce multiple requests, loading states, and caching decisions. A
single catalog is simpler for the small MVP and can be split later without
changing source files.

### Committed generated output

Committing the runtime JSON would show the exact generated text in reviews but
would duplicate source content and could drift from the output of the actual
build. Deterministic on-demand generation provides stronger consistency.

## Deliberately Unresolved

This decision does not select:

- deployment infrastructure;
- a graphical or in-application authoring interface; or
- authored ordered collections, typed relationships, or search aliases.

The application architecture records the resolved implementation choices.
Any later capability that changes the accepted source representation or
content semantics requires another explicit contract decision rather than an
inferred metadata extension.

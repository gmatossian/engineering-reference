# Engineering Reference MVP Visual Design

## Status and authority

This document defines the accepted visual direction for the MVP. It translates
the [product brief](product-brief.md), [content model](content-model.md), and
[navigation and responsive interaction model](interaction-model.md) into an
implementation-facing presentation system.

The selected concepts were produced in the
[Engineering Reference Stitch project](https://stitch.withgoogle.com/projects/13144856373965085344?pli=1)
and accepted during [issue #33](https://github.com/gmatossian/engineering-reference/issues/33).
The reference images below preserve the selected visual direction. They are
not pixel-perfect specifications, and their synthetic copy and invented UI do
not override the repository's governing product documents.

The raw Stitch export and generated HTML are exploratory inputs. They are not
versioned, are not application source, and must not be copied into the Angular
application wholesale.

## Direction summary

Engineering Reference uses a contemporary digital card-catalog direction. It
should feel calm, purposeful, and unmistakably interactive while retaining the
clarity and authority of a carefully maintained technical reference.

The direction was selected because it:

- gives a deliberately sparse catalog enough visual structure without adding
  product functionality;
- distinguishes primary landing destinations from child navigation;
- uses typography and iconography to improve recognition and hierarchy;
- supports both short navigation-only Topics and dense content-bearing Topics;
  and
- avoids resembling a word-processing document, generic dashboard, terminal,
  or documentation-site template.

## Visual foundations

### Color

The base palette is warm and restrained:

| Role | Reference value | Use |
| --- | --- | --- |
| Canvas | `#fbf9f4` | Page background |
| Card | `#ffffff` | Navigational cards, rows, and bounded content surfaces |
| Primary text | `#1b1c19` | Headings and primary labels |
| Secondary text | `#46474b` | Supporting text |
| Hairline | `#e5e0d5` | Borders and dividers |
| Strong outline | `#76777b` | Focus and emphasized boundaries where appropriate |

The concepts use restrained accent families for broad areas:

- cobalt for languages and runtimes;
- forest green for architecture and systems;
- warm ochre for algorithms and theory;
- terracotta for storage and databases; and
- indigo for web and networking.

Accents belong on icons, narrow rules, borders, and subtle tinted surfaces.
Large saturated fills are not part of this direction. Color must not be the
only way an item communicates its meaning or state.

The visual role of these accent families is accepted. Their data
representation remains an implementation prerequisite rather than an implicit
addition to the current Topic model.

### Typography

Typography supplies much of the interface's hierarchy:

| Role | Preferred family | Character |
| --- | --- | --- |
| Application identity and headings | Plus Jakarta Sans | Distinctive, compact, and contemporary |
| Body and navigation | Inter | Neutral and readable at interface and reference densities |
| Code | JetBrains Mono | Reserved for authored code and inline technical notation |

The page title, introductory copy, Topic titles, supporting text, and body
content must remain visibly distinct through size, weight, line height, and
spacing. Tiny uppercase metadata is not part of the product. Font loading and
fallback strategy are implementation details and must preserve performance and
readability.

### Spacing, shape, and depth

- Use an 8-pixel base rhythm, with 4-pixel increments for fine alignment.
- Prefer restrained radii: approximately 4 pixels for small controls and 8
  pixels for cards and rows.
- Separate surfaces primarily with spacing, hairline borders, and small
  contrast changes.
- Use only subtle shadows. Clickable landing cards may lift by approximately 2
  pixels on hover when motion preferences allow it.
- Keep a generous but bounded central canvas. Prose should retain a readable
  line length while tables, code blocks, and images may use the wider content
  measure.

## Application shell

The header is compact and persistent across views:

- **Home** is the Engineering Reference identity and application mark.
- **Back** remains visible and retains the browser-history behavior defined by
  the interaction model. It is presented as unavailable when it has no
  destination.
- The landing reference omits Back, but implementation must preserve the
  visible unavailable state required by the interaction model.

Do not add global Topic shortcuts, an `INDEX` destination, breadcrumbs, search,
filters, profile controls, or secondary navigation. The terminal-like mark in
some desktop concepts is illustrative; the open-book mark in the mobile
concepts better expresses a reference product. Final vector execution belongs
to implementation and must not introduce an external UI framework implicitly.

## Landing presentation

The landing page begins with:

- the `Engineering Reference` title;
- the subtitle `Concise technical knowledge for software engineering.`; and
- the action hint `Choose a topic to explore.`

Landing Topics are presented as equal-weight cards in catalog order. Cards use
equal dimensions within a layout row so size does not imply importance,
popularity, or hierarchy. The whole card is one native Topic link containing:

- a decorative Topic icon;
- the Topic title;
- concise supporting text; and
- a navigation chevron.

At spacious widths, the cards form a three-column grid. The same ordered list
may reflow through two columns before becoming a single column on narrow
screens. Exact thresholds should be chosen from where the content stops fitting
comfortably, not from device names.

Supporting text is part of the accepted visual direction but not the current
Topic domain model. Its authoring and runtime representation must be decided
before implementation; it must not be supplied by a hard-coded application
mapping.

## Topic presentation

A Topic view preserves the order required by the interaction model:

1. Topic title;
2. complete main content, when present; and
3. ordered immediate-child navigation, when present.

### Navigation-only Topics

Children use compact, uniform, full-width rows rather than landing cards. Each
row is one native link containing a decorative icon, the child title, and a
navigation chevron. Rows do not include descriptions, sequence numbers,
classification codes, or relationship metadata.

Every Topic should display an icon when represented in navigation. Icons may
be reused, and the UI must provide a generic fallback when a specific icon is
not available. The display behavior is accepted; the source and runtime
representation of a Topic's icon must be settled through the content-model and
storage authorities before implementation.

### Content-bearing Topics

Main content uses the same typography, surfaces, and spacing as the surrounding
application while retaining the semantic structure supplied by authored
Markdown. Generic presentation may style headings, prose, lists, links, images,
code, and tables. It must not infer Topic-specific components such as warning
cards, diagrams, status badges, or operation matrices from a Topic's identity.

The Queue concepts demonstrate density, hierarchy, and responsive behavior.
Their text, diagram, bespoke callout cards, copy action, and technical labels
are synthetic design material rather than canonical content or required UI.

Code blocks and tables use their generated, labelled
`topic-content-overflow` regions. Those regions own horizontal scrolling and
remain keyboard focusable; the page itself must not gain horizontal overflow.
Images scale within the content area without losing their alternative text or
semantic placement.

## Interaction states

- Cards and rows must look actionable before interaction; a chevron alone is
  not the only affordance.
- Hover may adjust the border, surface, elevation, and chevron position without
  causing disruptive layout movement.
- Keyboard focus must use a clearly visible high-contrast outline with
  sufficient separation from the component boundary.
- Active states may reduce elevation or darken the surface slightly.
- Interaction motion should be short and restrained, and
  `prefers-reduced-motion` must be respected.
- Touch targets should be at least 44 by 44 CSS pixels even when their visible
  icon is smaller.

## Responsive behavior

Responsive layouts preserve content, order, semantics, and navigation:

- landing cards move from a multi-column grid to one full-width card per row;
- child navigation remains a vertical list of full-width rows;
- typography and spacing reduce proportionally without becoming cramped;
- Topic main content follows normal vertical document flow;
- wide code and tables scroll inside their own bounded regions; and
- neither bottom navigation nor custom swipe navigation is introduced.

Tablet layouts interpolate between the accepted desktop and mobile references.
They do not introduce a third interaction model, a sidebar, or an off-canvas
navigation drawer.

## Accessibility requirements

- Cards and rows retain native link semantics and coherent accessible names.
- Topic icons are supplementary to visible titles and therefore hidden from
  assistive technology.
- The application mark and icon buttons receive appropriate accessible names.
- Text and essential boundaries must meet the project's WCAG 2.2 Level AA
  target.
- Meaning and state cannot depend on color, iconography, hover, or motion alone.
- Zoom, reflow, browser-history focus behavior, and bounded overflow continue
  to follow the interaction model.

## Explicit prototype exclusions

The reference screens contain exploratory details that must not become product
requirements. Exclude:

- catalogue, specification, system, or module identifiers;
- child sequence numbers and counts;
- `INDEX`, Java, or Queue shortcuts in the global header;
- technical footer labels and version numbers;
- Topic-specific profile, copy, filter, search, or status controls;
- badges, tags, taxonomic chips, timestamps, and classification metadata;
- swipe instructions and custom swipe behavior; and
- synthetic Queue content and bespoke content components.

When a reference image and this document disagree, this document and the
governing product documents prevail.

## Implementation prerequisites

Before implementing the accepted concepts, refine and record how the generic
content pipeline represents:

- an optional specific Topic icon with a generic fallback;
- landing-card supporting text; and
- broad accent-family selection, if retained.

These decisions must preserve generic rendering and ordinary content additions
without Topic-specific Angular code. They require deliberate changes to the
content-model, source-storage, validation, runtime-contract, and generator
authorities rather than an undocumented UI-only mapping.

## Reference screens

The screenshots are durable visual references rendered from the selected
Stitch concepts. They contain synthetic content and some explicitly excluded
prototype details described above.

### Landing

[![Desktop landing reference](design/reference/landing-desktop.png)](design/reference/landing-desktop.png)

[![Mobile landing reference](design/reference/landing-mobile.png)](design/reference/landing-mobile.png)

### Navigation-only Topic

[![Desktop navigation-only Topic reference](design/reference/navigation-topic-desktop.png)](design/reference/navigation-topic-desktop.png)

[![Mobile navigation-only Topic reference](design/reference/navigation-topic-mobile.png)](design/reference/navigation-topic-mobile.png)

### Content-bearing Topic

[![Desktop content-bearing Topic reference](design/reference/content-topic-desktop.png)](design/reference/content-topic-desktop.png)

[![Mobile content-bearing Topic reference](design/reference/content-topic-mobile.png)](design/reference/content-topic-mobile.png)

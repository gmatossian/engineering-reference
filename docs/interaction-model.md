# Engineering Reference Navigation and Responsive Interaction Model

## Status

This document defines the accepted navigation and responsive interaction model.
It preserves the implemented MVP behavior and extends it with the browse-first
persistent title search, classified domain entry, Browse contexts, and Related Topics defined as
the refined Direction C in the [product brief](product-brief.md), building on
the evidence and original recommendation in the
[Topic findability audit](topic-findability-audit.md). It also builds on the
[content model](content-model.md) and the
[content storage representation](content-storage.md). Its implementation
boundaries are defined in the
[application architecture](application-architecture.md).

Detailed presentation decisions are defined separately in the
[Visual Design](visual-design.md). This document remains authoritative for
navigation behavior, responsive semantics, and accessibility expectations. It
does not define deployment infrastructure.

The Direction C interactions below are accepted target behavior. The bundled
runtime data foundation is implemented, while the application continues to
provide the completed MVP behavior until the bounded UI slices are implemented
and verified. This document authorizes those follow-ups; it does not imply that
the data-foundation change has shipped the new interactions.

## Interaction Summary

Engineering Reference is a conventional addressable web experience:

- the landing page initially provides every supported domain and secondary
  curated Topic paths;
- the application header provides persistent title search and an All topics
  link from every view;
- selecting a landing domain opens its shareable filtered `/topics` view;
- the all-Topics view supports deterministic title search plus domain and kind
  browsing without a runtime request;
- selecting a curated landing Topic, child Topic, or result replaces the
  current view with that Topic's view at every viewport size;
- every Topic has a directly addressable URL;
- Topic views expose path-independent Browse contexts and curated Related
  Topics;
- Home returns to the landing page;
- Back follows actual browser history rather than navigating to a Topic's
  conceptual parent;
- child Topics and external destinations use native link semantics;
- navigation uses the same model on desktop, tablet, and mobile; and
- accessibility targets WCAG 2.2 Level AA.

The application does not use modal Topic views, canonical breadcrumbs, custom
swipe navigation, or a separate application-specific navigation history.

## Landing View

Opening the application at its root URL displays a browse-first discovery
surface. No Topic or domain is selected automatically. In semantic document
order it provides:

1. the product introduction;
2. a labelled **Browse by domain** region containing every supported domain in
   canonical vocabulary order; and
3. a quieter **Curated paths** region containing the ordered landing Topics
   from the generated catalog.

The compact application-header search is the single title-search entry point.
Submitting a non-empty query navigates to `/topics?q=<query>`. Whitespace is
trimmed before navigation. Submitting an empty query opens `/topics` or, when
already on the index, removes only its query while preserving active filters.
The search does not show an autocomplete popup, maintain private history, or
request data from a server.

Each domain entry is a native link to `/topics?domain=<key>`. Domain entries are
derived from the complete closed vocabulary rather than from Area Topics or
`landingTopicIds`; every supported domain therefore remains reachable even
when it has no same-named overview Topic. Selecting a domain starts the
all-Topics view at the top and applies its normal focus behavior. Its visible
Topic count is derived from the bundled domain index and is informative rather
than a ranking or importance signal.

Curated paths preserve useful broad-to-specific progression without defining
the complete catalog. Each ordered landing Topic remains a native link to its
canonical `/topics/<uuid>` view and uses its canonical title and summary. A
curated path can have the same visible Topic title as a domain label, but its
**Curated paths** region and supporting text distinguish the direct Topic
overview from the classified domain browse link.

The landing view is a deliberate starting point rather than a permanently
visible navigation panel. The application does not retain its domain entries
or curated paths in a persistent sidebar.

Domain entries and curated Topics use native link semantics. Domain order
follows the vocabulary; curated Topic order follows `landingTopicIds`.

The application shell provides the search and an All topics link on landing,
Topic, index, and not-found views so retrieval remains available without
returning Home first. Home and Back retain their existing meanings.

## Topic View

A selected Topic view presents, in semantic document order:

1. the Topic title;
2. a compact Browse contexts region containing its kind, domain links, and
   derived parent links;
3. its complete main content, when present;
4. its ordered immediate children, when present; and
5. its ordered Related Topics, when present.

This produces the following valid presentations:

- a navigation-only Topic displays its title, Browse contexts, and children;
- a content-only Topic displays its title, Browse contexts, and main content
  without an empty child-navigation region; and
- a Topic with content and children retains complete main content before its
  ordered child navigation.

The application does not collapse sections of a Topic's main content.
Progressive disclosure occurs by navigating to immediate child Topics.

Immediate children are genuine links even if visual design later presents them
as rows or another navigational form. Their labelled region communicates
**Narrower topics** or another equally clear broad-to-specific relationship;
it is secondary to the Topic's content and not presented as the route required
to find those Topics. Native link semantics preserve keyboard operation, URL
previews, and the user's ability to open a Topic in another tab or window.

Browse contexts are derived from canonical classification and reverse-parent
data. Domain and kind labels link to their corresponding individual `/topics`
browse filters; both filters can be applied to reach their intersection.
Parent labels link to canonical Topic URLs. Several contexts can be displayed,
and none is presented as the one canonical path or as the route the user took.

Related Topics are genuine Topic links in authored order. They remain visually
and semantically distinct from narrower children and Browse contexts. The
region is omitted when the list is empty; the UI does not invent links from
shared domains, kinds, or browsing behavior.

## Topic Navigation

Selecting an immediate child replaces the current Topic view with the child's
Topic view. This behavior is consistent across desktop, tablet, and mobile.

The selected child starts at the top of its view. Navigation does not open a
modal, drawer, or secondary pane, and there is no dismiss action or sibling
next/previous control.

A Topic's meaning does not depend on the route used to reach it. If the same
Topic is reachable through more than one parent, its directly addressed view
is the same in every case.

## All-Topics Browse and Search

`/topics` is an addressable browse surface over the bundled catalog. It
contains:

- one labelled title-search input in the persistent application header;
- labelled domain and content-kind filters;
- a visible way to clear the query and filters; and
- Topic result links that show title, kind, and domain context.

The default unconstrained state lists every Topic in case-insensitive title
order, with the UUID as a deterministic tie-breaker for duplicate titles.

An initial domain view with no query or kind filter separates matching
`area` Topics into a labelled **Overviews** region before the remaining
results. Each overview remains a canonical Topic result whose visible Area
kind and domain context distinguish it from the domain view itself. A domain
with no matching Area Topic omits the region.

After Overviews, the initial System Design domain view groups the remaining
Topics by the accepted non-Area kind order, preserving alphabetical order
inside each group. Other initial domain views keep their remaining results in
one flat alphabetical list. A kind filter, a query, or both always produce one
flat result list, including any matching Area Topic, so the user is not
required to inspect empty or fragmented groups. Expanding non-Area grouping to
another domain requires evidence that it improves recognition there.

### Matching and ordering

The initial header search searches titles only. It trims surrounding whitespace and
uses case-insensitive substring matching. It does not search UUIDs, rendered
content, domains, kinds, aliases, or browsing behavior.

Non-empty search results use these deterministic relevance tiers:

1. an exact title match;
2. titles beginning with the complete query; and
3. titles containing the query elsewhere.

Results within a tier use case-insensitive title order and then UUID. Domain
and kind filters are intersections, not additional ranking signals.

The initial search deliberately favors predictable known-title retrieval over
fuzzy matching, spelling correction, synonym expansion, or full-text ranking.
Observed misses can justify a later alias or search-contract change.

### Filter and result behavior

The query uses `q`, domain uses `domain`, and kind uses `kind` in the `/topics`
query string. Query and filter changes update the current history entry rather
than adding one entry per keystroke or selection. The resulting URL remains
shareable and refreshable. The `q` value is trimmed and removed when empty;
unsupported domain or kind values are removed during normalization. An
unmatched but otherwise valid title query produces a normal no-results state.

Changing search or filters does not move keyboard focus, scroll the page, or
replace the current view. A polite status message reports the result count.
The no-results presentation retains the controls, names the active constraints,
and provides a visible clear action; it is not an error or not-found route.

Topic results use native links. Selecting one performs normal history-producing
navigation to its canonical `/topics/<uuid>` URL and applies the Topic focus
behavior below.

## Home and Back

The application provides visible Home and Back controls.

Home navigates to the landing view. It does not infer a root or parent from the
current Topic.

Back performs the browser's actual backward-history action. It means
"previous view," not "parent Topic," and may therefore return to:

- the Topic or landing view visited immediately before the current view;
- another application page reached earlier in the browser history; or
- a page outside Engineering Reference.

When no previous browser-history entry exists, Back has no destination and is
presented as unavailable. `window.history.length <= 1` is the
practical test for this condition. It is a browser-history approximation rather
than a guarantee about the identity of a preceding destination. The application
does not construct a separate history stack or reinterpret Back using the Topic
graph.

The application does not display a canonical breadcrumb. Because a Topic may
have multiple parents and domains, a single breadcrumb would imply an authority
the model does not have. Browse contexts instead expose all relevant derived
parents and classifications without depending on navigation history.

## URLs and Browser Behavior

The landing view uses `/`. The complete browse surface uses `/topics` and its
optional `q`, `domain`, and `kind` query parameters. Every Topic continues to
use `/topics/<uuid>`, where the UUID is its stable identity. Static route
matching distinguishes `/topics` from the UUID route. This scheme supports:

- opening a Topic directly;
- refreshing without losing the selected Topic;
- sharing a URL that opens the same Topic; and
- normal browser Back and Forward behavior.

Selecting a Topic performs normal history-producing navigation. Refreshing a
Topic URL does not require knowledge of the route previously used to reach it.

The browser document title reflects the displayed view:

- landing view: `Engineering Reference`;
- all-Topics view: `All topics | Engineering Reference`;
- Topic view: `<Topic title> | Engineering Reference`; and
- unknown Topic: `Topic not found | Engineering Reference`.

## Scroll and Focus Behavior

Forward navigation to a newly selected Topic starts at the top of that Topic
and moves keyboard focus to its main heading. This makes the change of view
apparent to keyboard and assistive-technology users.

Forward navigation to the all-Topics view likewise starts at the top and moves
focus to its main heading. The persistent search remains in the preceding
application-navigation landmark and is not focused automatically. Query or
filter updates keep focus on the control the reader is operating and announce
only the updated result count.

Back restores the preceding view's prior scroll position where the browser
supports restoration. Focus moves to the returned view's main heading using
`preventScroll`, so the focus change does not replace the restored scroll
position. The application does not store the previously activated link solely to
restore focus to that exact element.

Focus is never deliberately left on an element removed by navigation.

## Responsive Behavior

The same content, ordering, controls, and navigation behavior are available on
desktop, tablet, and mobile. Responsive layouts may rearrange or resize their
presentation, but they do not introduce different navigation models or remove
functionality.

On narrow layouts, the header search collapses to a labelled control that
expands a full-width field within the header; index filter controls stack in
document order; and grouped results remain under their headings. Browse contexts remain
before Topic main content. Wide layouts may place the context region beside
main content only when CSS preserves its semantic order and a logical keyboard
sequence. Related Topics and narrower children remain distinct labelled
regions at every width.

The page content reflows without page-wide horizontal scrolling at narrow
viewport widths. Inherently two-dimensional content, specifically code blocks
and tables, may scroll horizontally within its own bounded container so it can
remain complete and readable.

The application does not implement custom swipe-left or swipe-right navigation.
Platform and browser-native gestures remain unaffected.

The visual design defines the accepted layout direction, spacing, typography,
and content-width principles. Exact implementation thresholds should follow
content fit while preserving the behavior defined here.

## External Links

External HTTPS links in Topic content use native link behavior and open in the
current browsing context by default. The application does not force a new tab
or window. Users retain normal browser mechanisms for choosing another
context.

## Catalog and Failure States

The generated catalog is imported into the Angular application at build time.
There is no separate runtime catalog request, initial catalog-loading state,
catalog-unavailable state, or Retry action. Invalid or missing catalog output
fails generation or the application build rather than becoming a user-facing
runtime condition.

Topic navigation is local and does not show per-Topic loading indicators.
Title search, filtering, Browse contexts, and Related Topics are also computed
from the bundled catalog and do not introduce loading, retry, or offline error
states.

### Topic not found

If a directly addressed Topic identifier does not resolve in the bundled
catalog, the application displays an explicit Topic-not-found view. It does not
silently redirect to the landing page. The wildcard route uses the same view.
Home remains available, and Back retains its normal browser-history meaning.

The not-found view uses a clear main heading and the document title
`Topic not found | Engineering Reference`.

## Accessibility Expectations

The product targets
[WCAG 2.2 Level AA](https://www.w3.org/TR/WCAG22/#conformance-reqs) across its
responsive presentations.

At minimum, the interaction must provide:

- complete keyboard operation without pointer-only behavior;
- semantic landmarks and a coherent heading hierarchy;
- native links for Topic and external-link navigation;
- explicitly labelled native search and filter controls;
- programmatically associated kind and domain context for browse results;
- status announcements for result-count changes without announcing the full
  result list;
- visible focus indicators;
- programmatic focus movement after view replacement;
- an accessible Topic-not-found presentation;
- meaningful alternative text for content images, as required by the content
  representation;
- usable zoom and reflow behavior; and
- controls and link targets that remain operable on touch screens.

Automated checks can support these expectations, but they do not replace
keyboard and assistive-technology review.

## Representative Flows

### Browse a domain from the landing page

```text
Landing -> System Design domain -> Exercises -> URL shortener
```

Selecting System Design opens `/topics?domain=system-design`, not the System
Design Area Topic. The domain view starts at the top with focus on its main
heading and separates its overview, operations, decision aids, and exercises.
Selecting URL shortener then opens its canonical Topic URL.

### Follow a curated broad-to-specific path

```text
Landing -> Curated paths: Java -> Collections framework -> Queue
```

Each Topic selection replaces the current view, updates the URL and document
title, starts the new Topic at the top, and moves focus to its main heading.
This remains a useful path, but Queue is also independently reachable by title
and domain browsing.

### Return through history

After the curated path above, Back returns to Collections framework and
restores its prior scroll and focus position when possible. A second Back
returns to Java. This behavior is derived from browser history, not from Queue
or Collections framework storing one canonical parent.

### Open a Topic directly

Opening a Queue URL directly displays the same Queue content and immediate
children as reaching it through Collections framework. Its Browse contexts
explain its domains and parent Topics without reconstructing the route taken.
Home provides a path to the landing page; Back follows whatever actual browser
history preceded the direct visit.

### Find a known Topic

Submitting `Choosing storage` from the persistent header search opens the all-Topics view
with that query represented in the URL. The exact title match appears before
any broader substring matches. Selecting it opens the canonical Topic URL and
moves focus to the Topic heading.

### Browse a domain by kind

Opening the System Design domain view groups its Topics by content kind when no
query or kind filter is active. The System Design Area Topic appears first as a
clearly labelled overview result rather than as the gateway to the domain.
Exercises are distinguishable from operations and decision aids by visible
headings and labels rather than icon or color alone.

### Load an invalid Topic URL

An unknown Topic identifier displays the Topic-not-found view without changing
the URL or pretending the failure is an empty catalog.

## Deliberately Unresolved

This interaction model does not decide:

- exact responsive breakpoints and font-delivery strategy;
- component-level styling beyond the accepted browse-first wide and narrow
  compositions and the constraints recorded here and in the visual design;
- deployment infrastructure.

The resolved implementation choices are recorded in the application
architecture. Remaining choices must preserve the interaction and
accessibility behavior defined above. Canonical breadcrumbs, modal Topic
navigation, custom swipe navigation, and an application-specific history stack
remain outside the accepted product unless a later product decision explicitly
introduces them.

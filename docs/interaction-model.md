# Engineering Reference MVP Navigation and Responsive Interaction Model

## Status

This document defines the accepted navigation and responsive interaction model
for the MVP. It builds on the [product brief](product-brief.md), the
[content model](content-model.md), and the
[content storage representation](content-storage.md). Its implementation
boundaries are defined in the
[application architecture](application-architecture.md).

Detailed presentation decisions are defined separately in the
[MVP Visual Design](visual-design.md). This document remains authoritative for
navigation behavior, responsive semantics, and accessibility expectations. It
does not define deployment infrastructure.

## Interaction Summary

The MVP is a conventional addressable web experience:

- the landing page initially shows the ordered landing Topics with no Topic
  selected automatically;
- selecting a landing or child Topic replaces the current view with that
  Topic's view at every viewport size;
- every Topic has a directly addressable URL;
- Home returns to the landing page;
- Back follows actual browser history rather than navigating to a Topic's
  conceptual parent;
- child Topics and external destinations use native link semantics;
- navigation uses the same model on desktop, tablet, and mobile; and
- accessibility targets WCAG 2.2 Level AA.

The MVP does not use modal Topic views, breadcrumbs, custom swipe navigation,
or a separate application-specific navigation history.

## Landing View

Opening the application at its root URL displays the ordered landing Topics
from the generated catalog. No landing Topic is selected automatically.

The landing view is a deliberate starting point rather than a permanently
visible navigation panel. Selecting a landing Topic replaces it with the
selected Topic's view. The application does not retain the landing Topics in a
persistent sidebar.

Landing Topics use native link semantics. Their eventual visual treatment may
change without changing their navigation behavior or ordering.

## Topic View

A selected Topic view presents, in order:

1. the Topic title;
2. its complete main content, when present; and
3. its ordered immediate children, when present.

This produces the following valid presentations:

- a navigation-only Topic displays its title followed by its children;
- a content-only Topic displays its title and main content without an empty
  child-navigation region; and
- a Topic with both displays its title, main content, and then its children.

The application does not collapse sections of a Topic's main content.
Progressive disclosure occurs by navigating to immediate child Topics.

Immediate children are genuine links even if visual design later presents them
as cards or another navigational form. Native link semantics preserve keyboard
operation, URL previews, and the user's ability to open a Topic in another tab
or window.

## Topic Navigation

Selecting an immediate child replaces the current Topic view with the child's
Topic view. This behavior is consistent across desktop, tablet, and mobile.

The selected child starts at the top of its view. Navigation does not open a
modal, drawer, or secondary pane, and there is no dismiss action or sibling
next/previous control in the MVP.

A Topic's meaning does not depend on the route used to reach it. If the same
Topic is reachable through more than one parent, its directly addressed view
is the same in every case.

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
presented as unavailable. For the MVP, `window.history.length <= 1` is the
practical test for this condition. It is a browser-history approximation rather
than a guarantee about the identity of a preceding destination. The application
does not construct a separate history stack or reinterpret Back using the Topic
graph.

The MVP does not display breadcrumbs. Because a Topic may have multiple
parents, a breadcrumb would describe a particular route taken rather than a
canonical Topic hierarchy.

## URLs and Browser Behavior

The landing view uses `/`. Every Topic uses `/topics/<uuid>`, where the UUID is
its stable identity. This scheme supports:

- opening a Topic directly;
- refreshing without losing the selected Topic;
- sharing a URL that opens the same Topic; and
- normal browser Back and Forward behavior.

Selecting a Topic performs normal history-producing navigation. Refreshing a
Topic URL does not require knowledge of the route previously used to reach it.

The browser document title reflects the displayed view:

- landing view: `Engineering Reference`;
- Topic view: `<Topic title> | Engineering Reference`; and
- unknown Topic: `Topic not found | Engineering Reference`.

## Scroll and Focus Behavior

Forward navigation to a newly selected Topic starts at the top of that Topic
and moves keyboard focus to its main heading. This makes the change of view
apparent to keyboard and assistive-technology users.

Back restores the preceding view's prior scroll position where the browser
supports restoration. Focus moves to the returned view's main heading using
`preventScroll`, so the focus change does not replace the restored scroll
position. The MVP does not store the previously activated link solely to
restore focus to that exact element.

Focus is never deliberately left on an element removed by navigation.

## Responsive Behavior

The same content, ordering, controls, and navigation behavior are available on
desktop, tablet, and mobile. Responsive layouts may rearrange or resize their
presentation, but they do not introduce different navigation models or remove
functionality.

The page content reflows without page-wide horizontal scrolling at narrow
viewport widths. Inherently two-dimensional content, specifically code blocks
and tables, may scroll horizontally within its own bounded container so it can
remain complete and readable.

The MVP does not implement custom swipe-left or swipe-right navigation.
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

### Topic not found

If a directly addressed Topic identifier does not resolve in the bundled
catalog, the application displays an explicit Topic-not-found view. It does not
silently redirect to the landing page. The wildcard route uses the same view.
Home remains available, and Back retains its normal browser-history meaning.

The not-found view uses a clear main heading and the document title
`Topic not found | Engineering Reference`.

## Accessibility Expectations

The MVP targets
[WCAG 2.2 Level AA](https://www.w3.org/TR/WCAG22/#conformance-reqs) across its
responsive presentations.

At minimum, the interaction must provide:

- complete keyboard operation without pointer-only behavior;
- semantic landmarks and a coherent heading hierarchy;
- native links for Topic and external-link navigation;
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

### Browse from the landing page

```text
Landing -> Java -> Collections -> Queue
```

Each selection replaces the current view, updates the URL and document title,
starts the new Topic at the top, and moves focus to its main heading.

### Return through history

From Queue, Back returns to Collections and restores its prior scroll and
focus position when possible. A second Back returns to Java. This behavior is
derived from browser history, not from Queue or Collections storing a parent.

### Open a Topic directly

Opening a Queue URL directly displays the same Queue content and immediate
children as reaching it through Collections. Home provides a path to the
landing page; Back follows whatever actual browser history preceded the direct
visit.

### Load an invalid Topic URL

An unknown Topic identifier displays the Topic-not-found view without changing
the URL or pretending the failure is an empty catalog.

## Deliberately Unresolved

This interaction model does not decide:

- exact responsive breakpoints and font-delivery strategy;
- implementation details for the accepted visual direction;
- deployment infrastructure.

The resolved implementation choices are recorded in the application
architecture. Remaining choices must preserve the interaction and
accessibility behavior defined above. Breadcrumbs, modal Topic navigation,
custom swipe navigation, and an application-specific history stack are outside
the MVP unless a later product decision explicitly introduces them.

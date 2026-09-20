# Browser behavior catalog

The authored content in this directory is a deterministic browser-test fixture.
It exists to express application behaviors such as search ranking, graph-projected
navigation, repeated DAG paths, related links, generated-content layout, heading
outlines, focus, history, responsiveness, and accessibility without coupling those
tests to the evolving reference catalog.

The fixture deliberately uses the production source format and generator. During
`npm run test:e2e`, the normal content pipeline generates the normal runtime catalog
from `e2e/fixtures/content`, and Angular serves the unchanged application. The test
runner restores the production generated catalog after Playwright exits. A separate
`@real-catalog` test runs against the production build and is the only browser test
intended to depend on the real generated catalog.

Keep this fixture small and behavior-oriented. Add or change an entry only when a
browser journey requires a stable graph or rendered-content shape; content-contract
correctness belongs in `tools/content/*.spec.ts`.

# Engineering Reference

A responsive, progressively disclosed reference for practical software engineering concepts.

The accepted product, interaction, architecture, content, and
[visual-design direction](docs/visual-design.md) are maintained as
version-controlled project documentation.

## Status

The Engineering Reference MVP is complete and locally validated. The project
remains an active work in progress: it is not yet deployed or production-ready.
This repository is shared for visibility and feedback.

The project is proprietary and is not accepting external code contributions.
See [LICENSE](LICENSE).

Maintainers authoring content should follow the
[content-authoring guide](docs/content-authoring.md) so Topics remain concise and
easy to scan.

## Development

### Requirements

- Node.js 24.20.0 (see `.nvmrc`)
- npm 11.19.0

### Initial setup

```bash
npm ci
npx playwright install chromium firefox webkit
```

### Commands

| Command                    | Purpose                                                         |
| -------------------------- | --------------------------------------------------------------- |
| `npm start`                | Generate content, then start the Angular development server.    |
| `npm run build`            | Generate content, then create an optimized production build.    |
| `npm run content:generate` | Validate authored content and recreate the runtime catalog.     |
| `npm test`                 | Run the Angular and Node unit-test suites.                       |
| `npm run test:e2e`         | Build the application and run the Playwright browser matrix.    |
| `npm run lint`             | Run ESLint against application, test, and configuration files.  |
| `npm run format`           | Format managed files with Prettier.                             |
| `npm run format:check`     | Check formatting without modifying files.                       |
| `npm run check`            | Run the complete local equivalent of the CI quality gate.       |

Run the local verification required by the
[AI-assisted development profile](docs/ai-assisted-development.md) before
opening or updating a pull request. GitHub Actions runs `npm run check` against
every pull-request revision.

### Browser verification

`npm run test:e2e` builds the production application, then runs application-
behavior tests against a small deterministic catalog in `e2e/fixtures/content`.
That catalog passes through the same content generator and application import
as production content; it is not a second runtime loading path. A separate
`@real-catalog` smoke test serves the production build through the static SPA
fallback and proves that the real generated catalog loads and is navigable.

Chromium runs the complete fixture-backed browser suite. Firefox and WebKit run
the fixture tests tagged `@smoke`, covering the landing page, search and
filtering, a direct Topic URL, child and related navigation, narrow hierarchy
behavior, and the not-found view. After Playwright exits, the runner restores
the production generated catalog for subsequent development commands.

To run one configured browser project while investigating a failure:

```bash
npm run test:e2e -- --project=firefox
```

Run `npm run check` before review to execute the complete local equivalent of
the CI quality gate.

The completed MVP verification included the following manual checks. Repeat the
applicable checks for later changes that affect these behaviors:

- use only the keyboard to move through the landing page, Topic links, Back,
  Home, and any overflowing code or table region;
- verify narrow-screen and browser-zoom reflow without page-level horizontal
  scrolling; and
- use VoiceOver with Safari to check headings, navigation landmarks, link
  names, route-change focus, and the not-found view.

Record the revision, operating system, browser, result, and any finding or
follow-up in the relevant issue or pull request. Automated axe checks supplement
this pass; they do not replace it.

## Development workflow

Engineering Reference uses the project-local
[AI-assisted development profile](docs/ai-assisted-development.md) for task
readiness, authority, verification, review, and durable handoff. Agent entry
points route to the same profile so that different tools follow one local
operating model.

## License

This software is proprietary and published publicly for visibility and feedback
only. No open-source or other license is granted, and all rights are reserved.
See [LICENSE](LICENSE).

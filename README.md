# Engineering Reference

A responsive, progressively disclosed reference for practical software engineering concepts.

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

`npm run test:e2e` builds the production application and serves it through the
same static SPA fallback used by the CI gate. Chromium runs the complete
browser suite. Firefox and WebKit run the tests tagged `@smoke`, covering the
landing page, a direct Topic URL, child navigation, and the not-found view.

To run one configured browser project while investigating a failure:

```bash
npm run test:e2e -- --project=firefox
```

Run `npm run check` before review to execute the complete local equivalent of
the CI quality gate.

Before an MVP release, also perform a manual pass against a production build:

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

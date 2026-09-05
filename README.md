# Engineering Reference

A responsive, progressively disclosed reference for practical software engineering concepts.

## Development

### Requirements

- Node.js 24.20.0 (see `.nvmrc`)
- npm 11.19.0

### Initial setup

```bash
npm ci
npx playwright install chromium
```

### Commands

| Command                | Purpose                                                    |
| ---------------------- | ---------------------------------------------------------- |
| `npm start`            | Start the Angular development server.                      |
| `npm run build`        | Create an optimized production build.                      |
| `npm test`             | Run the Angular and Node unit-test suites.                  |
| `npm run test:e2e`     | Build the application and run Playwright browser tests.    |
| `npm run lint`         | Run ESLint against application, test, and configuration files. |
| `npm run format`       | Format managed files with Prettier.                        |
| `npm run format:check` | Check formatting without modifying files.                  |
| `npm run check`        | Run the complete local equivalent of the CI quality gate.  |

Run the local verification required by the
[AI-assisted development profile](docs/ai-assisted-development.md) before
opening or updating a pull request. GitHub Actions runs `npm run check` against
every pull-request revision.

## Development workflow

Engineering Reference uses the project-local
[AI-assisted development profile](docs/ai-assisted-development.md) for task
readiness, authority, verification, review, and durable handoff. Agent entry
points route to the same profile so that different tools follow one local
operating model.

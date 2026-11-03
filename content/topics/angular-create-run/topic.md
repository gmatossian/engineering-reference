---
id: '5dd196fa-28a4-4a60-9aaf-26553d7067ec'
title: 'Create and run an Angular app'
status: 'accepted'
summary: 'Create an Angular workspace, generate components, locate key files, and recover run, test, and build commands.'
iconKey: 'operations'
domains:
  - 'javascript'
kind: 'operations'
childTopicIds:
  - 'f7aa760f-30aa-43da-8746-20a39e39529e'
  - '8f0eac15-f8c7-4a92-80bb-0c45ff6b4e87'
  - '6b2a1c19-acaa-4793-9e8a-7a783564bde5'
  - '64c227ae-34fd-4c0d-bd8d-668c56205fc1'
relatedTopicIds:
  - 'b35c83b3-ae4d-405b-a06c-21bc3d24bfd5'
---

## Create the skeleton

Run from the **existing backend project root**. This creates a separate Angular
workspace in `ui/`, beside `pom.xml` and the backend's `src/`.

```bash
node --version
npx @angular/cli@22 new products-ui --directory ui \
  --routing=false --ssr=false --style=css --skip-git --defaults
cd ui
```

For Angular 22, **Node 24.x must be 24.15.0 or newer**. Other supported Node
lines are listed in Angular's [version compatibility table](https://angular.dev/reference/versions).

| Option                        | Effect                                                           |
| ----------------------------- | ---------------------------------------------------------------- |
| `--directory ui`              | Workspace folder; the Angular project name remains `products-ui` |
| `--routing=false --ssr=false` | One-page client-rendered starting point                          |
| `--skip-git`                  | Keep the existing repository; do not initialize another          |

Standalone components are **the default**. Dependencies are **installed during creation**.

## Run, test, build

Run from **`ui/`**, containing `package.json` and `angular.json`.

```bash
# Develop — port 4201
npm start -- --port 4201

# Develop with an existing API proxy file
npm start -- --port 4201 --proxy-config src/proxy.conf.json

# Test once
npm test -- --watch=false

# Production build → dist/
npm run build

# Restore locked dependencies
npm ci
```

Development serves `http://localhost:4201` and **reloads after edits**.
The production build creates files; it **does not deploy**.

`npm start` uses the workspace's CLI. **4200 is the default**; use another port
when it is occupied. Stop the development server with `Ctrl+C`.

> **Creating the proxy file does not enable it.** Pass `--proxy-config` when
> starting the server, or set `serve.options.proxyConfig` in `angular.json`.
> Restart after changing proxy configuration.

If an API request returns **`200 OK` with the app's HTML instead of JSON**,
check that the proxy is enabled and matches the request path. `HttpClient`
reports a JSON parsing error even though the HTTP status is successful.

## Generate a component

Run from **`ui/`**:

```bash
npx ng generate component \
  products/product-list --flat
```

**Short form:** `ng g c` means `ng generate component`.

```text
src/app/products/
├── product-list.ts
├── product-list.html
├── product-list.css
└── product-list.spec.ts
```

- **`--flat`:** keep files directly in `products/`. Omit it to create a
  `products/product-list/` directory.
- **`--dry-run`:** preview generated files **without writing changes**.

Add the standalone component to its parent's **`imports`**, then use its
**selector** in the parent template. Generation **does not embed the component
or move existing HTML/CSS**.

## Where to edit

| File inside `ui/`           | Responsibility                          |
| --------------------------- | --------------------------------------- |
| `src/app/app.{ts,html,css}` | **Root component**                      |
| `src/app/app.config.ts`     | Application-wide **providers**          |
| `src/main.ts`               | **Bootstrap** the app                   |
| `angular.json`              | **Build, serve and test** configuration |

These are the default concise filenames; older projects may use
`app.component.ts` and `app.component.html`.

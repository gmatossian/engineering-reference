# Authoring sources

Verified against Angular's official documentation on 2026-10-29; commands target Angular CLI 22.

- [ng new](https://angular.dev/cli/new): workspace name versus directory, standalone default, routing, SSR, CSS, defaults and skip-git options.
- [Installation](https://angular.dev/installation): creation installs dependencies; generated npm start script.
- [Version compatibility](https://angular.dev/reference/versions): supported Node lines; Angular 22 with Node 24 requires ^24.15.0.
- [Workspace file structure](https://angular.dev/reference/configs/file-structure): bootstrap, app config and default concise component filenames.
- [ng serve](https://angular.dev/cli/serve): port selection and development serving.
- [ng test](https://angular.dev/cli/test): watch=false for one test run.
- [ng build](https://angular.dev/cli/build): production build and output directory.
- [npm ci](https://docs.npmjs.com/cli/v11/commands/npm-ci): lockfile-based clean installation.

- [ng generate component](https://angular.dev/cli/generate/component): component filenames, standalone default, flat layout and generated tests. Checked 2026-10-30 against the learner project's Angular CLI 22.2.5; a flat component dry run produced TypeScript, HTML, CSS and spec files without creating them.
- [ng generate](https://angular.dev/cli/generate): generate/g alias and dry-run preview option.
- [Importing and using components](https://angular.dev/guide/components/importing): parent imports and template selector for standalone composition.

- [Serving Angular apps for development](https://angular.dev/tools/cli/serve): explicit proxyConfig setup and restart requirement. Reviewed 2026-11-01. Local debugging confirmed a server started without proxy configuration returned the Angular HTML document for GET /products with HTTP 200; Gabriel confirmed restarting with --proxy-config resolved the issue.

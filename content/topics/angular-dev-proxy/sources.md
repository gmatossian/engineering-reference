# Authoring sources

Verified on 2026-10-29. Example targets @angular/build:dev-server and the existing Spring API's /products routes.

- [Serving Angular apps for development](https://angular.dev/tools/cli/serve#proxying-to-a-backend-server): JSON proxy configuration, CLI option, restart requirement, and current /path/** matching semantics.
- [ng serve](https://angular.dev/cli/serve): proxy-config and port CLI options.
- [MDN: Cross-Origin Resource Sharing](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS): browser-origin boundary when contacting the backend directly.
- Diagram adapted from docs/design/diagrams/starter.svg; embedded font data and licenses preserved. Diagram shows request direction only; responses return through the proxy.

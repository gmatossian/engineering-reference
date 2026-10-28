# Handle API errors in Spring — authoring sources

Retrieval job: map failures reaching Spring MVC to deliberate HTTP statuses and
a consistent response body. Checked 2026-10-27 against Spring Framework 7 docs.

- [Controller advice](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-advice.html): bean registration, default controller scope, narrowing selectors, and `@ResponseBody` composition.
- [Exception handlers](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-exceptionhandler.html): matching exception types and returning `ResponseEntity`.
- [MVC request-body arguments](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-methods/requestbody.html): Bean Validation failures and default HTTP 400 behavior.
- [Spring MVC default exception resolver](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/web/servlet/mvc/support/DefaultHandlerExceptionResolver.html): default status mapping for unreadable request bodies.
- [Error responses](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-ann-rest-exceptions.html): `ProblemDetail`, RFC 9457 fields, the default request path for `instance`, and avoiding disclosure of implementation details.
- [RFC 9110 — status codes](https://www.rfc-editor.org/rfc/rfc9110.html#name-status-codes): 400, 404, 409, and 500 semantics.

The local `spring-boot-api-practice` exercise supplies the concrete names
`ApiError`, `ApiExceptionHandler`, `ProductNotFoundException`, and
`DuplicateSkuException`. The example is intentionally smaller than its handler;
it does not reproduce the exercise's broad `IllegalArgumentException` mapping.

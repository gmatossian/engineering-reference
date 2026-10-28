---
id: '973352f3-ac82-42a1-a38a-5c09e3946de0'
title: 'Handle API errors in Spring'
status: 'accepted'
iconKey: 'operations'
domains:
  - 'java'
  - 'http'
kind: 'operations'
childTopicIds: []
relatedTopicIds:
  - '31ee0d58-0999-457e-9d7c-5fe20ef9be56'
  - 'b97384d3-f986-4850-a6b0-a1c3b893ee86'
---

## Map an exception to a response

```java
record ApiError(String message) {}

@RestControllerAdvice
public class ApiExceptionHandler {
    @ExceptionHandler(ProductNotFoundException.class)
    public ResponseEntity<ApiError> handleNotFound(
            ProductNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ApiError("Product not found"));
    }
}
```

`ProductNotFoundException` is an application exception. This example handles
**only that failure**; add handlers for other failures the API needs to format.

**JSON body:** `{ "message": "Product not found" }`.

| Piece                      | Role                                  |
| -------------------------- | ------------------------------------- |
| `@RestControllerAdvice`    | **Shared handlers** + response bodies |
| `@ExceptionHandler(...)`   | Match the **exception type**          |
| `ResponseEntity<ApiError>` | **Status, headers, and body**         |
| `ApiError`                 | Your **custom response body type**    |

## Choose the status by failure

| Failure              | Exception / example                 | HTTP    |
| -------------------- | ----------------------------------- | ------- |
| DTO body validation  | `MethodArgumentNotValidException`   | **400** |
| JSON/type conversion | `HttpMessageNotReadableException`   | **400** |
| Missing product      | `ProductNotFoundException`          | **404** |
| SKU already in use   | `DuplicateSkuException`             | **409** |
| Unexpected failure   | Programming or infrastructure error | **500** |

These are deliberate API mappings. **Custom exception names do not assign HTTP
statuses.** For DTO failures, get field errors from `ex.getBindingResult()`.

> For unexpected failures, **log the diagnostic details** and return a **safe
> client message**. Avoid forwarding arbitrary exception messages or treating
> every `IllegalArgumentException` as a client error.

## Place and scope the handler

- Put **API-wide error handling** (`ApiExceptionHandler`) and its **response body
  type** (`ApiError`) in an `error` package alongside feature packages such as
  `product`. Keep product-specific exceptions with `product`.
- Register the advice as a **Spring bean**, usually through component scanning.
  The package name does not set its scope: advice applies to **all controllers by
  default**; annotation selectors can narrow it.
- **Jobs and calls outside Spring MVC** need their own error handling. Advice
  handles exceptions reaching MVC's exception resolution.

## Use Spring's built-in error body

Instead of defining `ApiError`, you can use **`ProblemDetail`**, Spring's type for
a standard HTTP error response:

```json
{
  "type": "about:blank",
  "title": "Not Found",
  "status": 404,
  "detail": "Product not found",
  "instance": "/products/42"
}
```

**The handler still selects the exception and builds the response.**
`ProblemDetail` supplies the body format.

**`instance`:** Spring MVC uses the current request path when this field is unset.

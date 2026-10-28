---
id: '31ee0d58-0999-457e-9d7c-5fe20ef9be56'
title: 'Bean Validation in Spring'
status: 'accepted'
iconKey: 'operations'
domains:
  - 'java'
  - 'http'
kind: 'operations'
childTopicIds: []
relatedTopicIds:
  - '973352f3-ac82-42a1-a38a-5c09e3946de0'
  - '9e290750-ab85-4acb-bca2-88d7ad758cd7'
---

## Validate an incoming body

With `spring-boot-starter-validation` on the classpath:

```java
record CreateItem(
    @NotBlank String name,
    @NotNull @Positive BigDecimal price) {}

// Spring MVC controller parameter:
// @Valid @RequestBody CreateItem input
```

Spring MVC deserializes the body, then validates its constraints. For this parameter
shape, a failure raises `MethodArgumentNotValidException` and produces **400 by
default**. Customize exception handling for the API's error body.

Malformed JSON fails during deserialization, before Bean Validation; handle that
failure too when providing a consistent error response.

## Choose the constraint

| Annotation                    | Checks                                            | Rejects `null`? |
| ----------------------------- | ------------------------------------------------- | --------------- |
| `@NotNull`                    | Value is not `null`                               | Yes             |
| `@NotBlank`                   | String contains a non-whitespace character        | Yes             |
| `@Size(min = 1, max = 32)`    | String length or container size, inclusive bounds | No              |
| `@Positive`                   | Number is strictly greater than zero              | No              |
| `@Pattern(regexp = "[A-Z]+")` | String matches the regular expression             | No              |

**Required positive price:** combine `@NotNull` and `@Positive`.
**Whitespace:** these annotations do not trim input; `@Size` checks the value it
receives.

## What actually runs validation?

| Call path                      | Activation                                    |
| ------------------------------ | --------------------------------------------- |
| MVC request body               | `@Valid @RequestBody`                         |
| Spring bean method             | `@Validated` class + `@Valid` object argument |
| Explicit Java call             | `Validator.validate(object)`                  |
| Ordinary `new CreateItem(...)` | No automatic annotation checks                |

> **Constraint annotations declare rules; validation needs an execution path.**
> A constructor needs explicit checking code to reject invalid arguments on an
> ordinary `new` call.

For explicit validation, a non-empty result means the object failed its constraints;
`validate` itself returns violations rather than throwing for invalid field values:

```java
// validator is an injected jakarta.validation.Validator.
var violations = validator.validate(input);
```

- Spring method validation requires a call **through the proxy**; `this` calls bypass it.
- For nested objects, `@Valid` cascades into their constraints; add `@NotNull` if
  the nested object itself is required.
- Bean Validation failures outside MVC do not automatically mean HTTP 400.

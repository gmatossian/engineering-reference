---
id: 'd1bdbbaf-a304-4848-b5cb-9c654666223b'
title: 'Reusable idempotency handling — Spring'
status: 'draft'
summary: 'Share claim, execution and replay across Spring endpoints.'
iconKey: 'persistence'
domains:
  - 'http'
  - 'persistence'
kind: 'pattern'
childTopicIds: []
relatedTopicIds:
  - '902437bd-0214-4617-baa7-2730a2e2d45f'
---

## Start with a shared service wrapper

```java
// Fragment: idempotency and callerScopes are custom services.
@PostMapping("/tickets")
ResponseEntity<TicketDto> create(
    @RequestHeader("Idempotency-Key") String key,
    @Valid @RequestBody CreateTicket input,
    Authentication auth) {
  String scope = callerScopes.authorizedScope(auth);
  return idempotency.execute(
      scope, "create-ticket:v1", key, input,
      () -> ticketService.createResponse(input));
}
```

- **Controller:** supplies the authorized scope, key, operation ID and validated input.
- **Shared service:** fingerprints, atomically claims, executes and saves/replays.
- **Business service:** creates the entity; **joins the same transaction**.

`TransactionTemplate` can wrap the claim, business write and saved response.
Use the same participating database/transaction manager; an independently
committed business write breaks this example's atomicity.

> **Application code:** Spring does not supply this `idempotency` service or an
> automatic `@Idempotent` feature. Each participating endpoint opts in.

## Alternatives

### Custom annotation + AOP

**Less repeated call-site code**; requires correct **proxy and transaction ordering**.

### Servlet filter / MVC interceptor

**Central header/routing handling**; body buffering, response capture and the
business transaction boundary need care. Transport interception alone cannot
make the business effect atomic.

## Sources

- [Spring: TransactionTemplate](https://docs.spring.io/spring-framework/reference/data-access/transaction/programmatic.html)
- [Spring: transaction propagation](https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/tx-propagation.html)
- [Spring: declarative transactions and proxies](https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/annotations.html)

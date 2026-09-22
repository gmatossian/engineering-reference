---
id: 'eb6449dd-f815-42a9-8f95-7a6dc0d5341a'
title: 'Persisting date/time values'
iconKey: 'persistence'
domains:
  - 'java'
  - 'persistence'
  - 'databases'
kind: 'decision-aid'
childTopicIds: []
relatedTopicIds:
  - 'aae2e69e-f92f-4672-912e-117d5a404a6a'
  - '26ccdc15-718d-4924-b707-9e6969f8f326'
---

| Java type        | PostgreSQL column              | Preserves                        |
| ---------------- | ------------------------------ | -------------------------------- |
| `LocalDate`      | `date`                         | Date                             |
| `LocalTime`      | `time`                         | Clock time                       |
| `LocalDateTime`  | `timestamp`                    | Local date/time; **no instant**  |
| `Instant`        | `timestamptz`                  | Instant; verify provider mapping |
| `OffsetDateTime` | `timestamptz`                  | Instant; **not original offset** |
| `ZonedDateTime`  | `timestamptz` + `text` zone ID | Instant + named region           |

This is a **choice of storage semantics**, not a promise about the column type that any JPA provider generates by default. PostgreSQL's plain `timestamp` means **without time zone**. Its `timestamptz` normalizes an input to UTC and displays it in the session time zone; it retains neither the input's original offset nor its named zone. To retain a `ZonedDateTime`'s region, persist its **instant and zone ID separately**.

## Example: retain an instant and a named zone

With **Hibernate 6.6 and PostgreSQL**, an explicit JDBC type makes the intended `Instant` mapping visible:

```java
@Entity
@Table(name = "event_time")
class EventTime {
    @Id Long id;

    @JdbcTypeCode(SqlTypes.TIMESTAMP_WITH_TIMEZONE) // Hibernate-specific
    @Column(name = "occurred_at")
    Instant occurredAt;

    @Column(name = "zone_id")
    String zoneId; // e.g. ZoneId.of("Europe/Paris").getId()
}
```

```sql
CREATE TABLE event_time (
    id bigint PRIMARY KEY,
    occurred_at timestamptz NOT NULL,
    zone_id text NOT NULL
);
```

Rebuild a regional view with `occurredAt.atZone(ZoneId.of(zoneId))`. A `timestamptz` column alone cannot rebuild the original region. Check the provider's actual binding and generated DDL against the schema; `@Column(columnDefinition = "timestamptz")` alone does not specify its JDBC binding type.

## Mapping boundaries

- **JPA 2.2** standardizes `LocalDate`, `LocalTime`, `LocalDateTime`, and `OffsetDateTime` as basic types; **Jakarta Persistence 3.2** adds `Instant`. `ZonedDateTime` is not a standard basic type in 3.2. Providers may support more, but their defaults and versions matter.
- **pgJDBC** directly supports `LocalDate`, `LocalTime`, `LocalDateTime`, and `OffsetDateTime` for the matching PostgreSQL types. It does not directly support `Instant` or `ZonedDateTime` through its Java-time `getObject`/`setObject` mapping; an ORM can still handle them through its own conversion.
- `@Temporal` belongs to legacy `java.util.Date`/`Calendar` mappings, **not** `java.time` fields.
- PostgreSQL timestamps keep at most **microsecond** precision; Java time values can hold nanoseconds. Check precision requirements before relying on a round trip.

Mapping references: [Jakarta Persistence 3.2](https://jakarta.ee/specifications/persistence/3.2/jakarta-persistence-spec-3.2), [PostgreSQL date/time types](https://www.postgresql.org/docs/current/datatype-datetime.html), [pgJDBC Java-time mappings](https://jdbc.postgresql.org/documentation/query/), and [Hibernate 6.6 mapping settings](https://docs.hibernate.org/orm/6.6/javadocs/org/hibernate/cfg/MappingSettings.html).

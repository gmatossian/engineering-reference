---
id: '26ccdc15-718d-4924-b707-9e6969f8f326'
title: 'Zones, offsets, and locale'
iconKey: 'conversion'
domains:
  - 'java'
kind: 'operations'
childTopicIds: []
relatedTopicIds:
  - 'eb6449dd-f815-42a9-8f95-7a6dc0d5341a'
---

| Need                        | Use                         | Controls                             |
| --------------------------- | --------------------------- | ------------------------------------ |
| Regional time rules         | `ZoneId.of("Europe/Paris")` | Date-dependent offset, including DST |
| A fixed difference from UTC | `ZoneOffset.of("+02:00")`   | One offset, **not** future rules     |
| Localized display text      | `Locale.FRANCE`             | Formatting, **not** the zone         |

## Convert between wall time and an instant

```java
ZoneId zone = ZoneId.of("Europe/Paris");
LocalDateTime wallTime = LocalDateTime.of(2026, 9, 21, 9, 30);

ZonedDateTime zoned = wallTime.atZone(zone); // resolve using the zone's rules
Instant instant = zoned.toInstant();
ZonedDateTime displayed = instant.atZone(zone); // same instant in that region
OffsetDateTime fixedOffset = zoned.toOffsetDateTime();
```

`LocalDateTime` has no zone, so **it cannot identify an instant by itself**. At a daylight-saving gap, `atZone` moves the local time forward; at an overlap, it normally chooses the earlier valid offset. When the exact local time matters, inspect `zone.getRules().getValidOffsets(wallTime)`: **0** means a gap, **1** normal, **2** an overlap. Decide how to handle 0 or 2 before storing an instant.

## Format for a locale

```java
DateTimeFormatter formatter = DateTimeFormatter
    .ofLocalizedDateTime(FormatStyle.MEDIUM)
    .withLocale(Locale.FRANCE);
String label = displayed.format(formatter);

DateTimeFormatter input = DateTimeFormatter.ofPattern("dd/MM/uuuu", Locale.FRANCE);
LocalDate parsed = LocalDate.parse("21/09/2026", input);
```

Use an explicit formatter and locale for human-facing text; use a zone when the **clock time** must change. `withLocale(...)` does not convert an instant to another zone. For machine-readable interchange, prefer a built-in ISO formatter.

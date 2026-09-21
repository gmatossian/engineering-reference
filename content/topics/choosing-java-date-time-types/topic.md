---
id: 'aae2e69e-f92f-4672-912e-117d5a404a6a'
title: 'Choosing Java date/time types'
iconKey: 'ordering'
domains:
  - 'java'
kind: 'decision-aid'
childTopicIds:
  - '26ccdc15-718d-4924-b707-9e6969f8f326'
relatedTopicIds:
  - 'eb6449dd-f815-42a9-8f95-7a6dc0d5341a'
---

| Need to represent                               | Use              | Watch for                                                  |
| ----------------------------------------------- | ---------------- | ---------------------------------------------------------- |
| A calendar date                                 | `LocalDate`      | No time of day or instant                                  |
| A recurring clock time                          | `LocalTime`      | No date; cannot resolve a daylight-saving offset           |
| A local wall-clock date and time                | `LocalDateTime`  | No zone or offset; **not an instant**                      |
| An exact point on the timeline                  | `Instant`        | No local time or region to display it in                   |
| A date-time with a specified **numeric offset** | `OffsetDateTime` | Offset is fixed; it has no regional daylight-saving rules  |
| A date-time in a **named region**               | `ZonedDateTime`  | Local times may be skipped or repeated at zone transitions |

## Create and use each type

```java
LocalDate date = LocalDate.parse("2026-09-21");
LocalDate nextDate = date.plusDays(1);

LocalTime time = LocalTime.of(9, 30);
LocalTime earlier = time.minusMinutes(15);

LocalDateTime wallTime = date.atTime(time);
LocalDateTime nextHour = wallTime.plusHours(1);

Instant instant = Instant.parse("2026-09-21T16:30:00Z");
boolean afterEpoch = instant.isAfter(Instant.EPOCH);

OffsetDateTime offsetTime = OffsetDateTime.parse("2026-09-21T09:30:00-07:00");
Instant sameInstant = offsetTime.toInstant();

ZonedDateTime regional = wallTime.atZone(ZoneId.of("America/Los_Angeles"));
ZonedDateTime elsewhere = regional.withZoneSameInstant(ZoneId.of("Europe/Paris"));
```

`plus...`, `minus...`, and `with...` return **new values**; they do not mutate the original. See **Zones, offsets, and locale** for converting wall times to instants and handling daylight-saving transitions.

For new Java code, start with `java.time`. Joda-Time and `java.util.Date`/`Calendar` mainly arise when working with existing APIs; [Joda-Time itself recommends migrating to `java.time`](https://www.joda.org/joda-time/).

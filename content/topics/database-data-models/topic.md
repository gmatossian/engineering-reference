---
id: 'da02eee0-7185-4b6e-9cc3-3593cd5f6cff'
title: 'Database data models'
status: 'accepted'
summary: 'Understand tables, documents, and key/value access—including why JSON support does not select an engine.'
iconKey: 'database'
domains:
  - 'databases'
  - 'system-design'
kind: 'concept'
childTopicIds: []
relatedTopicIds:
  - 'b7176ebc-db78-407d-a151-5e3cefb8a216'
---

## Data model versus engine

A **data model** describes how records are organized and accessed.
An **engine** is the product implementing those operations. One engine can support
several models.

| Model          | Shape          |
| -------------- | -------------- |
| **Relational** | Rows in tables |
| **Document**   | Nested fields  |
| **Key/value**  | Key → value    |

- **Relational:** define columns and types; put independently maintained records
  in tables and combine them with queries. **Schema migrations** must remain
  compatible with deployed application versions. Example: PostgreSQL.
- **Document:** each record has named fields, which can contain nested objects
  and arrays. **Fields can differ between records:** one address may include
  `addressLine4`, while another omits it. **Validation rules can still require
  fields and check their types**—for example, requiring `city` to be present and
  contain text. Example: MongoDB.
- **Key/value:** a key identifies a value. What can be done inside that value
  depends on its type and the engine. Examples: Redis and DynamoDB.

> A **document** means a structured record, such as JSON—not a PDF or Word file.
> **Document and key/value are overlapping models**, not mutually exclusive products.

## When to embed or use separate records

**Embedding (nesting)** puts related information inside its owning record:

```json
{
  "profileId": "p1",
  "address": {
    "city": "Dublin",
    "postcode": "..."
  }
}
```

**When is a document self-contained?** Its contents mostly **belong to one record**
and are **read or changed together**. A profile with its own address can fit:
fetching the profile also returns its address without combining separate records.

**Prefer separate records** when information is **shared or maintained independently**—
for example, one office address referenced by many employees. Updating it once
avoids synchronizing copies. Each employee stores the office's ID; reading its
address requires a join or another fetch.

**Watch growth:** an ever-growing activity history can make one document too
large. Concurrent updates to that same document can also cause **waiting or
conflicts**. Consider storing activities as **separate records**.

> **One application can use both approaches.** PostgreSQL and MongoDB both support
> nesting and references. Embedding is an organization choice, not a requirement
> to choose MongoDB.

## What does storing JSON tell you?

> **JSON alone doesn’t narrow the choice.** What matters is what the application
> must do with its contents.

### Retrieve and replace a complete value using its key

**Key/value access may be enough.**

### Search, sort, or update fields inside records

Look for **field-level querying and updates**. Document and relational engines
are candidates.

### Combine independently maintained records in different ways

**Relational is a strong starting candidate** when this is frequent.

### Read or change a record together with its nested contents

**Embedding may simplify the work** when this is the usual pattern. Both document
databases and relational JSON support can fit.

**These are shortlisting signals, not exclusive capabilities.** Use **Choosing a
database** for candidate recommendations and **Comparing database engines** for
product differences that affect the decision.

Sources: [MongoDB modelling](https://www.mongodb.com/docs/manual/data-modeling/),
[PostgreSQL JSON](https://www.postgresql.org/docs/current/datatype-json.html),
[Redis types](https://redis.io/docs/latest/develop/data-types/),
[DynamoDB queries](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Query.html).

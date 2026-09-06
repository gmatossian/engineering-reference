---
id: '62196430-caa5-48c7-bb68-c064209d6291'
title: 'Dirty checking, flush, and commit'
summary: 'Know when managed changes become SQL and why flushing is not the same as committing.'
iconKey: 'persistence'
childTopicIds: []
---

Hibernate checks managed entities for changes and translates those changes into SQL
during a **flush**. This is dirty checking.

```java
@Transactional
public void renameCustomer(long id, String name) {
    Customer customer = entityManager.find(Customer.class, id);
    customer.setName(name);
}
```

No explicit update operation is required while `customer` remains managed.

| Event                   | What it means                                                    |
| ----------------------- | ---------------------------------------------------------------- |
| Change a managed entity | Changes tracked state in the persistence context                 |
| Flush                   | Synchronizes pending changes by issuing SQL                      |
| Commit                  | Completes the transaction and makes its database changes durable |
| Rollback after a flush  | Reverses the transaction despite the earlier SQL                 |

With the usual automatic flush mode, flushing commonly happens before commit and
before a query whose result could be affected by pending changes. Call `flush()`
only when the SQL must run earlier—for example, to observe a database constraint
failure before later work proceeds.

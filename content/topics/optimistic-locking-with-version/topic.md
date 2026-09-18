---
id: '3ee152a5-33e8-4700-8e08-1b35439f5e8e'
title: 'Optimistic locking with @Version'
summary: 'Detect stale entity updates with a version field and handle conflicts at the use-case boundary.'
iconKey: 'concurrency'
domains:
  - 'java'
  - 'persistence'
  - 'databases'
kind: 'pattern'
childTopicIds: []
relatedTopicIds: []
---

`@Version` gives each entity revision a version value. It does **not lock the row
while it is read**; it detects whether another transaction changed the row before
the current transaction writes or deletes it.

```java
@Entity
class Account {
    @Id
    private Long id;

    @Version
    private long version;
}
```

## How a conflict is detected

| Step | Transaction 1             | Transaction 2                       |
| ---- | ------------------------- | ----------------------------------- |
| 1    | Reads version `4`         | Reads version `4`                   |
| 2    | Updates version `4` → `5` | Still holds stale version `4`       |
| 3    | Succeeds                  | Update matches no row and **fails** |

Conceptually, the update includes the version it originally read:

```sql
update account
set balance = ?, version = 5
where id = ? and version = 4;
```

The provider throws `OptimisticLockException` when the version check fails. The
check may occur during `merge`, flush, or commit, and the active transaction is
marked for rollback.

## Handle the conflict deliberately

- Reload and reapply the operation only when that behavior is safe.
- Ask the user to reconcile changes when intent may conflict.
- Do **not blindly retry** a business operation that may no longer be valid.
- Do not assign the version field yourself; the persistence provider manages it.

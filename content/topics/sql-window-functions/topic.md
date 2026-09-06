---
id: 'd7d5d680-00d4-4782-8875-a0fd06dabeb9'
title: 'SQL window functions'
summary: 'Calculate ranks, running values, and comparisons across related rows without collapsing the result.'
iconKey: 'database'
childTopicIds: []
---

Window functions calculate across rows related to the current row while **preserving
each result row**. In contrast, `GROUP BY` collapses each group into one result row.

## Read the `OVER` clause

| Part              | Controls                                                                      |
| ----------------- | ----------------------------------------------------------------------------- |
| `PARTITION BY`    | Divides rows into independent groups; the calculation restarts for each group |
| `ORDER BY`        | Defines the sequence inside each partition                                    |
| `ROWS` or `RANGE` | Defines which rows around the current row belong to its frame                 |

```sql
function(...) OVER (
    PARTITION BY group_column
    ORDER BY sequence_column
    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
)
```

Omit `PARTITION BY` to treat all rows as one partition. The window's `ORDER BY`
controls the calculation, **not the final display order**.

## Choose by question

| Question                                       | Function or pattern                       |
| ---------------------------------------------- | ----------------------------------------- |
| What position is this row?                     | `row_number()`                            |
| What rank is this value, with gaps after ties? | `rank()`                                  |
| What rank is this value, without gaps?         | `dense_rank()`                            |
| What was the previous or next value?           | `lag()` or `lead()`                       |
| What is the running total or moving average?   | `sum()` or `avg()` with an explicit frame |
| What is the first or last value in the frame?  | `first_value()` or `last_value()`         |

## Ranking and ties

For values `100, 100, 90`:

| Function       | Result    |
| -------------- | --------- |
| `row_number()` | `1, 2, 3` |
| `rank()`       | `1, 1, 3` |
| `dense_rank()` | `1, 1, 2` |

Use a unique tie-breaker when every row needs a **deterministic position**:

```sql
row_number() OVER (
    PARTITION BY department_id
    ORDER BY salary DESC, employee_id
)
```

## Top rows per group

Window functions are evaluated after `WHERE`, so calculate the position first and
filter it in an outer query:

```sql
WITH ranked AS (
    SELECT employee_id,
           department_id,
           salary,
           row_number() OVER (
               PARTITION BY department_id
               ORDER BY salary DESC, employee_id
           ) AS position
    FROM employees
)
SELECT employee_id, department_id, salary
FROM ranked
WHERE position <= 3
ORDER BY department_id, position;
```

## Running total

```sql
sum(amount) OVER (
    PARTITION BY account_id
    ORDER BY occurred_at, transaction_id
    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
) AS running_total
```

Specify `ROWS ...` explicitly when row-by-row behavior matters. A database's default
frame can include tied ordering values together, which may make a running total or
`last_value()` result surprising.

## Compare with another row

```sql
amount - lag(amount) OVER (
    PARTITION BY account_id
    ORDER BY occurred_at, transaction_id
) AS change_from_previous
```

`lag()` and `lead()` avoid self-joins when the question is about a nearby row in the
same ordered partition.

## Common traps

| Trap                                                  | Correction                                                   |
| ----------------------------------------------------- | ------------------------------------------------------------ |
| Filtering a window result in the same query's `WHERE` | Use a subquery or CTE; some databases also support `QUALIFY` |
| Assuming the window order controls output order       | Add an outer `ORDER BY`                                      |
| Using `row_number()` with non-unique ordering         | Add a stable, unique tie-breaker                             |
| Relying on the default frame                          | State the required `ROWS` or `RANGE` frame explicitly        |
| Using a window when only one row per group is needed  | Prefer `GROUP BY`                                            |

Window-function support and edge-case syntax vary by database. Verify the target
dialect when using frames or vendor-specific clauses.

## References

- [PostgreSQL window-function tutorial](https://www.postgresql.org/docs/current/tutorial-window.html)
- [PostgreSQL window functions](https://www.postgresql.org/docs/current/functions-window.html)
- [MySQL window-function concepts](https://dev.mysql.com/doc/refman/8.4/en/window-functions-usage.html)

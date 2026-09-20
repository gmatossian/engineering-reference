# Review Decisions

## Purpose

This register records review findings whose disposition remains relevant to
future work. It prevents a reviewer without transcript context from repeatedly
presenting an accepted design choice, rejected concern, or tracked follow-up as
a new finding.

The current task contract and governing project documents remain authoritative.
If they conflict with this register, surface the conflict for human resolution.

## Reviewer protocol

Before an independent review:

1. Read the accepted issue contract, governing documents, complete proposed
   diff, current verification evidence, and this register.
2. Treat the dispositions below as known context, not findings to repeat.
3. Reopen a disposition only when new evidence, a regression, or a changed
   requirement materially alters it.
4. When reopening one, cite its decision ID and explain what changed.
5. Continue to report materially distinct defects even when they concern the
   same area.

## Current dispositions

These decisions originated during the review of issue
[#39](https://github.com/gmatossian/engineering-reference/issues/39).

| ID | Disposition | Decision and rationale | Revisit or tracking condition |
| --- | --- | --- | --- |
| RD-001 | Accepted design | Selected Java features live under **Java language evolution**. This is the deliberate catalog hierarchy. | Revisit only if the catalog information architecture changes. |
| RD-002 | Accepted design | The JPA dirty-checking example may appear in two places because it supports two distinct retrieval paths. | Revisit if either occurrence stops adding retrieval value or becomes inconsistent. |
| RD-003 | Rejected as a blocker | Mixed reference-section styles and minor punctuation differences are not commit blockers by themselves. | Report them only when they cause incorrect meaning, violate an explicit authoring rule, or materially harm retrieval. |
| RD-004 | Accepted change | Replacing Angular's default favicon with the Engineering Reference mark was explicitly requested. | Revisit only as part of an accepted branding change. |
| RD-005 | Rejected as a general rule | Do not apply wholesale deduplication. Judge duplication by retrieval value; only exact repetition without a distinct purpose should be removed. The exact Map and comparator repetitions found in issue #39 were trimmed. | Revisit individual cases with concrete evidence of needless repetition or inconsistency. |
| RD-006 | Deferred | Wider table and image layouts, stronger SVG font fallback behavior, and heading-derived overflow labels are follow-up work. | [Issue #42](https://github.com/gmatossian/engineering-reference/issues/42) |
| RD-007 | Resolved | Browser behavior tests use a deterministic authored fixture through the production generator and runtime contract; a focused smoke retains real-catalog integration coverage. | [PR #82](https://github.com/gmatossian/engineering-reference/pull/82) |
| RD-008 | Deferred | Splitting the large HTTP status-code Topic into focused Topics is follow-up work. | [Issue #44](https://github.com/gmatossian/engineering-reference/issues/44) |

## Maintenance

- Add a disposition only after the human owner accepts, rejects, or defers a
  material finding.
- Link deferred work to a concrete issue rather than leaving an unowned note.
- When a deferred item is completed, record its resolving pull request and mark
  the entry resolved or remove it when no future reviewer context would be lost.
- Keep task-specific review detail in the issue or pull request; this register is
  for decisions likely to matter again.

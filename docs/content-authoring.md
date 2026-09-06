# Content Authoring Guide

## Purpose

Engineering Reference is a quick-reference browser, not a comprehensive tutorial or
API catalog. Each Topic should help a reader retrieve a specific, likely useful fact
with minimal reading.

This guide defines editorial conventions. The accepted Topic structure and
invariants remain governed by the [content model](content-model.md), while supported
source syntax and validation remain governed by the
[content-storage decision](content-storage.md).

## Organize around intent

- Give each Topic a narrow, recognizable purpose.
- Use headings as scan anchors for the question or intent being answered.
- Put deeper or adjacent material in child Topics instead of expanding the current
  Topic indefinitely.
- Do not add material merely for completeness. Include content known to be useful or
  likely to be needed.

## Prefer retrieval over narration

- Show the operation with a concise, copyable example.
- Add prose only for behavior, constraints, or traps that the example does not make
  apparent.
- Prefer short bullets to dense explanatory paragraphs when several independent
  facts matter.
- Do not translate a code example into a sentence that says the same thing.
- Avoid introductions that merely repeat the headings below them.

## Emphasize the answer

- Use strong emphasis sparingly for the value, consequence, constraint, or trap a
  reader is likely scanning for.
- Do not emphasize a generic label while leaving the useful fact visually uniform.
- Use inline code for identifiers, expressions, literal values, and API names.
- Avoid emphasizing so much text that nothing retains visual priority.

For example:

> Larger length: extra positions receive **default values**.
>
> Range: start **inclusive**, end **exclusive**.

## Use comparison tables as decision matrices

When several choices vary across the same meaningful dimensions, place a compact
comparison table before their detailed examples. The table should help the reader
choose an option without first reading every section.

- Include only dimensions that materially affect the choice.
- Keep column headings concise and precise enough to scan without explanation.
- Treat the table as the primary statement of the comparison; remove prose below
  it that merely repeats the same facts.
- Retain copyable examples and exceptional caveats that the table cannot express
  clearly.
- Do not add a table when the content lacks repeated comparison dimensions.

The [Arrays and lists Topic](../content/topics/arrays-and-lists/topic.md) is the
reference example: its opening matrix compares mutation, resizing, source linkage,
and `null` behavior, while the sections below contain the corresponding conversion
snippets and traps.

## Remove accidental duplication

- State each fact once in the place where it is most useful.
- Do not add a summary table and then restate each of its cells in the sections
  below.
- Keep an overview only when it provides orientation that the detailed content does
  not.
- Repeat information intentionally only when the second occurrence serves a
  different retrieval need.

## Review the rendered Topic

Before accepting content:

1. Read it once for technical correctness.
2. Scan it without reading every sentence; the important facts should still stand
   out.
3. Remove anything that repeats the code or another section without adding value.
4. Check the rendered Topic at wide and narrow viewport sizes.
5. Run the repository verification required by the
   [AI-assisted development profile](ai-assisted-development.md).

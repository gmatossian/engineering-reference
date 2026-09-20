# Content Authoring Guide

## Purpose

Engineering Reference is a quick-reference browser, not a tutorial, article,
course, or comprehensive API catalog. Each Topic should help a reader retrieve a
specific, likely useful fact with minimal reading.

This guide defines editorial conventions. The accepted Topic structure and
invariants remain governed by the [content model](content-model.md), while supported
source syntax and validation remain governed by the
[content-storage decision](content-storage.md).

## Write for recognition-assisted recall

Assume the reader is already familiar with the subject and knows that this is the
place to look, but cannot recover a particular detail from memory. The Topic should
make that detail quick to recognize.

A reference Topic is optimized for non-linear retrieval. It should not require the
reader to follow a teaching sequence or read a narrative from beginning to end.

- An article develops an explanation through a linear narrative.
- A tutorial or guide teaches or walks the reader through a sequence.
- A reference Topic exposes answers that can be located and understood directly.

Do not add introductions, history, motivation, learning objectives, transitions,
recaps, or conclusions merely to give a Topic an article-like shape. Include
background only when it is necessary to interpret the reference correctly.

## Define one retrieval job

Before authoring, complete this sentence:

> After opening this Topic, the reader can quickly determine ______.

The answer defines the Topic's boundary. If the sentence needs several independent
answers, select the central retrieval job and represent the others as focused child
Topics. Do not accommodate broad scope by turning the current Topic into a longer
page.

When a request is underspecified, choose the smallest useful retrieval scope
supported by the request. Surface a consequential scope decision rather than
silently interpreting the request as a demand for comprehensive coverage.

Some broad Topics exist only to organize child Topics. The content model permits
this navigation-only shape; do not add artificial overview content when navigation
alone serves the Topic's purpose.

## Classify and relate for retrieval

Every Topic declares one or more domains, one primary content kind, and an ordered
Related Topics list. These fields provide retrieval paths; they do not replace the
Topic's title, content, or ordered children.

- Add each domain in which a reader could reasonably browse for the Topic. Do not
  copy the current ancestor chain mechanically, and do not add a domain merely
  because it is adjacent to the subject.
- Choose the kind by the Topic's primary retrieval job: an organizing overview,
  explanatory concept, operational lookup, decision aid, exercise, or reusable
  pattern. Classify how the reader uses the Topic rather than how the page happens
  to be formatted.
- Keep `relatedTopicIds` small and intentional. Add a link only when that nearby
  reference is a useful next retrieval path that is not already adequately exposed
  as an immediate child or contextual hierarchy path.
- Preserve Related Topic order deliberately. Relationships are directed and need
  not be reciprocal; an explicit empty list is valid and preferable to filler.

Use only the closed vocabularies in the content model and storage contract. A new
domain or kind is a shared-contract decision that requires reviewing the complete
catalog, not an ordinary Topic edit.

## Include only retrieval value

Include a content block when it materially helps the reader recover the answer,
choose between options, use an operation correctly, or avoid a likely mistake.
Useful reference content commonly provides:

- exact operations, syntax, mappings, or values;
- behavior that is not apparent from an example;
- distinctions that affect a choice;
- constraints and consequences; or
- high-value traps and exceptional cases.

Do not add material merely because it is relevant, educational, or important to the
subject generally. Exhaustive coverage is not a goal. If removing a block would not
make a specific lookup harder, remove it.

Length is a diagnostic rather than an acceptance rule. A compact decision matrix
may carry more reference value than a short narrative, while an unusually long Topic
may reveal that it contains several retrieval jobs.

## Organize around intent

- Give each Topic a narrow, recognizable purpose.
- Put the answer, decision rule, essential distinction, or usable syntax first.
- Use headings as scan anchors for the question or intent being answered.
- Make sections understandable without requiring the preceding section to be read.
- Put deeper or adjacent material in child Topics instead of expanding the current
  Topic indefinitely.

## Choose the fastest representation

Use the representation that makes the information fastest to recognize:

- code blocks for exact syntax and operations;
- tables for mappings, comparisons, and repeated dimensions;
- diagrams for relationships, flows, hierarchies, and decision paths;
- lists for independent facts or ordered actions; and
- prose for behavior, reasoning, constraints, consequences, or traps that the other
  forms cannot communicate clearly.

Choose a visual when its spatial structure makes useful information faster to
recognize than text, a table, or code. A visual should carry information, not merely
decorate the Topic or restate simpler content. Keep the precise values or syntax in
text, code, or a table when those forms are easier to inspect and copy.

Follow the image and alternative-text requirements in the
[content-storage decision](content-storage.md). Do not use an image as the only
source of information that the reader must be able to retrieve precisely.

## Make text easy to scan

- For an operation, lead with a concise, copyable example.
- Add prose only for behavior, constraints, consequences, or traps that the example
  or another faster representation does not make apparent.
- Prefer short bullets to dense explanatory paragraphs when several independent
  facts matter.
- Keep paragraphs focused on one behavior, constraint, decision, consequence, or
  trap.
- Do not translate a code example into a sentence that says the same thing.
- Avoid introductions that merely repeat the headings below them.
- Use strong emphasis sparingly for the value, consequence, constraint, or trap a
  reader is likely scanning for.
- Use inline code for identifiers, expressions, literal values, and API names.
- Do not emphasize generic labels while leaving the useful fact visually uniform.
- Avoid emphasizing so much text that nothing retains visual priority.

For example:

> Larger length: extra positions receive **default values**.
>
> Range: start **inclusive**, end **exclusive**.

## Reserve callouts for exceptional retrieval value

Use a callout only when one compact note should remain visible while the reader
scans past the surrounding prose. Suitable content includes a consequential
constraint, a likely mistake, a reusable decision rule, or a formula worth
recognizing as a unit.

Author the callout as a top-level Markdown blockquote:

```markdown
> Because **[requirement]** must be true, start with **[choice]**. This costs
> **[trade-off]**. Revisit it when **[trigger]** changes.
```

Callouts use one neutral treatment. Do not invent warning, tip, success, or other
labelled variants; do not nest callouts or place them inside lists. Existing
supported Markdown may appear inside a callout, but the callout must remain a
compact retrieval aid rather than a container for a separate section. If several
ordinary paragraphs need the same emphasis, improve the Topic's headings or
representation instead.

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

## Recognize article and guide drift

Replace these common patterns before accepting a Topic:

| Drift | Reference-oriented alternative |
| --- | --- |
| An opening explanation of why the subject matters | Start with the answer or decision the reader came to retrieve |
| Concepts introduced in a teaching sequence | Independently scannable operations, choices, or facts |
| A step-by-step walkthrough intended to build understanding | A copyable example plus only the constraints needed to use it correctly |
| Coverage of every adjacent concept | Focused child Topics for separate retrieval jobs |
| Prose that repeats a table, example, or diagram | Keep the clearest representation and only exceptional caveats |
| A recap or conclusion | Omit it; the useful facts should already be visible at their retrieval points |
| A decorative visual or a diagram that restates a short list | Use the simpler representation |

A procedural subject may legitimately contain ordered steps. The distinguishing test
is whether the steps are a compact operation the familiar reader needs to recover or
a lesson intended to teach the subject progressively.

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
2. State its single retrieval job. If the content does not fit that sentence, narrow
   or split it.
3. Scan it without reading every sentence. The primary answer should be discoverable
   in roughly 15 seconds.
4. Read only the title, headings, emphasized text, tables, code, and visuals. They
   should expose the Topic's important facts and choices.
5. Check that every remaining prose block adds behavior, reasoning, a constraint, a
   consequence, or a trap that is not already clear.
6. Move any section with an independent retrieval job into a child Topic or record it
   as a proposed child rather than expanding the current Topic.
7. Confirm that each visual improves retrieval and does not merely decorate or repeat
   another representation.
8. Remove introductions, transitions, repetition, and summaries that do not make a
   specific lookup easier.
9. Check the rendered Topic at wide and narrow viewport sizes.
10. Run the repository verification required by the
    [AI-assisted development profile](ai-assisted-development.md).

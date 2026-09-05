# AI-Assisted Development

## Status and purpose

This document is the canonical project-local profile for AI-assisted work in
Engineering Reference. It translates reusable agent-assisted engineering
principles into this repository's actual authorities, delivery states,
commands, risk boundaries, and review practices.

The [Agent-Assisted Engineering Playbook](https://github.com/gmatossian/agent-assisted-engineering-playbook)
provides supplementary rationale and reusable guidance. Access to it is not
required to work safely in this repository. When central guidance and this
profile appear to conflict, surface the conflict for human resolution; do not
silently override this profile.

This profile governs bounded engineering tasks. It does not define product
discovery, roadmap prioritization, or the complete project lifecycle.

## Sources of truth

Different authorities answer different questions. Do not treat one source as a
replacement for all the others.

| Concern | Authority |
| --- | --- |
| Product purpose, MVP scope, and accepted exclusions | [`docs/product-brief.md`](product-brief.md) |
| Topic domain model and invariants | [`docs/content-model.md`](content-model.md) |
| Authored and generated content representation | [`docs/content-storage.md`](content-storage.md) |
| Navigation, browser behavior, responsive behavior, and accessibility expectations | [`docs/interaction-model.md`](interaction-model.md) |
| Application architecture, build pipeline, and technical boundaries | [`docs/application-architecture.md`](application-architecture.md) |
| Visual direction, presentation rules, and accepted design references | [`docs/visual-design.md`](visual-design.md) |
| Current task contract | The GitHub issue body and explicit accepted amendments |
| Current task lifecycle position | The issue's status in the Engineering Reference GitHub Project |
| Proposed implementation and evidence | The task branch, pull request, and CI results |
| Accepted repository state | The `main` branch |
| Agent-assisted working rules | This document |
| Durable task history and handoff | The issue, pull request, commits, checks, governing documentation, and concrete follow-up issues |

When authorities conflict or the required authority is missing, stop and
surface the conflict. Do not infer a resolution from a transcript, an old
branch, generated output, or an implementation that contradicts accepted
documentation.

## Project states

The project board shows the overall position of a task. It does not attempt to
represent every internal lifecycle play.

- **Backlog** — accepted candidate work awaiting prioritization or sufficient
  refinement.
- **Ready** — prioritized and sufficiently defined for its explicitly selected
  next play or actor. Ready for investigation or planning does not
  automatically mean ready for implementation.
- **In Progress** — someone is actively refining, planning, implementing, or
  verifying the task.
- **Review** — the proposed change is complete enough for final-diff review and
  acceptance; required checks may still be running.
- **Done** — the human owner accepted the result, the change was merged or
  otherwise disposed of, the issue was closed, and material remaining work was
  recorded.

Lifecycle plays may loop without moving the card for every transition.

## Task contracts and readiness

A nontrivial delegated task should normally define:

- context;
- intended outcome;
- scope;
- acceptance criteria;
- verification; and
- out of scope.

Add explicit constraints, dependencies, authority exceptions, assumptions, or
unresolved decisions when they are material and are not already settled by
this profile or another governing document. Do not add empty boilerplate merely
to make every issue look identical.

Readiness is a human judgment relative to the selected next play and actor. A
task is ready when that actor can begin without silently resolving a
consequential decision. Checklist completeness alone does not establish
readiness.

## Selecting a workflow

Before substantial implementation begins, add a concise kickoff comment to the
issue. Record:

- the selected lifecycle plays and why they fit the task;
- who will plan, implement, verify, review, and accept the work;
- meaningful checkpoints;
- whether the deliberate final review will occur before push or on the pull
  request;
- whether independent review will be used, with an optional reason; and
- known deviations from the normal delivery path.

The issue body remains the task contract. The kickoff comment records how the
team intends to execute that contract. Record material changes to the approach
on the issue; leave routine implementation detail in the code, commits, and
checks. If the agent is not authorized to edit GitHub state, it prepares the
proposed comment and waits for the human owner to post it or delegate that
action.

Engineering Reference does not prescribe one workflow for every task. Select
and combine the plays that add value. Illustrative compositions include:

- substantial delegated implementation: refinement, planning,
  implementation, verification, review, acceptance, and closure;
- familiar low-risk work: implementation, targeted verification, and
  review/acceptance;
- investigation: refinement, investigation and evidence, then a human
  decision, without implied implementation authority; and
- guided setup or learning: agent guidance, human execution, verification,
  and review where a deliverable requires it.

Plays may be combined, omitted, or revisited when the choice is explicit and
proportionate. Do not manufacture artifacts that add no control, evidence, or
understanding.

## Responsibilities and authority

The human owner controls the objective, consequential decisions, constraints,
delegated authority, finding disposition, acceptance, and merge. Agent
authorship does not transfer that responsibility.

Within an accepted issue contract, an implementing agent may normally:

- inspect repository files and history;
- edit files within scope;
- add or update relevant tests and documentation;
- run non-destructive checks and development commands;
- format the files it changed;
- generate or replace ignored, reproducible build output; and
- self-review its complete working-tree diff.

Unless the task explicitly delegates the action, stop before:

- changing the accepted issue contract, product behavior, or architecture;
- materially expanding or narrowing scope;
- adding, removing, or upgrading dependencies;
- accessing secrets or external systems;
- destructive or difficult-to-reverse operations;
- committing, pushing, editing remote GitHub state, or communicating
  externally;
- publishing, deploying, force-pushing, or rewriting history; or
- accepting findings, accepting the result, or merging.

Explicit delegation may authorize a normally reserved mechanical action such
as committing, pushing, or updating an issue. Human acceptance and merge
remain reserved.

The practical stop rule is simple: an agent may implement what the issue and
governing documents already authorize. It must stop if completing the work
appears to require changing those rules. Report the evidence found, the
decision required, and meaningful options rather than silently changing the
contract.

In particular, stop when unanticipated work would alter accepted product,
content, interaction, storage, architecture, runtime-contract, security,
sanitization, deterministic-generation, identity, ordering, accessibility,
dependency, CI, publication, or privacy rules. If the issue clearly authorizes
that exact change, proceed within its stated boundaries.

## Checkpoints

Use these checkpoints proportionally:

1. **Contract and plan** — resolve meaningful design choices, uncertainty, or
   substantial delegation before implementation. Small familiar changes may
   not need a separate plan artifact.
2. **Implementation** — produce a coherent proposed change, self-review the
   working-tree diff, and run relevant local checks.
3. **Review** — deliberately review the complete final diff with current
   verification evidence.
4. **Acceptance** — the human owner dispositions material findings and decides
   whether the result may be merged.

Between checkpoints, continue through clear, routine, reversible work without
requesting approval for every command, edit, or test. A stop condition returns
the work to the human owner before the next planned checkpoint.

## Branch and pull-request flow

1. Refine the issue sufficiently for its selected next play and place it in
   **Ready**.
2. Create a linked branch from an up-to-date `main`, begin work, and move the
   issue to **In Progress**. Use GitHub's generated issue branch name unless
   there is a concrete reason to change it.
3. Keep one bounded issue per branch. Complete unrelated discoveries, reject
   them with a reason, record them as blocked, or file concrete follow-ups.
4. After implementation, verification, and the deliberate final-diff review,
   commit and push using the authority agreed for the task.
5. Create a pull request that links or closes the issue and records the change
   summary, material decisions or deviations, AI-assisted contributions,
   verification evidence, and independent-review findings and disposition
   when applicable.
6. Leave Project and Milestone unset on the pull request; those belong to the
   issue and would otherwise create duplicate project items.
7. Move the issue to **Review** while CI and human acceptance are pending.
8. Merge only after current CI, review reconciliation, and human acceptance.
9. Confirm the issue is closed and **Done**, switch locally to `main`, update
   it, and remove merged local and remote branches.

## Verification

Verification describes the exact proposed revision. Report relevant checks as
passed, failed, unavailable, or not run. Do not claim that results from an
earlier revision cover later changes, and do not weaken the verification
contract merely to obtain a passing result.

Use the following project rules:

- GitHub Actions runs `npm run check` for every pull request to `main`.
- Application, tooling, content, dependency, or configuration changes require
  `npm run check` locally before push.
- Documentation-only changes require `npm run format:check` plus deliberate
  content and link review locally; CI still runs the complete gate.
- UI behavior changes also require relevant manual browser, keyboard,
  responsive, or accessibility observations.
- Focused tests are useful during implementation but do not replace the final
  applicable gate.
- `.generated/` is ignored, reproducible output and must not be committed.
- Material post-verification changes require rerunning the affected checks;
  CI must cover the final revision.

`npm run format` modifies managed files. `npm run format:check` only checks
their formatting. The complete `npm run check` command runs the formatting
check, lint, tool type checking, unit tests, the production build, and browser
tests as defined by `package.json` and CI.

## Review and acceptance

Perform one genuine review of the complete final change. The implementing
agent's continuous self-review is useful but is not the formal review.

When the deliberate review occurs before push, the pull-request checkpoint
confirms that the pushed revision matches the reviewed diff, checks current CI,
examines later deltas, and reconciles acceptance criteria and known gaps. Do
not present an unchanged reread by the same party as a new quality gate. Every
material post-review delta must be reviewed in the context of the complete
change and have its affected verification rerun.

When independent review is selected, give the reviewer the accepted issue
contract and amendments, governing repository documents, complete final diff,
and current verification evidence. The reviewer must not infer requirements
from the implementation or substitute preferred scope or architecture for
accepted decisions.

Classify material findings as:

- blocking defect;
- verification gap;
- contract concern; or
- follow-up or optional improvement.

The human owner accepts, rejects, or defers each material finding and decides
whether the task is accepted and may be merged. Passing checks and favorable
agent reviews inform but do not make that decision.

## Durable memory and handoff

Use existing repository and GitHub artifacts as durable memory:

- accepted product and architecture decisions belong in their governing
  `docs/` files;
- the issue body and accepted amendments hold the task contract;
- the kickoff comment records the selected workflow and responsibilities;
- branches and commits hold the proposed implementation;
- pull requests record the final summary, verification evidence, findings, and
  disposition; and
- concrete remaining work is completed, rejected with a reason, recorded as
  blocked, or filed as a follow-up issue.

Before pausing substantial unfinished work, add a concise issue comment that
records the current branch or revision, completed work, verification state,
unresolved matters, and next action. Preserve enough context for a capable
person or agent with no transcript to resume safely. An agent without authority
to edit GitHub prepares the handoff text and asks the human owner to post it or
delegate that action.

Full transcripts, temporary commands, tool traces, private reasoning, and
unaccepted exploration are not authoritative project memory.

## Entry points

[`../AGENTS.md`](../AGENTS.md) is the canonical agent entry point and routes
agents to this profile and the governing project documentation. Tool-specific
instruction files such as [`../CLAUDE.md`](../CLAUDE.md) redirect to the same
authority and must not introduce separate policy. The project README makes
this profile discoverable to human contributors.

# Spec: Csda Studio

## Premise

Csda Studio is a local-first SPA that lets pack authors open a
`pack.yaml`, see its reference graph, browse entities and read lint
output without leaving the browser. It is the companion studio for the
spec-driven workflow.

## Domain

`spec-driven authoring`

## Requirements (frozen for v0.1.0)

- **REQ-001 — Open pack from disk.** The user picks a file from their
  machine; the studio loads it.
- **REQ-002 — Schema validation on load.** Invalid YAML or schema
  violations are surfaced to the user, not swallowed.
- **REQ-003 — Browse requirements.** A list view with id, title,
  priority and status.
- **REQ-004 — Entity detail panel.** Selecting any entity (requirement,
  use case, command, aggregate, event) opens a read-only detail panel.
- **REQ-005 — Reference graph.** Show the `REQ → UC → CMD/QRY/AGG → EVT`
  spine.
- **REQ-006 — Dangling references.** Reference to a non-existent id is
  drawn as missing and listed separately.
- **REQ-007 — Scenario lint findings.** Surface the rules from
  `pack lint --strict` per scenario.
- **REQ-008 — Filter requirements by status.**
- **REQ-009 — Search across all entities.**
- **REQ-010 — Remember last opened path.**
- **REQ-011 — Light / dark theme toggle.**
- **REQ-012 — Empty state and onboarding hint.**
- **REQ-013 — Keyboard shortcut for the file picker.**
- **REQ-014 — Static deployment readiness.**
- **REQ-015 — Health endpoint for the deployment.**

## Out of scope (v0.1.0)

- Editing entities through forms.
- Saving back to disk.
- Inferring entries from features (would need to shell out).
- Loading a pack from a git URL.
- Diff view between two pack versions.

## Stack & architecture

Both live in `AI_RULES.md` so the implementer can find them in one
place. The spec stays stack-agnostic on purpose: another team could
ship this same product on a different stack and the spec would still
fit.

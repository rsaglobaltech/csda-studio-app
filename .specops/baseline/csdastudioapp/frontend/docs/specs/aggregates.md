# Aggregates

| ID | Aggregate | Context | Invariants |
| --- | --- | --- | --- |
| AGG-001 | PackDocument | BC-001 | Loaded pack must conform to the canonical pack schema before any view is shown., Entity references are resolved against the in-memory model, never the source string. |
| AGG-002 | ReferenceGraph | BC-002 | Every edge points at either a declared entity or a synthetic missing node. |
| AGG-003 | LintReport | BC-002 | Every finding carries the scenario id and the rule that produced it. |
| AGG-004 | StudioShell | BC-003 | Preferences persist in browser storage; cleared storage resolves to defaults. |

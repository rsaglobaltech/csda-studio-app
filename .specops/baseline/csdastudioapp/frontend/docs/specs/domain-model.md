# Domain Model

## Bounded Contexts

| ID | Name | Type | Responsibility | Aggregates |
| --- | --- | --- | --- | --- |
| BC-001 | Pack Browsing | Core | Loading, validating and exploring the loaded pack.yaml inside the studio. | AGG-001 PackDocument |
| BC-002 | Pack Insights | Core | Derived views over a loaded pack: reference graph, dangling references, scenario-quality findings. | AGG-002 ReferenceGraph, AGG-003 LintReport |
| BC-003 | Studio Shell | Supporting | Cross-cutting studio experience: preferences, shortcuts, empty state, deployment health. | AGG-004 StudioShell |

## Aggregates

| ID | Aggregate | Context | Invariants |
| --- | --- | --- | --- |
| AGG-001 | PackDocument | BC-001 | Loaded pack must conform to the canonical pack schema before any view is shown., Entity references are resolved against the in-memory model, never the source string. |
| AGG-002 | ReferenceGraph | BC-002 | Every edge points at either a declared entity or a synthetic missing node. |
| AGG-003 | LintReport | BC-002 | Every finding carries the scenario id and the rule that produced it. |
| AGG-004 | StudioShell | BC-003 | Preferences persist in browser storage; cleared storage resolves to defaults. |

## Value Objects

| ID | Value Object | Fields | Invariants |
| --- | --- | --- | --- |

## Domain Events

| ID | Event | Producer | Consumers | Payload |
| --- | --- | --- | --- | --- |
| EVT-001 | PackLoaded | PackDocument | ReferenceGraph, LintReport | pack_id, loaded_at |
| EVT-002 | PackValidationFailed | PackDocument | StudioShell | error_message, failed_at |
| EVT-003 | RequirementsListed | PackDocument | StudioShell | total, listed_at |
| EVT-004 | EntitySelected | PackDocument | StudioShell | entity_id, selected_at |
| EVT-005 | GraphRendered | ReferenceGraph | StudioShell | node_count, rendered_at |
| EVT-006 | DanglingReferencesDetected | ReferenceGraph | StudioShell | missing_count, detected_at |
| EVT-007 | LintCompleted | LintReport | StudioShell | findings_count, completed_at |
| EVT-008 | StatusFilterApplied | PackDocument | StudioShell | status, applied_at |
| EVT-009 | SearchExecuted | PackDocument | StudioShell | query, executed_at |
| EVT-010 | LastPathRemembered | StudioShell | StudioShell | path, remembered_at |
| EVT-011 | ThemeToggled | StudioShell | StudioShell | theme, toggled_at |
| EVT-012 | EmptyStateShown | StudioShell | StudioShell | shown_at |
| EVT-013 | PickerOpened | StudioShell | StudioShell | opened_at |
| EVT-014 | StaticBundleProduced | StudioShell | StudioShell | artifact_path, produced_at |
| EVT-015 | HealthReported | StudioShell | StudioShell | status, reported_at |

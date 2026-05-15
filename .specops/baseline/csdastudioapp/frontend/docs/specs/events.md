# Domain Events

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

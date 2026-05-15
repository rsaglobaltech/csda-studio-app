# Commands and Queries

## Commands

| ID | Command | Use Case | Fields |
| --- | --- | --- | --- |
| CMD-001 | LoadPackCommand | UC-001 | file |
| CMD-002 | ValidatePackCommand | UC-002 | parsed |
| CMD-003 | SelectEntityCommand | UC-004 | entity_id, entity_kind |
| CMD-004 | RenderGraphCommand | UC-005 | pack |
| CMD-005 | RunScenarioLintCommand | UC-007 | pack |
| CMD-006 | ApplyStatusFilterCommand | UC-008 | status |
| CMD-007 | RememberLastPathCommand | UC-010 | path |
| CMD-008 | ToggleThemeCommand | UC-011 | target_theme |
| CMD-009 | OpenFilePickerCommand | UC-013 | - |
| CMD-010 | BuildStaticBundleCommand | UC-014 | - |

## Queries

| ID | Query | Use Case | Returns |
| --- | --- | --- | --- |
| QRY-001 | BrowseRequirementsQuery | UC-003 | requirements |
| QRY-002 | ListDanglingReferencesQuery | UC-006 | missing_refs |
| QRY-003 | SearchEntitiesQuery | UC-009 | matches |
| QRY-004 | ShowEmptyStateQuery | UC-012 | hint |
| QRY-005 | GetHealthQuery | UC-015 | status |

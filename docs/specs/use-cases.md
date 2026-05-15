# Use Cases

| ID | Use Case | Actor | Requirement | Command/Query | Aggregate | Emits | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| UC-001 | Load Pack From Disk | Pack author | REQ-001 | CMD-001 LoadPackCommand | PackDocument | EVT-001 PackLoaded | Draft |
| UC-002 | Validate Loaded Pack | Pack author | REQ-002 | CMD-002 ValidatePackCommand | PackDocument | EVT-002 PackValidationFailed | Draft |
| UC-003 | Browse Requirements | Pack author | REQ-003 | QRY-001 BrowseRequirementsQuery | PackDocument | EVT-003 RequirementsListed | Draft |
| UC-004 | Show Entity Detail | Pack author | REQ-004 | CMD-003 SelectEntityCommand | PackDocument | EVT-004 EntitySelected | Draft |
| UC-005 | Render Reference Graph | Pack author | REQ-005 | CMD-004 RenderGraphCommand | ReferenceGraph | EVT-005 GraphRendered | Draft |
| UC-006 | Highlight Dangling References | Pack author | REQ-006 | QRY-002 ListDanglingReferencesQuery | ReferenceGraph | EVT-006 DanglingReferencesDetected | Draft |
| UC-007 | Surface Scenario Lint | Pack author | REQ-007 | CMD-005 RunScenarioLintCommand | LintReport | EVT-007 LintCompleted | Draft |
| UC-008 | Filter Requirements By Status | Pack author | REQ-008 | CMD-006 ApplyStatusFilterCommand | PackDocument | EVT-008 StatusFilterApplied | Draft |
| UC-009 | Search Entities | Pack author | REQ-009 | QRY-003 SearchEntitiesQuery | PackDocument | EVT-009 SearchExecuted | Draft |
| UC-010 | Remember Last Pack Path | Pack author | REQ-010 | CMD-007 RememberLastPathCommand | StudioShell | EVT-010 LastPathRemembered | Draft |
| UC-011 | Toggle Theme | Pack author | REQ-011 | CMD-008 ToggleThemeCommand | StudioShell | EVT-011 ThemeToggled | Draft |
| UC-012 | Show Empty State | Pack author | REQ-012 | QRY-004 ShowEmptyStateQuery | StudioShell | EVT-012 EmptyStateShown | Draft |
| UC-013 | Open File Picker With Shortcut | Pack author | REQ-013 | CMD-009 OpenFilePickerCommand | StudioShell | EVT-013 PickerOpened | Draft |
| UC-014 | Produce A Static Build | Release engineer | REQ-014 | CMD-010 BuildStaticBundleCommand | StudioShell | EVT-014 StaticBundleProduced | Draft |
| UC-015 | Report Deployment Health | Smoke test | REQ-015 | QRY-005 GetHealthQuery | StudioShell | EVT-015 HealthReported | Draft |

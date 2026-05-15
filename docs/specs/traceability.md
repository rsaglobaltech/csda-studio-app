# Traceability Matrix

Map requirements to scenarios, domain model elements, implementation artifacts, and tests.

| Requirement | Scenario ID | Feature file | Use Case | Command/Query | Aggregate | Event | Technical artifact | Test artifact | Status |
|---|---|---|---|---|---|---|---|---|---|
| REQ-000 | SCN-000 | `features/core/health.feature` | UC-000 Health baseline | QRY-000 HealthCheckQuery | - | - | `API /health`, smoke test | TBD | Draft |
| REQ-001 | SCN-001 | `features/pack-browsing/load_pack.feature` | UC-001 Load Pack From Disk | CMD-001 LoadPackCommand | AGG-001 PackDocument | EVT-001 PackLoaded | Pack loader adapter, PackPicker component | load_pack.steps | Draft |
| REQ-002 | SCN-002 | `features/pack-browsing/validate_schema.feature` | UC-002 Validate Loaded Pack | CMD-002 ValidatePackCommand | AGG-001 PackDocument | EVT-002 PackValidationFailed | Pack schema validator, Error banner component | validate_schema.steps | Draft |
| REQ-003 | SCN-003 | `features/pack-browsing/browse_requirements.feature` | UC-003 Browse Requirements | QRY-001 BrowseRequirementsQuery | AGG-001 PackDocument | EVT-003 RequirementsListed | Requirements list view | browse_requirements.steps | Draft |
| REQ-004 | SCN-004 | `features/pack-browsing/entity_detail.feature` | UC-004 Show Entity Detail | CMD-003 SelectEntityCommand | AGG-001 PackDocument | EVT-004 EntitySelected | Entity detail panel component | entity_detail.steps | Draft |
| REQ-005 | SCN-005 | `features/pack-insights/render_graph.feature` | UC-005 Render Reference Graph | CMD-004 RenderGraphCommand | AGG-002 ReferenceGraph | EVT-005 GraphRendered | Mermaid renderer adapter, Graph view component | render_graph.steps | Draft |
| REQ-006 | SCN-006 | `features/pack-insights/dangling_references.feature` | UC-006 Highlight Dangling References | QRY-002 ListDanglingReferencesQuery | AGG-002 ReferenceGraph | EVT-006 DanglingReferencesDetected | Reference graph builder, Diagnostics panel component | dangling_references.steps | Draft |
| REQ-007 | SCN-007 | `features/pack-insights/scenario_lint.feature` | UC-007 Surface Scenario Lint | CMD-005 RunScenarioLintCommand | AGG-003 LintReport | EVT-007 LintCompleted | Scenario lint engine, Lint findings list component | scenario_lint.steps | Draft |
| REQ-008 | SCN-008 | `features/pack-browsing/filter_by_status.feature` | UC-008 Filter Requirements By Status | CMD-006 ApplyStatusFilterCommand | AGG-001 PackDocument | EVT-008 StatusFilterApplied | Status filter component | filter_by_status.steps | Draft |
| REQ-009 | SCN-009 | `features/pack-browsing/search_entities.feature` | UC-009 Search Entities | QRY-003 SearchEntitiesQuery | AGG-001 PackDocument | EVT-009 SearchExecuted | Entity search index, Search bar component | search_entities.steps | Draft |
| REQ-010 | SCN-010 | `features/studio-shell/remember_last_path.feature` | UC-010 Remember Last Pack Path | CMD-007 RememberLastPathCommand | AGG-004 StudioShell | EVT-010 LastPathRemembered | Preferences storage adapter | remember_last_path.steps | Draft |
| REQ-011 | SCN-011 | `features/studio-shell/theme_toggle.feature` | UC-011 Toggle Theme | CMD-008 ToggleThemeCommand | AGG-004 StudioShell | EVT-011 ThemeToggled | Theme toggle component | theme_toggle.steps | Draft |
| REQ-012 | SCN-012 | `features/studio-shell/empty_state.feature` | UC-012 Show Empty State | QRY-004 ShowEmptyStateQuery | AGG-004 StudioShell | EVT-012 EmptyStateShown | Empty state component | empty_state.steps | Draft |
| REQ-013 | SCN-013 | `features/studio-shell/keyboard_shortcut.feature` | UC-013 Open File Picker With Shortcut | CMD-009 OpenFilePickerCommand | AGG-004 StudioShell | EVT-013 PickerOpened | Keyboard shortcut handler | keyboard_shortcut.steps | Draft |
| REQ-014 | SCN-014 | `features/studio-shell/static_deployment.feature` | UC-014 Produce A Static Build | CMD-010 BuildStaticBundleCommand | AGG-004 StudioShell | EVT-014 StaticBundleProduced | Production build pipeline | static_deployment.steps | Draft |
| REQ-015 | SCN-015 | `features/studio-shell/health_endpoint.feature` | UC-015 Report Deployment Health | QRY-005 GetHealthQuery | AGG-004 StudioShell | EVT-015 HealthReported | Static health.json asset | health_endpoint.steps | Draft |

Feature: Filter requirements
  As a pack author
  I want to filter requirements by status
  So that I can focus on the slice I am working on

  Scenario: Showing only Draft requirements
    Given I have loaded a pack with requirements in mixed statuses
    When I select the "Draft" status filter
    Then only requirements whose status is "Draft" are visible

Feature: Dangling reference highlighting
  As a pack author
  I want broken references to stand out
  So that I can fix them before tagging a pack release

  Scenario: A use case points at a missing event
    Given I have loaded a pack where "UC-002" emits "EVT-999"
    When I open the Graph view
    Then the node "EVT-999" is shown as missing
    And the diagnostics panel lists "UC-002 references unknown event: EVT-999"

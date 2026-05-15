Feature: Entity detail panel
  As a pack author
  I want to read the full detail of any entity
  So that I can verify its references without leaving the studio

  Scenario: Inspecting a use case
    Given I have loaded a pack
    When I select the use case "UC-001"
    Then I see its name
    And I see its actor
    And I see the requirement it satisfies
    And I see its command, aggregate and emitted events

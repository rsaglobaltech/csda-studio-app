Feature: Reference graph
  As a pack author
  I want to see the spine of my pack as a graph
  So that I can spot orphan entities and missing wiring

  Scenario: Rendering the spine of the loaded pack
    Given I have loaded the parking-management pack
    When I open the Graph view
    Then I see a node for each REQ, UC, CMD, AGG and EVT in the pack
    And an arrow from "REQ-001" to "UC-001"
    And an arrow from "UC-001" to "EVT-001"

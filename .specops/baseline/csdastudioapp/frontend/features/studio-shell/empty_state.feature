Feature: Empty state
  As a first-time visitor
  I want a clear hint about what to do
  So that I am not stuck at a blank screen

  Scenario: First-time visitor sees a hint
    Given I open the studio with no previous pack
    When the home view finishes rendering
    Then I see a hint inviting me to load a pack.yaml
    And I see a link to the example fixture pack

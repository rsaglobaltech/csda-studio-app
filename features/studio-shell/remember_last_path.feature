Feature: Remember the last pack
  As a pack author
  I want the studio to remember the last pack I opened
  So that I can resume work without re-navigating the file system

  Scenario: The studio re-opens with the last pack hint
    Given I previously loaded "fixtures/parking-management/backend/pack.yaml"
    When I close and re-open the studio in the same browser
    Then the home screen offers to re-open that path

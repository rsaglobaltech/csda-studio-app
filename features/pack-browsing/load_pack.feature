Feature: Open a pack from disk
  As a pack author
  I want to load a pack.yaml file from my machine
  So that I can inspect it inside the studio

  Scenario: Loading a valid pack.yaml from a file picker
    Given the studio is open with no pack loaded
    When I pick the file "fixtures/parking-management/backend/pack.yaml"
    Then the header shows "parking-management/backend"
    And the requirements panel lists at least one entry

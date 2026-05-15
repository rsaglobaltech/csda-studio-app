Feature: Schema validation on load
  As a pack author
  I want errors in my pack to be surfaced clearly
  So that I do not waste time chasing silent failures

  Scenario: A malformed pack file shows a clear error
    Given the studio is open with no pack loaded
    When I pick the file "fixtures/broken-no-id.yaml"
    Then I see the error "Required field 'id' missing on requirements[0]"
    And no entities are listed

Feature: Browse requirements
  As a pack author
  I want to see every requirement at a glance
  So that I can scan the scope of the loaded pack

  Scenario: Listing every requirement after loading a pack
    Given I have loaded a pack with 5 requirements
    When I open the Requirements view
    Then I see 5 rows
    And each row shows the requirement id, title and priority

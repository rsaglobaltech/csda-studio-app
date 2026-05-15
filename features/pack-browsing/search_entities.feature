Feature: Search
  As a pack author
  I want a single search field across every kind of entity
  So that I can find an id without knowing which list to look in

  Scenario: Searching by id substring
    Given I have loaded a pack with many entities
    When I type "EVT-00" in the search field
    Then the results panel lists every event whose id starts with "EVT-00"

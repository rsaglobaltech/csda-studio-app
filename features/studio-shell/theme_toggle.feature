Feature: Theme toggle
  As a pack author
  I want to switch between light and dark themes
  So that the studio fits the environment I am working in

  Scenario: Toggling to dark mode
    Given the studio is in light mode
    When I click the theme toggle
    Then the page background is dark
    And the theme choice persists across reloads

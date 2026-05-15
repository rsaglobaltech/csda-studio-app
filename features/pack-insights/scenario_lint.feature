Feature: Scenario-quality findings
  As a pack author
  I want lint findings shown next to the scenario they target
  So that I can tighten weak scenarios in place

  Scenario: A scenario with no Then step is flagged
    Given I have loaded a pack that contains a scenario without a Then step
    When I open the Lint view
    Then the scenario is flagged with "no Then step — the scenario asserts nothing"

Feature: Keyboard shortcut
  As a power user
  I want a keyboard shortcut to open the file picker
  So that I can work without reaching for the mouse

  Scenario: Cmd+O opens the file picker
    Given the studio is open
    When I press "Cmd+O" or "Ctrl+O"
    Then the file picker appears

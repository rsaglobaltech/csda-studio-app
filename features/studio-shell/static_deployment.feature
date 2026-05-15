Feature: Static deployment
  As a release engineer
  I want a production build that serves from any static host
  So that the studio can be hosted without a backend

  Scenario: The production build serves entirely from static files
    Given the project has been built with "npm run build"
    When the contents of "dist/" are served by any static file server
    Then the studio loads in the browser
    And the example fixture can be opened end-to-end

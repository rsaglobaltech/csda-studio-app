Feature: Health
  As a smoke test
  I want a health endpoint on the deployment
  So that I can verify the static bundle was served correctly

  Scenario: The deployment exposes a health JSON
    Given a built copy of the studio is being served
    When a client requests "/health.json"
    Then the response status is 200
    And the body parses as JSON containing "status: UP"

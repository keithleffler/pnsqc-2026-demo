Feature: Parabank Index Page – UI Verification

  Scenario: Verify index page accessibility
    Given the user navigates to the index page
    Then the user should see the ParaBank logo
    And the user should see the login form with fields:
      | Username |
      | Password |
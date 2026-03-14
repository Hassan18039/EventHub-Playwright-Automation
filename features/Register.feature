Feature: User Registration

  Scenario: New user can register and see logout
    Given I am on the login page
    When I go to the register page
    And I register with email "testing+unique@gmail.com" and password "Testing@123"
    Then I am logged in and see the logout button

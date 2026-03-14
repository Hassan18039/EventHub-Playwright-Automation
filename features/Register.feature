Feature: User Registration

  Scenario: New user can register and see logout
    Given I am on the login page
    When I go to the register page
    And I register with email "testing+unique@gmail.com" and password "Testing@123"
    Then I am logged in and see the logout button

  Scenario: Registration fails when password and confirm password do not match
    Given I am on the login page
    When I go to the register page
    And I try to register with email "negative@test.com" password "Testing@123" and confirm password "WrongPass@1"
    Then I should remain on the register page

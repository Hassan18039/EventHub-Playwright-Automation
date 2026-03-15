Feature: User Registration

  Background:
    Given I am on the login page
    And I navigate to the registration page

  Scenario: New user successfully registers
    When I register with valid credentials
    Then I am logged in
    And I see the logout button

  Scenario Outline: Registration fails for invalid input
    When I attempt to register with email "<email>" and password "<password>" and confirm password "<confirmPassword>"
    Then I should see error message "<errorMessage>"

    Examples:
      | email                | password       | confirmPassword  | errorMessage                   |
      | negative@test.com    | Testing@123    | WrongPass@1      | Passwords do not match         |
      | testing@gmail.com    | Testing@123    | Testing@123      | Email already registered       |
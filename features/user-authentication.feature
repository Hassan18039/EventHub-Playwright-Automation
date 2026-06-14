Feature: User Authentication
  As a user
  I want to log in and register with EventHub
  So that I can access my bookings and manage my events

  Background:
    Given user is on the EventHub application
  @regression
  Scenario: User successfully authenticates with valid credentials
    When user provides valid login credentials
    Then user is authenticated
    And user can access the home page
    And user logout option is available

  Scenario: User can create a new account
    When user provides valid registration details
    And user submits the registration form
    Then account is created successfully
    And user can login with new credentials

  Scenario: System validates email format during login
    When user provides invalid email format
    And user provides valid password
    Then system displays email validation error
    And user remains on authentication page

  Scenario: System validates required fields during login
    When user submits login form with empty fields
    Then system displays required field errors
    And user is not authenticated

  Scenario: User can logout from the application
    Given user is authenticated
    When user initiates logout
    Then user session is terminated
    And user is returned to login page

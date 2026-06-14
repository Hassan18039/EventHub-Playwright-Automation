Feature: Form Validation and Error Handling
  As a user
  I want the system to validate my inputs
  So that I receive clear feedback about any issues with my submissions

  Background:
    Given user is on the EventHub application

  Scenario: System validates required fields in registration form
    When user attempts to register without required fields
    Then system displays validation error messages
    And error messages identify missing fields
    And registration is not processed

  Scenario: System validates email format in registration
    When user provides invalid email format during registration
    Then system displays email validation error
    And user cannot proceed with registration

  Scenario: System validates password strength
    When user provides weak password during registration
    Then system displays password strength requirement
    And user must provide stronger password

  Scenario: System validates booking form with missing information
    When user attempts to book event without required details
    Then system displays required field errors
    And booking cannot be completed

  Scenario: System validates phone number format in booking
    When user provides invalid phone number in booking form
    Then system displays phone number format error
    And booking cannot be processed

  Scenario: System displays helpful error messages for failed operations
    When user performs operation that fails
    Then clear error message is displayed
    And error message explains the issue
    And user can retry or take corrective action

  Scenario: System validates name fields accept only valid characters
    When user enters special characters in name fields
    Then system accepts valid characters
    And system rejects invalid characters
    And validation message is displayed

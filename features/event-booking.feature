Feature: Event Booking
  As a user
  I want to book events
  So that I can secure my attendance at events of my choice

  Background:
    Given user is authenticated
    And user is on the home page

  Scenario: User can successfully book an available event
    When user navigates to events catalog
    And user selects an available event
    And user provides valid booking information
    And user confirms the booking
    Then booking is confirmed
    And confirmation details are displayed
    And booking reference number is provided

  Scenario: User can select ticket quantity before booking
    When user navigates to events catalog
    And user selects an event
    And user specifies desired ticket quantity
    Then total price is calculated correctly
    And price breakdown is visible

  Scenario: User receives confirmation after successful booking
    When user completes event booking process
    Then system confirms booking success
    And confirmation email is sent
    And booking details are saved to user account

  Scenario: System validates booking form fields
    When user attempts to book an event
    And user submits booking form with invalid data
    Then system displays validation errors
    And booking is not processed

  Scenario: System prevents overbooking beyond available capacity
    When user attempts to book tickets
    And requested quantity exceeds available tickets
    Then system displays capacity warning
    And booking is prevented
    And available ticket count is shown

  Scenario: User can cancel booking within allowed timeframe
    Given user has a confirmed booking
    When user initiates booking cancellation
    And cancellation is within allowed window
    Then booking is cancelled
    And refund is initiated
    And cancellation confirmation is provided

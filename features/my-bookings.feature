Feature: My Bookings Management
  As a user
  I want to manage my bookings
  So that I can view, modify, or cancel my event reservations

  Background:
    Given user is authenticated
    And user is on the home page

  Scenario: User can view all their bookings
    When user navigates to my bookings section
    Then user's bookings list is displayed
    And each booking shows event details
    And each booking shows booking date
    And each booking shows booking status

  Scenario: User can view detailed booking information
    When user navigates to my bookings section
    And user selects a booking
    Then booking details are displayed
    And event name is shown
    And event date and time are visible
    And ticket quantity is displayed
    And total amount paid is shown
    And booking reference number is visible

  Scenario: User can filter bookings by status
    When user navigates to my bookings section
    And user filters by booking status
    Then bookings are filtered accordingly
    And only matching bookings are displayed

  Scenario: User can search bookings by event name
    When user navigates to my bookings section
    And user searches for specific event
    Then matching bookings are displayed
    And search results are accurate

  Scenario: System displays upcoming and past bookings appropriately
    When user navigates to my bookings section
    Then upcoming bookings are clearly marked
    And past bookings are differentiated
    And booking status is indicated for each

  Scenario: User receives notification for upcoming events
    Given user has upcoming bookings
    When event date approaches
    Then user receives reminder notification
    And notification contains event details

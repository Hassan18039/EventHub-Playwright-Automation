Feature: Event Browsing and Discovery
  As a user
  I want to discover and view available events
  So that I can select and book events that interest me

  Background:
    Given user is authenticated
    And user is on the home page

  Scenario: User can view available events
    When user navigates to events catalog
    Then list of available events is displayed
    And each event shows title, date, and pricing
    And event count is greater than zero

  Scenario: User can filter events by category
    When user navigates to events catalog
    And user filters by event category
    Then filtered results are displayed
    And all results match the selected category
    And result count is accurate

  Scenario: User can sort events by price
    When user navigates to events catalog
    And user sorts events by price
    Then events are ordered by price
    And pricing information is visible

  Scenario: User can view detailed event information
    When user navigates to events catalog
    And user selects an event
    Then event details page is displayed
    And event description is visible
    And event date and time are displayed
    And event price is shown
    And booking option is available

  Scenario: System displays appropriate message when no events match criteria
    When user navigates to events catalog
    And user applies filter with no matching results
    Then appropriate message is displayed
    And option to clear filters is provided

  Scenario: User can navigate through multiple pages of events
    When user navigates to events catalog
    And multiple pages of results exist
    And user navigates to next page
    Then next set of events is displayed
    And pagination state is updated

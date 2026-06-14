# EventHub Feature Specifications

This directory contains Gherkin feature files for the EventHub event booking application. These files describe business-level scenarios in a format that both technical and non-technical stakeholders can understand.

## Features Overview

### 1. User Authentication (`user-authentication.feature`)
Covers user login, registration, and session management.

**Scenarios:**
- User successfully authenticates with valid credentials
- User can create a new account
- System validates email format during login
- System validates required fields during login
- User can logout from the application

**Key Validations:**
- Email format validation
- Required field validation
- Account creation
- Session management

### 2. Event Browsing (`event-browsing.feature`)
Covers event discovery, filtering, and detailed viewing.

**Scenarios:**
- User can view available events
- User can filter events by category
- User can sort events by price
- User can view detailed event information
- System displays appropriate message when no events match criteria
- User can navigate through multiple pages of events

**Key Validations:**
- Event listing and pagination
- Category filtering
- Price sorting
- Event detail display

### 3. Event Booking (`event-booking.feature`)
Covers the complete booking workflow.

**Scenarios:**
- User can successfully book an available event
- User can select ticket quantity before booking
- User receives confirmation after successful booking
- System validates booking form fields
- System prevents overbooking beyond available capacity
- User can cancel booking within allowed timeframe

**Key Validations:**
- Booking confirmation
- Price calculation
- Capacity management
- Cancellation processing

### 4. My Bookings (`my-bookings.feature`)
Covers booking management and history.

**Scenarios:**
- User can view all their bookings
- User can view detailed booking information
- User can filter bookings by status
- User can search bookings by event name
- System displays upcoming and past bookings appropriately
- User receives notification for upcoming events

**Key Validations:**
- Booking history display
- Status filtering
- Search functionality
- Notification system

### 5. Form Validation (`form-validation.feature`)
Covers input validation and error handling across the application.

**Scenarios:**
- System validates required fields in registration form
- System validates email format in registration
- System validates password strength
- System validates booking form with missing information
- System validates phone number format in booking
- System displays helpful error messages for failed operations
- System validates name fields accept only valid characters

**Key Validations:**
- Required field validation
- Email format validation
- Password strength validation
- Phone format validation
- Error message clarity

## Writing New Features

### Feature File Structure
```gherkin
Feature: Feature Name
  As a [user type]
  I want to [action]
  So that [benefit]

  Background:
    Given [setup step 1]
    And [setup step 2]

  Scenario: Descriptive scenario name
    When [user action]
    And [additional action]
    Then [expected result]
    And [additional assertion]
```

### Best Practices

1. **Use Business Language**
   - ✅ "User can successfully book an event"
   - ❌ "Test booking flow"

2. **Focus on "What" Not "How"**
   - ✅ "User submits login form"
   - ❌ "User clicks login button, enters credentials, clicks submit"

3. **One Scenario = One Business Rule**
   - Each scenario should test a single behavior
   - Keep scenarios independent and isolated

4. **Clear Given/When/Then Steps**
   - **Given:** Establish context/setup
   - **When:** Describe action(s)
   - **Then:** Verify outcome(s)

5. **Use Background for Common Setup**
   - Reduce duplication
   - Make scenarios more readable

## Running Features

### Execute All Features
```bash
npx kane-cli run features/ --report html
```

### Execute Specific Feature
```bash
npx kane-cli run features/user-authentication.feature --debug
```

### View Report
```bash
open gherkin-reports/index.html
```

## Feature File Naming Convention

- Use **kebab-case** for file names
- Name should describe the feature clearly
- Format: `feature-name.feature`

**Examples:**
- ✅ `user-authentication.feature`
- ✅ `event-booking.feature`
- ❌ `test.feature`
- ❌ `UserAuthentication.feature`

## Step Mapping to Kane CLI

Each Gherkin step is mapped to Kane CLI Chrome commands:

| Gherkin Step | Kane CLI Action | Example |
|--------------|-----------------|---------|
| `Given user is on the EventHub application` | Navigate to baseUrl | `kane-cli navigate https://...` |
| `When user provides valid login credentials` | Fill inputs and click button | `kane-cli fill input@email; kane-cli type password` |
| `Then user is authenticated` | Verify page/element state | `kane-cli assert-visible @logout-btn` |
| `And user can access the home page` | Verify URL or element | `kane-cli assert-url /home` |

## Reporting

Generated reports include:
- **HTML Report:** `gherkin-reports/index.html`
- **JSON Results:** `gherkin-reports/execution-summary.json`
- **Screenshots:** `gherkin-reports/screenshots/`
- **Execution Log:** `gherkin-reports/execution.log`

## Test Data

Test data is embedded in feature files through:

**Example with Scenario Outline:**
```gherkin
Scenario Outline: System validates form inputs
  When user provides "<email>" in email field
  Then system displays "<error>" message

  Examples:
    | email | error |
    | invalid | "Invalid email" |
    | blank | "Email required" |
```

## Maintenance

### Adding New Scenarios
1. Open the appropriate `.feature` file
2. Add new Scenario block following the structure
3. Use existing step patterns for consistency
4. Document complex steps

### Updating Existing Scenarios
1. Keep scenario name descriptive
2. Update steps to match application changes
3. Add comments for non-obvious steps
4. Test the scenario after updates

### Deprecated Scenarios
Mark with `@skip` tag:
```gherkin
@skip
Scenario: Old booking flow (deprecated)
  # This scenario is no longer relevant
```

## Quick Reference

| Task | Command |
|------|---------|
| Run all features | `npx kane-cli run features/ --report html` |
| Run single feature | `npx kane-cli run features/user-authentication.feature` |
| Run with debug | `npx kane-cli run features/ --debug --headed` |
| View last report | `open gherkin-reports/index.html` |
| Run specific scenario | `npx kane-cli run features/ --scenario "Name"` |

## Support

For questions or issues with features:
1. Check existing scenarios for examples
2. Review the Gherkin syntax guide
3. Consult with team on business rules
4. Update feature documentation

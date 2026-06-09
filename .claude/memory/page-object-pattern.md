---
name: page-object-pattern
description: How to implement and maintain the Page Object Model (POM) for EventHub tests
metadata:
  type: reference
---

# Page Object Model (POM) Reference

## What is POM?

Page Object Model is a design pattern where each page/component is represented as a class that:
- Encapsulates selectors and page-specific interactions
- Provides high-level public methods for tests to call
- Keeps implementation details hidden

**Benefit:** Tests stay readable and maintainable as UI changes.

## POM Structure

### Basic Page Object Template
```typescript
import { Locator, Page, expect } from '@playwright/test';

export class PageName {
  private page: Page;
  
  // Private selectors
  readonly heading: Locator;
  readonly submitBtn: Locator;
  readonly errorMsg: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Title' });
    this.submitBtn = page.getByRole('button', { name: 'Submit' });
    this.errorMsg = page.getByText('Error');
  }

  // Public methods for tests
  async navigate() {
    await this.page.goto('/path');
    await expect(this.page).toHaveURL(/\/path/);
  }

  async fillForm(data: string) {
    await this.heading.click();
  }

  async verifyPageLoaded() {
    await expect(this.heading).toBeVisible();
  }
}
```

### Where to Put Page Objects
```
pages/
  ├── auth/
  │   ├── Login.page.ts
  │   └── Register.page.ts
  ├── Events/
  │   ├── EventsPage.page.ts
  │   └── EventDetailsPage.page.ts
  ├── MyBookings/
  │   └── MyBookingsPage.page.ts
  └── NavBar/
      └── NavBar.page.ts
```

Organization is by **feature domain**, not by page type.

## Selector Best Practices

### ✅ Accessible Selectors (Preferred)
```typescript
// By role (most accessible)
page.getByRole('button', { name: 'Submit' })
page.getByRole('textbox', { name: 'Email' })
page.getByRole('heading', { level: 1 })

// By label (for form fields)
page.getByLabel('Password')
page.getByLabel('I agree to terms')

// By placeholder
page.getByPlaceholder('Enter email')

// By text (last resort)
page.getByText('Click me')
```

### ⚠️ Test ID Selectors (Only When Necessary)
```typescript
// Use when accessible selectors impossible
page.getByTestId('special-element')
```

Requires `data-testid` attribute in HTML.

### ❌ Brittle Selectors (Avoid)
```typescript
// ❌ CSS selectors (break on style changes)
page.locator('.btn-123')
page.locator('button.submit-btn')

// ❌ XPath (slow, brittle)
page.locator('//button[@class="submit"]')
page.locator('//div[contains(text(), "Submit")]')

// ❌ Index-based (break on layout changes)
page.locator('button').nth(0)
page.locator('input').first()
```

## Method Types

### Navigate Methods
```typescript
async navigate() {
  await this.page.goto('/login');
  await expect(this.page).toHaveURL(/\/login/);
}

async clickLink(name: string) {
  await this.page.getByRole('link', { name }).click();
}
```

### Action Methods
```typescript
async fillEmail(email: string) {
  await this.emailInput.fill(email);
}

async clickSubmitBtn() {
  await this.submitBtn.click();
}

async selectOption(label: string, value: string) {
  await this.page.getByLabel(label).selectOption(value);
}
```

### Verification Methods
```typescript
async verifyPageLoaded() {
  await expect(this.heading).toBeVisible();
}

async verifyErrorMessage(msg: string) {
  await expect(this.errorMsg).toContainText(msg);
}

async getErrorText(): Promise<string> {
  return await this.errorMsg.textContent() || '';
}
```

## Using POM in Tests

### With Custom Fixtures
```typescript
import { test, expect } from "../fixtures/baseTest";

test.describe("Login Flow", () => {
  test("should login successfully", async ({ loginPage, homePage }) => {
    // Fixture automatically instantiates loginPage and homePage
    await loginPage.navigate();
    await loginPage.fillEmail("user@test.com");
    await loginPage.fillPassword("password");
    await loginPage.clickSignInBtn();
    
    // Now verify via HomePage
    await homePage.verifyPageLoaded();
    expect(await homePage.getUserName()).toContain("User");
  });
});
```

### No Test Data Hardcoding
```typescript
// ❌ Bad
await loginPage.fillEmail("test@example.com");

// ✅ Good
import userData from "../../data/auth/user.json";
await loginPage.fillEmail(userData.validUser.email);
```

## Common Patterns

### Multi-Step User Flow
```typescript
export class EventDetailsPage {
  async fillAndSubmitBooking(name: string, email: string, phone: string) {
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
    await this.phoneInput.fill(phone);
    await this.submitBtn.click();
  }

  async verifyConfirmation() {
    await expect(this.confirmationMsg).toBeVisible();
  }
}

// Test usage
test("book event", async ({ eventDetailsPage }) => {
  await eventDetailsPage.fillAndSubmitBooking("John", "john@test.com", "1234567890");
  await eventDetailsPage.verifyConfirmation();
});
```

### State Verification
```typescript
export class EventsPage {
  async isEventAvailable(eventName: string): Promise<boolean> {
    return await this.page
      .getByText(eventName)
      .isVisible()
      .catch(() => false);
  }

  async getEventCount(): Promise<number> {
    return await this.page.getByRole('button', { name: 'Book Now' }).count();
  }
}

// Test usage
test("list events", async ({ eventsPage }) => {
  const available = await eventsPage.isEventAvailable("Concert 2024");
  expect(available).toBe(true);
  
  const count = await eventsPage.getEventCount();
  expect(count).toBeGreaterThan(0);
});
```

### Handling Dynamic Content
```typescript
export class HomePage {
  async clickEventByName(name: string) {
    await this.page
      .getByRole('article')
      .filter({ hasText: name })
      .getByRole('button', { name: 'Book' })
      .click();
  }

  async waitForEventToLoad(name: string) {
    await this.page
      .getByText(name)
      .waitFor({ state: 'visible', timeout: 5000 });
  }
}
```

## Refactoring Tips

### Extract Repeated Selectors
```typescript
// ❌ Before
async fillBookingForm(name: string) {
  await this.page.getByRole('textbox', { name: 'Full Name' }).fill(name);
}

// ✅ After
private nameInput = this.page.getByRole('textbox', { name: 'Full Name' });

async fillBookingForm(name: string) {
  await this.nameInput.fill(name);
}
```

### Combine Related Actions
```typescript
// ❌ Before
await loginPage.fillEmail(email);
await loginPage.fillPassword(password);
await loginPage.clickSignInBtn();

// ✅ After
async login(email: string, password: string) {
  await this.emailInput.fill(email);
  await this.passwordInput.fill(password);
  await this.signInBtn.click();
}

// Usage
await loginPage.login(email, password);
```

## Related Memories

- [[quality-standards]] — Code review checklist for page objects
- [[naming-conventions]] — File and method naming conventions
- [[test-commands]] — Commands for running and debugging tests

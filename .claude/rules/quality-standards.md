# Quality Standards

## Page Object Standards

### Selector Rules
- ✅ Use accessible selectors: `getByRole()`, `getByLabel()`, `getByPlaceholder()`, `getByText()`
- ✅ Use `getByTestId()` only when accessibility selectors are impossible
- ❌ Avoid xpath and brittle CSS selectors
- ❌ Avoid `page.locator('.btn-123')` or `page.locator('//button[@class="btn"]')`

### Page Object Structure
```typescript
import { Locator, Page, expect } from '@playwright/test';

export class PageName {
  private page: Page;
  readonly elementName: Locator;

  constructor(page: Page) {
    this.page = page;
    this.elementName = page.getByRole('button', { name: 'Label' });
  }

  async navigate() {
    await this.page.goto('/path');
    await expect(this.page).toHaveURL(/\/path/);
  }

  async action(params: string) {
    await this.elementName.click();
  }
}
```

### Method Naming
- Use verb-driven names: `click*`, `fill*`, `verify*`, `navigate*`
- Example: `clickBookNowBtn()`, `fillEmailField()`, `verifyPageLoaded()`

## Test Standards

### Test Structure
```typescript
import { test, expect } from "../fixtures/baseTest";

test.describe("Feature Name", () => {
  test.beforeEach(async ({ loginPage }) => {
    // Setup
  });

  test("should do specific thing", async ({ pageObject }) => {
    // Act
    await pageObject.action();
    
    // Assert
    expect(result).toBe(expected);
  });
});
```

### Test Rules
- ✅ One logical assertion per test (multiple related assertions OK)
- ✅ Descriptive test names that explain the scenario
- ✅ Setup via `test.beforeEach`, not inside test
- ✅ Use custom fixtures for page objects
- ❌ Do not hardcode test data — always use JSON files
- ❌ Do not have cross-test dependencies
- ❌ Do not use `.only` or `.skip` in main branch

### Assertion Rules
- Use Playwright's built-in assertions: `expect()`
- For async operations: `await expect(locator).toBeVisible()`
- For state checks: `expect(value).toBe(expected)`
- Avoid custom assertions unless truly reusable

## Test Data Standards

### File Organization
```
data/
  ├── auth/
  │   └── user.json
  ├── Book-Event/
  │   └── book-event.json
  └── MyFeature/
      └── scenarios.json
```

### JSON Structure
- Group related data together
- Use descriptive keys: `validUser`, `invalidFormData`, `edgeCaseScenario`
- Comment with `// Description` not allowed in JSON — use README instead

Example:
```json
{
  "validUser": {
    "email": "test@example.com",
    "password": "TestPass123"
  },
  "invalidFormData": {
    "email": "invalid-email",
    "password": "123"
  }
}
```

## Flaky Test Prevention

### Selector Best Practices
- Use `waitFor()` instead of hardcoded `page.waitForTimeout()`
- Check selector exists before interaction: `await locator.isVisible()`
- Use stable selectors that don't depend on dynamic content

### Timing Issues
- ✅ Let Playwright auto-wait (default: 30s timeout)
- ✅ Use `waitForLoadState('networkidle')` for AJAX operations
- ❌ Avoid hardcoded `await page.waitForTimeout(1000)`

### Debugging Flaky Tests
1. Run in headed mode: `npx playwright test --headed`
2. Use debug mode: `npx playwright test --debug`
3. Check selector in codegen: `npx playwright codegen https://eventhub.rahulshettyacademy.com`
4. Add explicit waits only if necessary

## Code Review Checklist

- [ ] Selectors use accessible APIs
- [ ] No hardcoded test data
- [ ] Page objects follow POM pattern
- [ ] Tests are independent
- [ ] No `.only` or `.skip` in code
- [ ] Meaningful test names
- [ ] No cross-browser compatibility issues
- [ ] Test data properly organized in `data/` directory

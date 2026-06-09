# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

EventHub Playwright is an end-to-end test automation suite for EventHub, a Rahul Shetty Academy event booking application. The project uses Playwright with TypeScript and follows the **Page Object Model (POM)** pattern for maintainability and scalability.

**Base URL:** `https://eventhub.rahulshettyacademy.com`

## Architecture

### Page Object Model (POM)
The `pages/` directory organizes page classes by domain/feature area:
- `pages/auth/` — Login and Register page objects
- `pages/Home/` — HomePage
- `pages/Events/` — EventsPage, EventDetailsPage
- `pages/MyBookings/` — MyBookingsPage
- `pages/NavBar/` — NavBar component

Each page object:
- Encapsulates page selectors and interactions
- Uses Playwright's `Locator` API with accessible selectors (`getByRole`, `getByLabel`, etc.)
- Exports only public methods; selectors are private
- Extends from `Page` class for navigation/assertions

### Custom Test Fixture (`tests/fixtures/baseTest.ts`)
Playwright's test fixture system pre-initializes page objects for every test:
```typescript
export const test = base.extend<CustomFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  // ... other page objects
});
```
Tests receive page objects as fixture parameters; no manual instantiation needed.

### Test Organization
- `tests/auth/` — Authentication tests (login, registration)
- `tests/Events/` — Event booking flow tests (success paths, validation, edge cases)
- `tests/fixtures/` — Shared test setup (baseTest, hooks)

### Test Data
`data/` directory stores test inputs (JSON files grouped by domain):
- `data/auth/user.json` — Credential and user profile data
- `data/Book-Event/book-event.json` — Event booking test scenarios

## Commands

| Command | Purpose |
|---------|---------|
| `npm run test` | Run all tests in Chromium, Firefox, and WebKit |
| `npm run test:ui` | Run tests with Playwright UI (debug mode) |

### Running Single Tests
```bash
npx playwright test tests/Events/book-event.spec.ts
npx playwright test -g "User can successfully book a ticket"
```

### Debugging
```bash
npx playwright test --debug
```

### Generating & Viewing Reports
- HTML reports are generated in `playwright-report/` after each run
- View: `npx playwright show-report`
- CI workflow uploads reports as artifacts

## Common Patterns

### Creating a New Page Object
1. Create `pages/<Domain>/<PageName>.page.ts`
2. Define selectors as private readonly properties using accessible selectors
3. Wrap user interactions in public async methods
4. Use Playwright assertions (`expect`) sparingly — return state for test assertions

Example:
```typescript
import { Locator, Page, expect } from '@playwright/test';

export class MyPage {
  private page: Page;
  readonly submitBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.submitBtn = page.getByRole('button', { name: 'Submit' });
  }

  async navigate() {
    await this.page.goto('/path');
    await expect(this.page).toHaveURL(/\/path/);
  }

  async fillForm(data: object) {
    // ... fill and interact
  }
}
```

### Adding a New Test
1. Import fixtures from `tests/fixtures/baseTest`
2. Access page objects through parameters
3. Use `test.beforeEach` for setup (e.g., login)
4. Keep test logic at a high level; delegate interactions to page objects

Example:
```typescript
import { test, expect } from "../fixtures/baseTest";

test.describe("Feature Name", () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigate();
    await loginPage.login("user@test.com", "password");
  });

  test("should do something", async ({ homePage, eventsPage }) => {
    await homePage.clickBrowseEventsBtn();
    // ... assertions
    expect(result).toBe(expected);
  });
});
```

### Adding Test Data
1. Create or update `data/<domain>/<scenario>.json`
2. Import in test file
3. Pass to page object methods

```typescript
import testData from "../../data/Book-Event/book-event.json";
await eventDetailsPage.fillBookingDetails(
  testData.invalidFormData.fullName,
  testData.invalidFormData.email,
  testData.invalidFormData.phone
);
```

## Key Files & Responsibilities

| File | Purpose |
|------|---------|
| `playwright.config.ts` | Configuration: base URL, reporters, browser projects, trace settings |
| `tests/fixtures/baseTest.ts` | Custom fixture extending Playwright; instantiates all page objects |
| `tests/**/*.spec.ts` | Test files; import baseTest fixture |
| `pages/**/*.page.ts` | Page object implementations |
| `data/**/*.json` | Test data (credentials, form inputs, assertions) |
| `.github/workflows/*.yml` | CI: installs deps, runs tests, uploads reports |

## Git Workflow

**IMPORTANT: Never push directly to main branch**

When you ask me to work on something:

1. **If you don't specify what to do:** I ask you first
   - "What do you want me to work on?"
   - "What's the branch name/description?"

2. **Once you tell me:** I determine the branch type based on the work
   - Adding tests? → `test/`
   - Fixing bugs? → `fix/`
   - New feature? → `feature/`
   - Updating docs? → `docs/`
   - Refactoring? → `refactor/`

3. **I propose the branch name:** "Should I create `test/add-validation-tests`?"

4. **You approve or suggest changes:** "Yes" or "Make it `test/add-edge-cases`"

5. Create branch: `git checkout -b your-branch-name`

6. Make changes and commit with clear messages

7. Push: `git push -u origin your-branch-name`

8. Create PR on GitHub

9. Wait for review and CI checks

10. Merge via GitHub UI

## Constraints & Conventions

- **Git:** Always create a branch (any type: feature/fix/test/docs/refactor); never push directly to main; use PRs for all changes
- **Selectors:** Use `getByRole`, `getByLabel`, `getByPlaceholder` for accessibility; avoid brittle xpath/css unless necessary
- **Page Objects:** Encapsulate page-specific logic; tests call high-level methods, not selectors
- **Test Data:** Never hardcode credentials or sensitive data in specs; use JSON files
- **Naming:** 
  - Page objects: `<PageName>.page.ts`
  - Test files: `<feature>.spec.ts`
  - Methods: verb-driven (e.g., `clickButton`, `fillForm`, `verifyPageLoaded`)
- **Reporters:** HTML and list reporters configured; no verbose test output
- **Parallelization:** `fullyParallel: true` in config — tests run concurrently per browser
- **CI:** 2 retries in CI, 0 local; `forbidOnly` prevents `.only` in main branch

## Browser Coverage

Tests run against three browser engines configured in `playwright.config.ts`:
- Chromium (Desktop Chrome)
- Firefox (Desktop Firefox)
- WebKit (Desktop Safari)

Disable specific browsers by removing from `projects` array or running:
```bash
npx playwright test --project=chromium
```

## Troubleshooting

- **Tests fail locally but pass in CI:** Check node version (`node --version`) and dependencies (`npm ci` vs `npm install`)
- **Flaky tests:** Use `.waitFor()` instead of hardcoded `page.waitForTimeout()`; verify selectors exist before interaction
- **Selector issues:** Run `npx playwright codegen https://eventhub.rahulshettyacademy.com` to inspect live selectors

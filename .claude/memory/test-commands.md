---
name: test-commands
description: Essential npm and Playwright commands for EventHub test automation
metadata:
  type: reference
---

# Test Commands Reference

## Running Tests

### All Tests (All Browsers)
```bash
npm run test
```
Runs all `.spec.ts` files in Chromium, Firefox, and WebKit. Generates HTML and list reports.

### Tests with UI (Interactive)
```bash
npm run test:ui
```
Opens Playwright Test UI for visual test exploration and debugging. Best for learning test flow.

## Playwright CLI

### Single Test File
```bash
npx playwright test tests/Events/book-event.spec.ts
```

### Test Matching Pattern
```bash
npx playwright test -g "should book a ticket"
```
Case-insensitive partial match. `-g "book"` matches "User can successfully book a ticket".

### Single Browser Only
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Debug Mode (Step Through)
```bash
npx playwright test --debug
```
Opens Playwright Inspector. Step through code line-by-line, inspect selectors, watch variables.

### Headed Mode (See Browser)
```bash
npx playwright test --headed
```
Shows browser window during test execution so you can watch actions happen.

### Combination: Debug + Headed + Single File
```bash
npx playwright test tests/Events/book-event.spec.ts --debug --headed --project=chromium
```
Best for troubleshooting why a test fails.

## Recording & Codegen

### Record New Test from Browser
```bash
npx playwright codegen https://eventhub.rahulshettyacademy.com
```
Opens browser. Click/type/interact with app. Claude generates test code. Useful for exploring UI.

### Record and Append to File
```bash
npx playwright codegen https://eventhub.rahulshettyacademy.com > tests/new-feature.spec.ts
```

## Reports

### Show Latest HTML Report
```bash
npx playwright show-report
```
Opens `playwright-report/index.html` in browser. Shows test results, screenshots, traces.

### Show Specific Report
```bash
npx playwright show-report playwright-report/index.html
```

### View Test Details
- Click test name in report to see steps
- Click screenshot icon to view page state
- Traces show DOM, network, console

## Installation & Setup

### Install Dependencies
```bash
npm install
```

### Install with Lock File (CI-safe)
```bash
npm ci
```
Strictly follows `package-lock.json`. Use in CI, not local development.

### Install Playwright Browsers
```bash
npx playwright install --with-deps
```
Required after fresh clone or Playwright version upgrade. Installs browser binaries.

### Install Single Browser
```bash
npx playwright install chromium
npx playwright install firefox
npx playwright install webkit
```

## Filtering & Options

### Run Tests from Specific Directory
```bash
npx playwright test tests/auth/
npx playwright test tests/Events/
```

### Exclude Tests
```bash
npx playwright test --grep-invert "wip"
```
Skips tests with "wip" in name.

### Update Snapshots
```bash
npx playwright test --update-snapshots
```
For visual regression testing (if used).

### Single Worker (Sequential)
```bash
npx playwright test --workers=1
```
Runs tests one-by-one instead of parallel. Useful for debugging race conditions.

### Retries
```bash
npx playwright test --retries=3
```
Retry failed tests up to 3 times. Useful for flaky test investigation.

## CI Commands

GitHub Actions runs:
```bash
npm ci
npx playwright install --with-deps
npm run test
```

Reports uploaded as artifacts with 30-day retention.

## Quick Cheat Sheet

| Task | Command |
|------|---------|
| Run all | `npm run test` |
| Interactive UI | `npm run test:ui` |
| One file | `npx playwright test tests/Events/book-event.spec.ts` |
| Matching pattern | `npx playwright test -g "book"` |
| Debug + see browser | `npx playwright test --debug --headed` |
| Record new test | `npx playwright codegen https://eventhub.rahulshettyacademy.com` |
| View report | `npx playwright show-report` |
| Single browser | `npx playwright test --project=chromium` |
| Sequential tests | `npx playwright test --workers=1` |

## Tips

- **`--debug --headed` combo:** Best for investigating test failures
- **Pattern matching:** `-g` is case-insensitive and does partial matching
- **Report exploration:** Use report screenshots and traces to understand test state
- **Codegen:** Great for exploring new workflows before writing tests
- **`--workers=1`:** Use when tests interfere with each other (rare in EventHub)

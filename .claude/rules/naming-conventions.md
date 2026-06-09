# Naming Conventions

## File Naming

### Page Objects
- Pattern: `<PageName>.page.ts`
- Examples: `Login.page.ts`, `EventDetailsPage.page.ts`, `HomePage.page.ts`
- Location: `pages/<Domain>/<PageName>.page.ts`

### Test Files
- Pattern: `<feature>.spec.ts`
- Examples: `book-event.spec.ts`, `register.spec.ts`, `login.spec.ts`
- Location: `tests/<Domain>/<feature>.spec.ts`

### Test Data Files
- Pattern: `<scenario>.json`
- Examples: `user.json`, `book-event.json`, `payment-data.json`
- Location: `data/<Domain>/<scenario>.json`

### Fixture Files
- Pattern: `<name>.ts`
- Examples: `baseTest.ts`, `hooks.ts`
- Location: `tests/fixtures/<name>.ts`

## Class Naming

### Page Objects
- Use PascalCase: `LoginPage`, `RegisterPage`, `EventDetailsPage`
- Be descriptive: `HomePage` not `Home`, `MyBookingsPage` not `BookingsPage`
- Export as default

### Custom Fixtures
```typescript
type CustomFixtures = {
  loginPage: LoginPage;
  registerPage: RegisterPage;
  homePage: HomePage;
};
```

## Method Naming

### Action Methods (Page Objects)
- Start with verb: `click*`, `fill*`, `select*`, `submit*`
- Examples:
  - `clickBookNowBtn()`
  - `fillEmailField(email: string)`
  - `selectEventCategory(category: string)`
  - `submitForm()`

### Verification Methods (Page Objects)
- Start with `verify*` or `get*`
- Examples:
  - `verifyPageLoaded()`
  - `verifyErrorMessage()`
  - `verifyQuantityAndPrice(price: number, qty: number)`
  - `getErrorText(): Promise<string>`

### Test Names
- Descriptive and specific
- Explain the scenario, not the code
- Examples:
  - ✅ "User can successfully book a ticket"
  - ✅ "System displays validation errors for empty fields"
  - ❌ "Test booking flow"
  - ❌ "Error handling"

## Variable Naming

### Locators (Private in Page Objects)
```typescript
private page: Page;
readonly emailInput: Locator;
readonly submitBtn: Locator;
readonly errorMessage: Locator;
```

### Test Data
```typescript
const user = {
  email: "test@example.com",
  password: "TestPass123"
};

const bookingData = {
  fullName: "John Doe",
  phone: "1234567890"
};
```

### Test Variables
```typescript
const isVisible = await element.isVisible();
const errorText = await errorElement.textContent();
const bookingConfirmed = await page.url().includes('/confirmation');
```

## Domain Organization

Organize by feature domains, not by type:

✅ Good:
```
pages/
  ├── auth/
  │   ├── Login.page.ts
  │   └── Register.page.ts
  ├── Events/
  │   ├── EventsPage.page.ts
  │   └── EventDetailsPage.page.ts
  └── MyBookings/
      └── MyBookingsPage.page.ts

data/
  ├── auth/
  │   └── user.json
  └── Book-Event/
      └── book-event.json

tests/
  ├── auth/
  │   └── register.spec.ts
  └── Events/
      └── book-event.spec.ts
```

❌ Avoid:
```
pages/
  ├── pages/
  │   └── Login.ts
  ├── utils/
  │   └── helpers.ts
  └── selectors/
      └── selectors.ts
```

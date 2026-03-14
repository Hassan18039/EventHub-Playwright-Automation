# Project Structure (Industry Standard)

```
EventHub Playwright/
├── features/                    # BDD feature files (Gherkin)
│   ├── auth/
│   │   └── register.feature
│   └── steps/
│       ├── auth/                # Step definitions per domain
│       │   └── register.steps.ts
│       └── support/             # Shared fixtures, hooks
│           └── fixtures.ts
├── pages/                       # Page Object Model
│   └── auth/
│       ├── Login.page.ts
│       └── Register.page.ts
├── data/                        # Test data (JSON, etc.)
│   └── auth/
│       └── register.json
├── .features-gen/               # Generated Playwright specs (do not edit)
├── playwright.config.ts
├── package.json
└── .gitignore
```

## Conventions

| Folder        | Purpose |
|---------------|--------|
| **features/** | Gherkin `.feature` files, grouped by domain (auth, booking, etc.) |
| **features/steps/** | Step definitions; `support/` for shared fixtures, subfolders mirror feature domains |
| **pages/**    | Page objects; one file per page, grouped by area (e.g. auth) |
| **data/**     | Test data files (e.g. JSON) per domain |

## Commands

- `npm run test` — Generate from features + run tests
- `npm run test:ui` — Same, with Playwright UI
- `npm run bddgen` — Only generate specs

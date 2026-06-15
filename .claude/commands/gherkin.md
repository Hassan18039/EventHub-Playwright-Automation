# /gherkin

Execute Gherkin feature tests directly with Kane-CLI. No scripts. No executor. Just real browser automation.

**Usage:**
```
/gherkin user-authentication              # Run TAGGED scenarios only (@regression, @smoke, etc.)
/gherkin user-authentication all          # Run ALL scenarios (including untagged)
/gherkin user-authentication @regression  # Run ONLY @regression scenarios
/gherkin event-booking @critical          # Run ONLY @critical scenarios
/gherkin all                              # All features, tagged scenarios only
/gherkin all all                          # All features, ALL scenarios
```

---

## HOW IT WORKS

This command does NOT use any script. It works by:

1. **Parse Arguments** → Extract feature name, tag filter, and flags from `$ARGUMENTS`
2. **Read Feature File** → Load `features/<name>.feature` using the Read tool
3. **Parse Scenarios** → Extract each Scenario with its tags
4. **Auto-Filter by Tags**:
   - No tag specified → run only scenarios WITH tags (skip untagged)
   - Tag specified (e.g. `@regression`) → run ONLY that tag
   - `all` specified → run ALL scenarios including untagged
5. **Read Credentials** → Load from `data/auth/user.json` (email, password)
6. **Read Config** → Load `.kanerc` for baseUrl, timeout, maxSteps
7. **For Each Scenario** → Build a Kane-CLI objective from the scenario steps + Background steps, inject credentials via `--variables`, execute with:
   ```bash
   export KANE_CLI_USER_AGENT=claude-code
   kane-cli run "<objective>" --agent --variables '{"email":{"value":"..."},"password":{"value":"...","secret":true}}' --max-steps <maxSteps> --timeout <timeout>
   ```
8. **Parse NDJSON Output** → Track pass/fail per scenario
9. **Generate Timestamped Report** → Create `gherkin-reports/YYYY-MM-DD_HHMM/` with `report.html` and `results.json`
10. **Show Summary** → Display results table with LambdaTest links

---

## OBJECTIVE BUILDING RULES

When building the Kane-CLI objective from a Gherkin scenario:

- Start with: `Navigate to <baseUrl>`
- Append Background steps (translated to plain English actions)
- Append each scenario step (Given/When/Then/And → plain English)
- Inject credentials using `{{email}}` and `{{password}}` variables in the objective
- Keep it imperative and action-oriented

Example — Scenario: "User successfully authenticates with valid credentials":
```
Navigate to https://eventhub.rahulshettyacademy.com. Login with email {{email}} and password {{password}}. Verify user is authenticated and can access the home page. Verify logout option is available in the navigation.
```

---

## CREDENTIAL MAPPING

| Feature | Credentials Source | Variables |
|---------|-------------------|-----------|
| user-authentication | `data/auth/user.json` → `validUser` | email, password |
| event-booking | `data/auth/user.json` → `validUser` | email, password |
| form-validation | `data/auth/user.json` → `validUser` | email, password |
| my-bookings | `data/auth/user.json` → `validUser` | email, password |
| event-browsing | `data/auth/user.json` → `validUser` | email, password |

Always pass credentials as `--variables` JSON with `secret: true` for password.

---

## REPORT FORMAT

After all scenarios complete, generate a timestamped report folder:

```
gherkin-reports/
└── 2026-06-15_1430/
    ├── report.html    ← HTML with results, steps, LambdaTest links
    └── results.json   ← Raw JSON results
```

Then show this summary:

```
╔════════════════════════════════════════════════════╗
║         GHERKIN EXECUTION SUMMARY                  ║
╚════════════════════════════════════════════════════╝

📂 Feature: user-authentication
🏷️  Filter: @regression (1 of 5 scenarios)

  ✅ PASS | User successfully authenticates with valid credentials (109.6s)

╔════════════════════════════════════════════════════╗
✅ Passed:  1
❌ Failed:  0
📊 Total:   1 executed (4 skipped)
⏱️  Duration: 109.6s

📁 Report: gherkin-reports/2026-06-15_1430/
🔗 LambdaTest: <test_url from run_end>
╚════════════════════════════════════════════════════╝
```

---

## REPORT GENERATION

After collecting all results, write two files:

**results.json** — Raw results array:
```json
{
  "feature": "user-authentication",
  "filter": "@regression",
  "timestamp": "2026-06-15_1430",
  "scenarios": [
    {
      "name": "User successfully authenticates with valid credentials",
      "tags": ["@regression"],
      "status": "passed",
      "duration": 109.6,
      "test_url": "https://test-manager.lambdatest.com/...",
      "summary": "..."
    }
  ],
  "passed": 1,
  "failed": 0,
  "total": 1
}
```

**report.html** — Simple HTML with scenario results table, duration, status badges, and LambdaTest links.

---

## TAGS

- `@regression` — Regression tests
- `@smoke` — Quick sanity checks  
- `@critical` — High-priority flows
- `@wip` — Work in progress

---

## FEATURE → FILE MAPPING

| Argument | Feature File |
|----------|-------------|
| `authentication` or `user-authentication` or `user-auth` | `features/user-authentication.feature` |
| `booking` or `event-booking` | `features/event-booking.feature` |
| `browsing` or `event-browsing` | `features/event-browsing.feature` |
| `validation` or `form-validation` | `features/form-validation.feature` |
| `bookings` or `my-bookings` | `features/my-bookings.feature` |
| `all` | All feature files in `features/` |

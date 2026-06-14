# /gherkin

Execute Gherkin feature tests with Kane-CLI directly. Automatic execution, no questions.

**Usage:**
```bash
/gherkin user-authentication              # AUTO: Run all TAGGED scenarios (@regression, @smoke, etc.)
/gherkin user-authentication all          # Execute ALL scenarios (including untagged)
/gherkin user-authentication @regression  # Execute ONLY @regression scenarios
/gherkin event-booking @critical          # Execute ONLY @critical scenarios
/gherkin all                               # All features, all TAGGED scenarios
/gherkin all all                           # All features, ALL scenarios (including untagged)
/gherkin user-auth --timeout 900          # Custom timeout (auto-tagged)
/gherkin event-booking --headless         # Headless mode (auto-tagged)
```

---

## **AUTOMATIC EXECUTION FLOW**

When you invoke this command:

1. **Parse Arguments** → Extract feature name, tags, flags
2. **Load Config** → Read `.kanerc` (URL, credentials, timeout)
3. **Read Feature File** → Load `features/<name>.feature`
4. **Parse Scenarios** → Extract all scenarios and their tags
5. **Auto-Filter by Tags** → 
   - If NO tag specified: Run ALL scenarios WITH tags (skip untagged)
   - If tag specified: Run ONLY that tag (e.g., @regression)
   - If `all` specified: Run ALL scenarios (including untagged)
6. **Load Test Data** → Load related data files
7. **Execute in Real Browser** → Run each scenario with Kane-CLI
8. **Capture Screenshots** → Save screenshot for each scenario to `gherkin-reports/screenshots/`
9. **Collect Results** → Track pass/fail for all scenarios with test URLs
10. **Create Timestamped Folder** → Generate `gherkin-reports/YYYY-MM-DD_HHMM/` directory
11. **Generate Report** → Create HTML + JSON reports inside timestamped folder with screenshots and test links
12. **Show Summary** → Display results with folder location and report links

**No questions. No options. Just execute.**

---

## **EXAMPLES**

### Example 1: Auto-Tagged Scenarios (DEFAULT)
```bash
/gherkin user-authentication
```
**Result:** Executes only TAGGED scenarios (1 @regression out of 5 total)

---

### Example 2: All Scenarios (Including Untagged)
```bash
/gherkin user-authentication all
```
**Result:** Executes ALL 5 scenarios (tagged + untagged)

---

### Example 3: Specific Tag Only
```bash
/gherkin user-authentication @regression
```
**Result:** Executes only @regression scenarios (1 scenario)

---

### Example 4: Custom Timeout (Auto-Tagged)
```bash
/gherkin event-booking --timeout 900
```
**Result:** Executes all TAGGED scenarios with 900s timeout

---

### Example 5: Headless Mode (Auto-Tagged)
```bash
/gherkin form-validation --headless
```
**Result:** Executes all TAGGED scenarios without visible browser

---

### Example 6: All Features, Tagged Only
```bash
/gherkin all
```
**Result:** Executes all TAGGED scenarios from all features

---

### Example 7: All Features, All Scenarios
```bash
/gherkin all all
```
**Result:** Executes ALL scenarios from all features (tagged + untagged)

---

## **OUTPUT FORMAT**

```
╔════════════════════════════════════════════════════╗
║   GHERKIN EXECUTOR - Real Browser Tests          ║
╚════════════════════════════════════════════════════╝

📂 Feature: user-authentication
✅ Parsed: User Authentication
📦 Data: user.json, register.json

🏷️  Filter: @regression (1 out of 5 scenarios)
🚀 Executing in real browser...

  ▶ @regression | User successfully authenticates with valid credentials
    ✅ PASS (91.4s)

╔════════════════════════════════════════════════════╗
║                  EXECUTION SUMMARY                 ║
╚════════════════════════════════════════════════════╝

✅ Passed:  1
❌ Failed:  0
📊 Total:   1 executed (4 skipped)
⏱️  Duration: 91.4 seconds

🏷️  Tag Summary:
   @regression:  1 passed, 0 failed

📁 Report Directory: gherkin-reports/2026-06-14_1630/
   📄 HTML Report: report.html
   📄 JSON Report: results.json

✨ All executed tests passed!
```

## **Report Storage**

Each run automatically creates a **timestamped folder**:

```
gherkin-reports/
├── 2026-06-14_1630/          ← Today's 4:30 PM run
│   ├── report.html           ← HTML report with screenshots
│   └── results.json          ← JSON with all data
├── 2026-06-14_1500/          ← Today's 3:00 PM run
│   ├── report.html
│   └── results.json
├── 2026-06-13_1145/          ← Yesterday's 11:45 AM run
│   ├── report.html
│   └── results.json
```

**No overwrites. No confusion. Every run is saved.**

---

## **CONFIGURATION (.kanerc)**

```json
{
  "baseUrl": "https://eventhub.rahulshettyacademy.com",
  "credentials": {
    "email": "testing@gmail.com",
    "password": "Testing@123"
  },
  "timeout": 600,
  "maxSteps": 100
}
```

---

## **DATA FILES**

| Feature | Data Files |
|---------|-----------|
| user-authentication | data/auth/user.json, data/auth/register.json |
| event-booking | data/Book-Event/book-event.json, data/auth/user.json |
| event-browsing | data/admin/manage-events.json |
| form-validation | data/Book-Event/book-event.json |
| my-bookings | data/auth/user.json |

---

## **TAGS**

- `@regression` — Regression tests
- `@smoke` — Quick sanity checks
- `@critical` — High-priority flows
- `@wip` — Work in progress

---

## **QUICK REFERENCE**

```bash
/gherkin user-auth                    # Tagged scenarios only (DEFAULT)
/gherkin user-auth all                # ALL scenarios (tagged + untagged)
/gherkin user-auth @regression        # @regression only
/gherkin user-auth @critical          # @critical only
/gherkin user-auth @regression @smoke # @regression or @smoke
/gherkin user-auth --timeout 1200     # Tagged scenarios, 20min timeout
/gherkin user-auth --headless         # Tagged scenarios, headless
/gherkin all                           # All features, tagged scenarios
/gherkin all all                       # All features, all scenarios
```

**Smart default: Auto-filter by tags. No need to type them.**

# Claude Code Configuration — EventHub Playwright

This directory contains Claude Code configurations for the EventHub Playwright test automation project.

## 📁 Directory Structure

```
.claude/
├── README.md                          # This file
├── settings.json                      # Claude Code settings
├── CLAUDE.md                          # Project documentation (root level)
├── agents/
│   └── test-automation-agent.md      # Agent roles and capabilities
├── rules/
│   ├── quality-standards.md          # Code quality checklist
│   └── naming-conventions.md         # Naming patterns for files, classes, methods
└── memory/
    ├── test-commands.md              # Essential npm/npx commands
    ├── page-object-pattern.md        # POM guide and best practices
    └── [future memories]             # Extended project knowledge
```

## 🎯 Key Files Overview

### Root Level
- **[CLAUDE.md](/CLAUDE.md)** — Architecture overview, common patterns, troubleshooting

### Agents (`agents/`)
- **test-automation-agent.md** — What Claude can do in this repo (page objects, tests, data)

### Rules (`rules/`)
- **quality-standards.md** — Code review checklist, selector best practices, flaky test prevention
- **naming-conventions.md** — File naming, class naming, method naming, domain organization

### Memory (`memory/`)
- **test-commands.md** — All npm/npx commands with examples
- **page-object-pattern.md** — POM guide, selector best practices, refactoring tips

## 🚀 Quick Start

1. **Read Project Documentation**
   ```bash
   cat CLAUDE.md
   ```

2. **Learn POM Pattern**
   ```bash
   cat .claude/memory/page-object-pattern.md
   ```

3. **Run Tests**
   ```bash
   npm run test                    # All browsers
   npm run test:ui                # Interactive UI
   npx playwright test --debug    # Debug mode
   ```

4. **Create New Test**
   - Follow quality standards in `.claude/rules/quality-standards.md`
   - Use naming conventions from `.claude/rules/naming-conventions.md`
   - Reference test commands from `.claude/memory/test-commands.md`

## 📋 Key Patterns

### Page Object
```typescript
export class LoginPage {
  private page: Page;
  readonly emailInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByRole('textbox', { name: 'Email' });
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
  }
}
```

### Test
```typescript
import { test, expect } from "../fixtures/baseTest";
import userData from "../../data/auth/user.json";

test("should login", async ({ loginPage, homePage }) => {
  await loginPage.navigate();
  await loginPage.login(userData.validUser.email, userData.validUser.password);
  await homePage.verifyPageLoaded();
});
```

### Test Data
```json
{
  "validUser": {
    "email": "test@example.com",
    "password": "TestPass123"
  }
}
```

## ✅ Quality Gates

Before committing, verify:
- [ ] Selectors use accessible APIs (`getByRole`, `getByLabel`)
- [ ] No hardcoded test data — use JSON files
- [ ] Page objects follow POM pattern
- [ ] Tests are independent (no cross-test dependencies)
- [ ] No `.only` or `.skip` in code
- [ ] Test names are descriptive
- [ ] Files follow naming conventions

See `.claude/rules/quality-standards.md` for full checklist.

## 📚 Documentation Map

| Need | File |
|------|------|
| Architecture overview | [CLAUDE.md](/CLAUDE.md) |
| What Claude can do | [test-automation-agent.md](.claude/agents/test-automation-agent.md) |
| Code quality rules | [quality-standards.md](.claude/rules/quality-standards.md) |
| File/method naming | [naming-conventions.md](.claude/rules/naming-conventions.md) |
| How to run tests | [test-commands.md](.claude/memory/test-commands.md) |
| POM best practices | [page-object-pattern.md](.claude/memory/page-object-pattern.md) |

## 🔍 For Future Claude Sessions

All information needed to work effectively in this repo is documented here. Future instances of Claude Code will:
1. Read [CLAUDE.md](/CLAUDE.md) for architecture
2. Reference [test-automation-agent.md](.claude/agents/test-automation-agent.md) for capabilities
3. Follow rules in `.claude/rules/`
4. Use memory files for deep reference

---

**Last Updated:** 2026-06-09  
**Playwright Version:** ^1.59.1  
**Base URL:** https://eventhub.rahulshettyacademy.com

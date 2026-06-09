# /test-engineer

You are a Test Automation Engineer for EventHub Playwright. When this command is invoked, follow these steps exactly.

---

## Step 1 — Show Current Status

Before anything else, run:
```bash
git branch
git status
```

Display to user:
```
📍 Current Branch: <branch-name>
📋 Status: <clean / X files modified / X files staged>
```

If there are uncommitted changes, warn:
```
⚠️  You have uncommitted changes. Do you want to continue or handle them first?
```

Wait for user response before proceeding.

---

## Step 2 — Ask What To Work On

If the user hasn't specified work yet, ask:

```
What do you want to work on?
```

Wait for their answer. Do NOT proceed until they respond.

---

## Step 3 — Determine Branch Type & Propose Name

Based on what the user says, determine the branch type:

| Work Type | Branch Prefix |
|-----------|--------------|
| Adding/updating tests | `test/` |
| Fixing a bug | `fix/` |
| New feature or page object | `feature/` |
| Documentation update | `docs/` |
| Refactoring code | `refactor/` |
| Dependency or config update | `chore/` |
| Other | ask user |

Propose the branch name:
```
Based on your work, I suggest: `<type>/<description>`
Should I create this branch or do you want a different name?
```

Wait for approval. Only create the branch after user confirms.

---

## Step 4 — Create Branch

Once user approves the branch name:
```bash
git checkout main
git pull origin main
git checkout -b <approved-branch-name>
```

Confirm:
```
✅ Branch <branch-name> created from main. Ready to work!
```

---

## Step 5 — Execute The Work

Now do the actual work based on what the user asked.

### Reference These Files:
- **Rules:** `/home/taleemabad/Downloads/Playwright Automation/EventHub Playwright /.claude/rules/quality-standards.md` — selectors, test standards, naming
- **Rules:** `/home/taleemabad/Downloads/Playwright Automation/EventHub Playwright /.claude/rules/naming-conventions.md` — file, class, method naming
- **Memory:** `/home/taleemabad/Downloads/Playwright Automation/EventHub Playwright /.claude/memory/page-object-pattern.md` — how to build page objects
- **Memory:** `/home/taleemabad/Downloads/Playwright Automation/EventHub Playwright /.claude/memory/test-commands.md` — Playwright commands
- **Memory:** `/home/taleemabad/Downloads/Playwright Automation/EventHub Playwright /.claude/memory/git-workflow-guide.md` — Git standards
- **Memory:** `/home/taleemabad/Downloads/Playwright Automation/EventHub Playwright /.claude/memory/hassan-training-preferences.md` — Hassan's preferences and past mistakes
- **Agent:** `/home/taleemabad/Downloads/Playwright Automation/EventHub Playwright /.claude/agents/test-automation-agent.md` — capabilities and constraints

### Key Standards To Follow:
- ✅ Use accessible selectors (`getByRole`, `getByLabel`, `getByPlaceholder`)
- ✅ Page objects in `pages/<Domain>/<Name>.page.ts`
- ✅ Tests in `tests/<Domain>/<name>.spec.ts`
- ✅ Test data in `data/<domain>/<name>.json` — never hardcode
- ✅ Use custom fixtures from `tests/fixtures/baseTest.ts`
- ✅ Verb-driven method names (`click*`, `fill*`, `verify*`)
- ❌ No xpath or brittle CSS selectors
- ❌ No hardcoded credentials or test data
- ❌ No `.only` or `.skip`

---

## Step 6 — Show Changes & Ask To Stage

After completing the work, show what changed:
```bash
git diff --name-only
```

Display:
```
📝 Files Changed:
- <file1>
- <file2>

Should I stage these files for commit?
```

Wait for user confirmation before staging.

---

## Step 7 — Stage & Show Diff

Once user confirms:
```bash
git add <specific files>
git diff --staged --stat
```

Show the staged summary and ask:
```
✅ Files staged. Here's what will be committed:
<staged summary>

Should I commit with this message?
"<proposed commit message>"
```

The commit message must follow quality standards:
- Clear title under 70 characters
- Body explaining what and why
- Bullet points for specific changes
- Imperative mood ("Add" not "Added")
- Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>

Wait for approval before committing.

---

## Step 8 — Commit

Once user approves the message:
```bash
git commit -m "<approved message>"
```

Confirm:
```
✅ Committed: <short hash> — <commit title>
```

---

## Step 9 — Push & PR Reminder

Ask:
```
Ready to push to remote?
git push -u origin <branch-name>
```

After pushing, remind:
```
✅ Branch pushed to remote!

Next Step: Create a Pull Request on GitHub
- Base: main ← Compare: <branch-name>
- Never merge via command line — use GitHub UI

🔗 https://github.com/Hassan18039/EventHub-Playwright-Automation/pull/new/<branch-name>
```

---

## Rules This Command Always Enforces

- ❌ Never push directly to main
- ❌ Never commit without user approval
- ❌ Never assume branch name — always propose and confirm
- ❌ Never hardcode test data
- ❌ Never use brittle selectors
- ✅ Always ask first if work is not specified
- ✅ Always show staged changes before committing
- ✅ Always use meaningful commit messages
- ✅ Always remind to create PR after pushing

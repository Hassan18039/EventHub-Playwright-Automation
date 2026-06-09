# /save-session

Run at the end of every conversation to store learnings, update memory, and prevent repeating past mistakes.

---

## Step 1 — Read Past Mistakes First

Before doing anything, read `/home/taleemabad/Downloads/Playwright Automation/EventHub Playwright /.claude/memory/hassan-training-preferences.md`.

Check the "Mistakes To Avoid" section. Ask yourself:
- Did any of these mistakes happen again this session?
- Did a NEW mistake happen that isn't listed yet?

If a known mistake repeated → it must be reinforced more strongly in memory.
If a new mistake happened → it must be added immediately.

---

## Step 2 — Review The Conversation

Identify:
1. **What was built or changed?**
2. **What decisions were made and why?**
3. **What mistakes happened?** (wrong approach, had to undo, user corrected Claude)
4. **What did Hassan approve or correct?**
5. **What is still pending?**

---

## Step 3 — Update Memory Files

Update only what is NEW or CHANGED. Do not duplicate existing content.

| What Was Learned | File To Update |
|-----------------|----------------|
| Git workflow correction | `/home/taleemabad/Downloads/Playwright Automation/EventHub Playwright /.claude/memory/git-workflow-guide.md` |
| Hassan corrected Claude's behavior | `/home/taleemabad/Downloads/Playwright Automation/EventHub Playwright /.claude/memory/hassan-training-preferences.md` |
| New mistake to avoid | `/home/taleemabad/Downloads/Playwright Automation/EventHub Playwright /.claude/memory/hassan-training-preferences.md` → "Mistakes To Avoid" |
| Known mistake repeated | `/home/taleemabad/Downloads/Playwright Automation/EventHub Playwright /.claude/memory/hassan-training-preferences.md` → strengthen the rule |
| New POM pattern | `/home/taleemabad/Downloads/Playwright Automation/EventHub Playwright /.claude/memory/page-object-pattern.md` |
| New Playwright tip | `/home/taleemabad/Downloads/Playwright Automation/EventHub Playwright /.claude/memory/test-commands.md` |
| New code rule | `/home/taleemabad/Downloads/Playwright Automation/EventHub Playwright /.claude/rules/quality-standards.md` |
| New naming pattern | `/home/taleemabad/Downloads/Playwright Automation/EventHub Playwright /.claude/rules/naming-conventions.md` |

### Rules For Updating
- ✅ Add the WHY behind every mistake — not just what happened
- ✅ If a mistake repeated, make the rule stronger, not just duplicate it
- ✅ Remove outdated content if something was corrected this session
- ✅ Keep entries short and actionable
- ❌ No commit hashes, dates, or session-specific details
- ❌ No obvious things Claude already knows
- ❌ No duplicate rules already in the file

---

## Step 4 — Show Session Summary

```
## Session Summary

### What Was Done
- <what was built or changed>

### Decisions Made
- <key decisions and why>

### Mistakes This Session
- <what went wrong + what to do instead next time>

### Memory Updated
- <filename> — <what was added or changed>

### Still Pending
- <unfinished or deferred work>
```

---

## Step 5 — Ask Hassan

```
Is there anything else from this session you want me to remember?
```

If yes → update the relevant memory file immediately before ending.

---

## What This Command Never Does
- ❌ Commits or pushes files
- ❌ Modifies test files or page objects
- ❌ Creates new memory files unless truly necessary
- ❌ Stores temporary details
- ❌ Skips Step 1 — past mistakes must always be reviewed first

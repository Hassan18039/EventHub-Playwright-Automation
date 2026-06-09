# .claude Directory Structure

## Overview
Complete Claude Code configuration for EventHub Playwright test automation.

## File Tree
```
.claude/
├── README.md                          # Index and quick start guide
├── STRUCTURE.md                       # This file
├── settings.json                      # Claude Code settings & permissions
│
├── agents/
│   └── test-automation-agent.md      # Agent role definition
│
├── rules/
│   ├── quality-standards.md          # Code review checklist & best practices
│   └── naming-conventions.md         # File, class, and method naming rules
│
├── memory/
│   ├── test-commands.md              # npm/npx commands reference
│   └── page-object-pattern.md        # POM guide and patterns
│
└── [root CLAUDE.md]                   # Project architecture (one level up)
```

## Files by Purpose

### Configuration
- **settings.json** — Permissions, model, features

### Documentation & Guidance
- **README.md** — Entry point, quick start, key patterns
- **STRUCTURE.md** — This file (helps navigate .claude/)
- **CLAUDE.md** (root) — Project architecture, conventions, troubleshooting

### Agents
- **test-automation-agent.md** — Role, capabilities, constraints

### Rules (What & How)
- **quality-standards.md** — Code review checklist, flaky test prevention
- **naming-conventions.md** — Consistent naming across the codebase

### Memory (Reference)
- **test-commands.md** — All Playwright/npm commands with examples
- **page-object-pattern.md** — POM implementation guide

## How to Use

### First Time in This Repo
1. Read `.claude/README.md`
2. Read `CLAUDE.md` (root level)
3. Skim `page-object-pattern.md` to understand POM

### Adding a New Test
1. Follow `quality-standards.md` rules
2. Use naming from `naming-conventions.md`
3. Reference `test-commands.md` for running tests

### Debugging a Failure
1. Check `test-commands.md` for debug commands
2. Review `quality-standards.md` for flaky test solutions
3. Consult `page-object-pattern.md` for selector best practices

### Code Review
1. Use checklist from `quality-standards.md`
2. Check naming from `naming-conventions.md`
3. Verify patterns match `page-object-pattern.md`

## Key Decisions

### Why This Structure?
- **agents/** — Defines what Claude can do in this repo
- **rules/** — Enforces consistency and quality
- **memory/** — Deep reference for repeated tasks
- **settings.json** — Automates permissions

### Anthropic Standard
This follows the standard `.claude/` directory structure recommended by Anthropic for Claude Code projects.

---

**Total Configuration Size:** ~20KB  
**Last Updated:** 2026-06-09

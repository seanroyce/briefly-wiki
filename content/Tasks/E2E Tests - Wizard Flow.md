---
title: "E2E Tests — Wizard Flow"
status: "4-done"
sprint: 2
phase: 1
section: "cross-cutting"
priority: p1
size: m
category: testing
tags:
  - task
---

# E2E Tests — Wizard Flow

Playwright test covering the full happy path: sign up → create brief → complete all wizard steps → export.

## Tasks

- [ ] Auth setup helper — sign up or log in a test user before each test
- [ ] Test: create new brief from dashboard → lands in wizard
- [ ] Test: paste raw notes → click "Process notes" → AI fills section cards
- [ ] Test: step through all 6 steps → click "Mark as complete" → arrives at brief view
- [ ] Test: export PDF → verify download triggered; export Markdown → verify `.md` downloaded
- [ ] Add to CI (GitHub Actions `playwright.yml`)

## See Also

- [[Deploy]]

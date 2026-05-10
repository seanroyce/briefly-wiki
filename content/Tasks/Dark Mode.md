---
title: "Dark Mode"
status: "3-backlog"
sprint: 3
phase: 2
section: "2.5"
priority: p2
size: m
category: ui
tags:
  - task
---

# Dark Mode

Add full dark mode support with system preference detection and a manual toggle.

## Tasks

- [ ] Add `dark:` Tailwind variants to all components and pages (Navbar, PageContainer, cards, inputs, dialogs, badges)
- [ ] Implement system preference detection via `prefers-color-scheme` media query
- [ ] Manual toggle in settings or Navbar — stored in `localStorage`
- [ ] Verify all shadcn/ui components respect dark mode correctly

## See Also

- [[Features/2.5 - Dark Mode]]
- [[Components]]

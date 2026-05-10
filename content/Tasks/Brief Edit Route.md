---
title: "Brief Edit Route"
status: "4-done"
sprint: 1
phase: 1
section: "1.8"
priority: p0
size: m
category: ui
tags:
  - task
---

# Brief Edit Route

Build `/brief/[id]/edit` — the wizard pre-populated with existing brief content, with all steps directly navigable (not locked behind Step 1 processing).

## Tasks

- [x] Create `src/app/brief/[id]/edit/page.tsx` — server component that fetches brief + sections, passes to wizard client
- [x] Update `WizardClient` to accept an `editMode` prop that skips the "import & process" gate on Step 1 and shows section cards immediately
- [x] Update "Edit" button + "Start editing" link on brief view to `/brief/[id]/edit`

## See Also

- [[Features/1.8 - Brief View & Export]]
- [[Wizard]]

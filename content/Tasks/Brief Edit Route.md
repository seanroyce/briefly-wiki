---
title: "Brief Edit Route"
status: "2-ready"
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

- [ ] Create `src/app/brief/[id]/edit/page.tsx` — server component that fetches brief + sections, passes to wizard client
- [ ] Update `WizardClient` to accept an `editMode` prop that skips the "import & process" gate on Step 1 and shows section cards immediately
- [ ] Update "Edit" button on brief view to link to `/brief/[id]/edit` instead of `/brief/new?briefId=:id`

## See Also

- [[Features/1.8 - Brief View & Export]]
- [[Wizard]]

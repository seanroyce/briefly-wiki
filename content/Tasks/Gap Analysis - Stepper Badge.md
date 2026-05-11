---
title: "Gap Analysis - Stepper Badge"
status: "4-done"
sprint: 3
phase: 2
section: "2.1"
priority: p3
size: xs
category: ui
tags:
  - task
  - gap-analysis
---

# Gap Analysis - Stepper Badge

Show active gap count as a badge on the Review step in the wizard stepper so users always know their brief has unresolved gaps.

## Background

Investigation confirmed gaps are stored in state (`activeGaps`) and counted (`gapCount`). The stepper has no visual indicator when gaps exist. Users who complete the wizard without addressing gaps may not realize they left issues behind.

## Tasks

- [ ] Pass `gapCount` (or `activeGaps.length`) down to `WizardStepper` as a prop
- [ ] In the stepper, render a small badge (e.g. `bg-destructive text-white rounded-full text-xs px-1`) on the Review step when `gapCount > 0`
- [ ] Badge should disappear once all gaps are dismissed or re-check returns 0 gaps
- [ ] Badge should not render before the first analysis has run (`!hasAnalyzed`)

## See Also

- [[Features/2.1 - Gap Analysis]]
- `src/app/brief/new/wizard-client.tsx` — `gapCount` state (~line 131)
- `src/components/wizard-stepper.tsx`

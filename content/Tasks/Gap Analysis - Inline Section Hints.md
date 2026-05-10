---
title: "Gap Analysis - Inline Section Hints"
status: "3-backlog"
sprint: 3
phase: 2
section: "2.1"
priority: p3
size: m
category: feature
tags:
  - task
  - gap-analysis
---

# Gap Analysis - Inline Section Hints

Surface relevant gap hints inside each wizard step section card so users can fix issues without returning to the Review tab.

## Background

The `InlineGap` component (`src/components/inline-gap.tsx`) exists but is not wired up anywhere. Each `Gap` record has a `section_number` and `suggested_prompt` field. The `BriefSectionCard` could receive applicable gaps and render them inline above the subsection fields.

## Tasks

- [ ] Pass `activeGaps` down through wizard to each `BriefSectionCard` (filtered by `section_number`)
- [ ] In `BriefSectionCard`, render an `<InlineGap>` for each applicable gap (severity + description + suggestedPrompt)
- [ ] Only show inline gaps when `hasAnalyzed` is true
- [ ] Dismissed gaps should not render inline
- [ ] Add a "Dismiss" action on the inline gap (calls `handleDismissGap` via lifted callback)

## See Also

- [[Features/2.1 - Gap Analysis]]
- `src/components/inline-gap.tsx` — ready-made component
- `src/components/brief-section-card.tsx`
- `src/app/brief/new/wizard-client.tsx`

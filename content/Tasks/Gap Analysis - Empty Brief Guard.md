---
title: "Gap Analysis - Empty Brief Guard"
status: "4-done"
sprint: 3
phase: 2
section: "2.1"
priority: p2
size: s
category: feature
tags:
  - task
  - gap-analysis
---

# Gap Analysis - Empty Brief Guard

Prevent users from running gap analysis on a completely empty brief, and warn when very little content is present.

## Background

Live investigation showed that gap analysis on a brand-new empty brief returns 8 Critical + 1 Recommended gaps — one for every section. This is technically correct but creates noise and burns an AI call. Users should be encouraged to add content before analyzing.

## Tasks

- [x] Before calling `analyzeGaps`, check if all `structuredContentMap` values are empty
- [x] If brief is fully empty, show an inline prompt instead of running the AI: "Add content to at least a few sections before analyzing for gaps"
- [x] If brief is partially filled (< 2 sections completed), show a softer warning toast but still allow analysis to proceed
- [x] Define "completed section" as any section where at least one subsection has non-empty content

## See Also

- [[Features/2.1 - Gap Analysis]]
- `src/app/brief/new/wizard-client.tsx` — `handleAnalyzeGaps` function (~line 358)

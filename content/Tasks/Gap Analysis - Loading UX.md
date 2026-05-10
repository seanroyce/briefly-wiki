---
title: "Gap Analysis - Loading UX"
status: "2-ready"
sprint: 3
phase: 2
section: "2.1"
priority: p2
size: xs
category: ui
tags:
  - task
  - gap-analysis
---

# Gap Analysis - Loading UX

Improve feedback during the ~60–90 second AI analysis wait so users don't think the app is broken.

## Background

Live Playwright investigation on production showed gap analysis completes successfully but takes 60–90 seconds. The current UI only shows a spinner with "Analyzing your brief for gaps..." — no estimated time, no progress indication. Users who haven't seen this before may assume it has frozen.

## Tasks

- [ ] Add sub-copy under the spinner: "This usually takes about a minute" (or similar)
- [ ] Consider adding a subtle animated progress bar (indeterminate) to give a sense of activity
- [ ] Ensure the loading container has a min-height so the page doesn't jump when results load

## See Also

- [[Features/2.1 - Gap Analysis]]
- `src/app/brief/new/wizard-client.tsx` — `isAnalyzingGaps` rendering block (~line 711)

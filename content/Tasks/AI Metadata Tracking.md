---
title: "AI Metadata Tracking"
status: "3-backlog"
sprint: 2
phase: 1
section: "1.5"
priority: p2
size: s
category: ai
tags:
  - task
---

# AI Metadata Tracking

Record model name, token usage, and processing time on each brief row for cost monitoring and debugging.

## Tasks

- [ ] After each `processAllNotes` call, aggregate: model used, total input tokens, total output tokens, wall-clock time
- [ ] Write aggregated `ai_metadata` JSON to the `briefs.ai_metadata` column via `updateBrief`
- [ ] Ensure `analyzeGaps` also appends its token usage to `ai_metadata`

## See Also

- [[Features/1.5 - AI Processing Pipeline]]
- [[Database]]

---
title: "AI Refine Endpoint"
status: "4-done"
sprint: 1
phase: 1
section: "1.5"
priority: p0
size: m
category: ai
tags:
  - task
---

# AI Refine Endpoint

Build the inline section refinement flow: API route + wired "Ask AI to help" button in `BriefSectionCard`.

## Tasks

- [x] Build `POST /api/ai/refine` — accepts `{ briefId, sectionKey, currentContent, userContext }`, calls Claude to refine structured content, returns refined `structuredContent`. Auth validated.
- [x] Wire "Ask AI to help" button in `BriefSectionCard` — sends current structured content + rawInput as userContext, updates state on success, clears textarea
- [x] Show loading state on the button while request is in-flight
- [x] Toast error on failure

## See Also

- [[Features/1.5 - AI Processing Pipeline]]
- [[Features/1.6 - Wizard UI]]
- [[AI Pipeline]]

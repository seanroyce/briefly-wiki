---
title: "AI Refine Endpoint"
status: "2-ready"
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

- [ ] Build `POST /api/ai/refine` — accepts `{ briefId, sectionKey, subsectionKey, currentContent, userContext }`, calls Claude to merge/improve, returns refined text. Validate auth.
- [ ] Wire "Ask AI to help" button in `BriefSectionCard` — send current subsection content + user input to `/api/ai/refine`, update structured content on success
- [ ] Show loading state on the button while request is in-flight
- [ ] Toast error on failure

## See Also

- [[Features/1.5 - AI Processing Pipeline]]
- [[Features/1.6 - Wizard UI]]
- [[AI Pipeline]]

---
title: Roadmap
tags:
  - roadmap
  - planning
---

# Roadmap

## Phase Overview

![[Tracker.base]]

## Dependency Chain

```
Project Setup → Design System → Auth → Dashboard → Brief Data Layer
  → AI Pipeline → Wizard → Gap Analysis → Brief View & Export → Settings
```

## Current Focus

**Phase 1 (MVP)** is ~80% complete. The highest-priority remaining tasks:

> [!todo] Immediate Next Steps
> 1. Update `SUPABASE_SERVICE_ROLE_KEY` in `.env.local` (currently `placeholder`) after Supabase project restoration
> 2. Apply migration `002_structured_content.sql` once Supabase is back online
> 3. Set up Vercel deployment (Phase 0.4)
> 4. Add loading skeleton states (Phase 1.1)
> 5. Wire "Ask AI to help" inline refine button in `BriefSectionCard` (`POST /api/ai/refine`)

## Phase Summary

| Phase | Name | Status | Est. Completion |
|-------|------|--------|----------------|
| [[Phases/Phase 0 - Foundation\|Phase 0]] | Foundation | In Progress | 90% |
| [[Phases/Phase 1 - MVP\|Phase 1]] | MVP | In Progress | 65% |
| [[Phases/Phase 2 - Enhanced\|Phase 2]] | Enhanced | In Progress | 10% |
| [[Phases/Phase 3 - Scale\|Phase 3]] | Scale | Pending | 0% |

## What's Complete

- Full project scaffold (Next.js 16, TypeScript, Tailwind, shadcn/ui)
- Supabase setup (client utils, env config)
- All 4 database tables with RLS and migrations
- Full auth flows (email + Google OAuth, middleware, password reset)
- Dashboard with brief list, search, delete confirmation
- 6-step wizard (all steps wired, auto-save, nav, brief naming)
- `BriefSectionCard` with `SubsectionPreviewTable` and per-section AI processing
- `processContext` and `processAllNotes` — fully wired Claude API calls
- File upload (`FileUploadZone`, Supabase Storage, pdf-parse / mammoth / OCR)
- Complete gap analysis (AI call → save → display → dismiss → re-check)
- Brief view with export (PDF via jsPDF, Markdown download)
- Account settings (profile, password, account deletion)
- Brief duplication (`duplicateBrief` action + UI)

## What's Next (MVP Gap)

- Restore Supabase connection (project was paused — reactivating)
- Apply pending migration `002_structured_content.sql`
- Vercel deployment
- Users profile table migration (name, avatar_url)
- Loading skeleton states
- Dashboard sort dropdown
- `POST /api/ai/refine` route + inline refine button in `BriefSectionCard`

## See Also

- [[project-plan|Full Project Plan]] — granular task checklist
- [[spec|Specification]] — functional requirements
- [[AI Pipeline]] — `processContext` implementation details

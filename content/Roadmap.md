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

**Sprint 3 is complete.** Gap analysis UX improvements shipped: loading spinner with timing copy + indeterminate progress bar, empty brief guard (blocks AI call + inline warning when brief is empty, soft toast when <2 sections filled), inline gap hints in each `BriefSectionCard` (filtered by section, dismiss action lifted to wizard), and stepper badge (was already implemented). One manual task remains from Sprint 2: Sentry Error Tracking.

> [!todo] Remaining
> 1. Sentry Error Tracking — run `npx @sentry/wizard@latest -i nextjs`, set `SENTRY_DSN` in Vercel dashboard

See [[Sprint.base]] for the live task-level kanban.

## Phase Summary

| Phase | Name | Status | Est. Completion |
|-------|------|--------|----------------|
| [[Phases/Phase 0 - Foundation\|Phase 0]] | Foundation | Complete | 100% |
| [[Phases/Phase 1 - MVP\|Phase 1]] | MVP | Complete | 100% |
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

- Update `SUPABASE_SERVICE_ROLE_KEY` in `.env.local` (Supabase project was paused — reactivating)
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

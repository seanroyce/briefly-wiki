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

**Sprint 6 — Phase 1 Close-out + Phase 2 Kickoff.** Phase 1 is ~97% complete. Sprint 5 shipped XLSX/CSV/PDF ingest (122 unit tests passing). Sprint 6 closes the last Phase 1 gap and starts Phase 2.

**Sprint 6 is complete.** All three planned tasks shipped in one session:

- **Dashboard Error State** — inline destructive alert + `router.refresh()` retry; `listBriefs` now returns `null` on DB error (was silently `[]`)
- **Shareable Brief Links** — `shareBrief` / `unshareBrief` server actions, migration 006 (RLS policy for anon read), `GET /api/shared/[token]`, `/brief/share/[token]` public read-only page, Share/Copy link/Unshare buttons in brief view
- **Brief Templates** — 5 templates (`src/lib/templates.ts`): Product Launch, Event Promotion, Content Campaign, Brand Awareness, Seasonal/Promotional. `/brief/template` picker page. `createBrief` accepts optional `templateId` to seed `structured_content`. "New brief" button navigates to picker instead of creating blank brief directly.

**Sprint 7 — in progress:**

Shipped this session:
- **PNG/JPEG OCR CSP fix** — Tesseract.js v7 workers were silently blocked by missing `worker-src blob:` and `cdn.jsdelivr.net` in `script-src`/`connect-src`. Fixed in `next.config.ts`. E2E smoke tests added (`tests/e2e/file-upload.spec.ts`). Deployed `f17367d`.

Still queued:
1. Dark Mode (m, p2) — `dark:` Tailwind variants, system detection, localStorage toggle
2. Version History (l, p2) — `brief_snapshots` table, snapshot-on-step-complete, version list sidebar, restore
3. Project Management Adapters (l, p2) — Asana/Monday/Jira export via `ProjectPlanAdapter` interface

See [[Sprint.base]] for the live task-level kanban.

## Phase Summary

| Phase | Name | Status | Est. Completion |
|-------|------|--------|----------------|
| [[Phases/Phase 0 - Foundation\|Phase 0]] | Foundation | Complete | 100% |
| [[Phases/Phase 1 - MVP\|Phase 1]] | MVP | Complete | 100% |
| [[Phases/Phase 2 - Enhanced\|Phase 2]] | Enhanced | In Progress | 40% |
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

## What's Next (Phase 2)

- **§2.1 Shareable Brief Links** — public read-only share URLs (Sprint 6, ready)
- **§2.2 Brief Templates** — starter templates with pre-fill and merge (Sprint 6, ready)
- **§2.5 Dark Mode** — system-aware toggle (Sprint 6 stretch)
- **§2.4 Version History** — brief snapshot + restore (Sprint 7)
- **§3.2 Project Management Adapters** — Asana/Monday/Jira export (Sprint 7+)
- **§3.5 Slack Bot + Webhooks** — event-driven workflow integrations (Sprint 7+)

## See Also

- [[project-plan|Full Project Plan]] — granular task checklist
- [[spec|Specification]] — functional requirements
- [[AI Pipeline]] — `processContext` implementation details

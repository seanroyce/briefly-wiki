---
title: Briefly — Project Wiki
tags:
  - home
---

# Briefly

**AI-powered campaign brief builder.** Paste rough marketing notes, walk a 6-step guided wizard, and get a structured, gap-analyzed campaign brief — ready to export as PDF or Markdown, or push to your project management tool.

> [!info] Links
> **App:** [project-yqnrm.vercel.app](https://project-yqnrm.vercel.app) · **GitHub:** [seanroyce/briefly](https://github.com/seanroyce/briefly)

---

## How It's Built

| | |
|--|--|
| [[Architecture]] | App Router structure, routes, server actions, data flow |
| [[Database]] | Postgres schema, RLS policies, migrations |
| [[Auth]] | Email/password, Google OAuth, middleware, session handling |
| [[AI Pipeline]] | Claude API integration, prompts, server actions |
| [[Wizard]] | 6-step wizard — sections, AI extraction, gap analysis |
| [[Components]] | UI component reference (shadcn/ui + custom) |
| [[Conventions]] | Code patterns, Zod v4, Sonner, naming rules, gotchas |
| [[Deploy]] | Vercel deployment, environment variables, Supabase CLI |
| [[Extensibility]] | Future upgrades — streaming AI, background jobs, Railway |

## Planning

| | |
|--|--|
| [[Roadmap]] | Phase overview and current sprint status |
| [[About]] | Product vision, user stories, goals |

---

## What's Shipped

- **Auth** — email/password + Google OAuth, password reset, `users` profile table, protected routes
- **Dashboard** — brief list with search, sort, delete, duplication
- **6-step wizard** — auto-save, per-section AI extraction, file upload (PDF/DOCX/images)
- **Gap analysis** — AI reviews all 9 sections, flags critical/recommended/nice-to-have gaps; inline hints in each section card; amber badge on stepper; empty-brief guard
- **Brief view** — read-only view, PDF export, Markdown export, edit route
- **AI pipeline** — `processContext`, `processAllNotes`, `analyzeGaps`, `/api/ai/refine`
- **Account settings** — profile, password change, account deletion, connected integrations
- **Security** — rate limiting on AI endpoints, RLS on all tables, CSRF protection

> [!success] Current Status
> **Sprint 3 complete** (2026-05-10) — gap analysis UX polish shipped. Sprint 4 planning underway: Phase 3 integrations (Slack bot, project plan export to Asana/Monday/Jira, outbound webhooks).

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict mode) |
| Styling | TailwindCSS 4 + shadcn/ui (new-york) |
| Database | Supabase (Postgres + Auth + Storage) |
| AI | Anthropic Claude API (`claude-sonnet-4-6`, 4096 tokens) |
| Validation | Zod v4 (4.3.6) |
| Hosting | Vercel |

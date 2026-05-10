---
title: Eval Suite Index
tags:
  - evals
  - qa
  - testing
aliases:
  - Evals
  - Eval Suite
---

# Briefly — Eval Suite

Structured evaluation cases for the Briefly campaign brief builder. These are written as Given/When/Then scenarios — they are the source of truth for what each release should be tested against, regardless of whether the test is run manually, with Playwright, or with a future CI harness.

**Live app under test:** [project-yqnrm.vercel.app](https://project-yqnrm.vercel.app)
**Stack:** Next.js 16 App Router · Supabase Postgres + Auth · Anthropic Claude API · Zod v4 · TailwindCSS 4 · shadcn/ui · Vercel

---

## What This Suite Covers

| Document | Scope |
|----------|-------|
| [[auth-evals]] | Sign up, login, logout, Google OAuth, password reset, middleware route protection, account deletion |
| [[wizard-evals]] | The 6-step brief builder — context input, AI extraction, per-section review, gap analysis, refinement, export hand-off |
| [[ai-pipeline-evals]] | `processContext`, `processAllNotes`, `analyzeGaps`, `POST /api/ai/refine` — happy path, malformed input, timeouts, schema integrity |
| [[dashboard-evals]] | Brief list rendering, search, sort, delete confirmation, duplicate, empty state, loading |
| [[brief-view-evals]] | Read view rendering, PDF export, Markdown export, edit route navigation, completeness indicators |
| [[data-integrity-evals]] | Zod boundary validation, RLS row-level isolation, duplication fidelity, auto-save partial-state correctness |

---

## Mapping to the App

```
Sign up / Login / OAuth ───────────────► auth-evals
       │
       ▼
   Dashboard ────────────────────────── dashboard-evals
       │
       ├── + New brief ──┐
       │                 ▼
       │             Wizard (6 steps) ── wizard-evals
       │                 │            │
       │                 │            └──► AI calls ── ai-pipeline-evals
       │                 ▼
       │             Brief View ──────── brief-view-evals
       │                 │
       │                 └──► PDF / Markdown export
       │
       └── Settings (profile, password, delete) ── auth-evals
```

Across all of the above, [[data-integrity-evals]] verifies the schema, ownership, and persistence guarantees that span every flow.

---

## Wizard Step → Eval Coverage

The wizard has 6 steps (`WIZARD_STEPS` in `src/lib/mock-data.ts` is authoritative — the original spec said 5):

| Step | Name | Sections | Primary eval doc |
|------|------|----------|------------------|
| 1 | Import & Overview | Campaign Overview, Objectives & KPIs | wizard-evals, ai-pipeline-evals |
| 2 | Audience & Messaging | Target Audience, Value Proposition | wizard-evals |
| 3 | Channel Strategy | 8 sub-channels (web, social, email, webinars, events, paid_media, press_releases, analyst_relations) | wizard-evals |
| 4 | Budget & Timeline | Budget & Resources, Timeline & Milestones | wizard-evals |
| 5 | Metrics & Approvals | Metrics & Approvals | wizard-evals |
| 6 | Review & Gaps | Full review + AI gap analysis | wizard-evals, ai-pipeline-evals |

---

## AI Pipeline → Eval Coverage

| Operation | Surface | Eval doc |
|-----------|---------|----------|
| `processContext` (per-section extraction) | Wizard "Process Context" button on `BriefSectionCard` | ai-pipeline-evals |
| `processAllNotes` (batch fan-out across 9 sections) | Wizard Step 1 "Process notes" button | ai-pipeline-evals |
| `analyzeGaps` | Wizard Step 6 "Analyze gaps" / "Re-check gaps" | ai-pipeline-evals |
| `POST /api/ai/refine` | "Ask AI to help" inline button on `BriefSectionCard` | ai-pipeline-evals |

---

## Priority Levels

Each eval case is tagged with one of:

| Priority | Meaning |
|----------|---------|
| **P0** | Must pass before any release. A failure blocks deployment. |
| **P1** | Important but non-blocking. Failure is documented and ticketed; ship may proceed if compensating. |
| **P2** | Nice-to-have coverage. Tracks regressions and edge polish — failure does not block. |

Roll-up rule: **any P0 failure = NO-GO**. A cluster of P1 failures in one area can also escalate to NO-GO at the evaluator's discretion.

---

## How to Run

There are three intended modes:

1. **Manual smoke** — open the live app, walk through the highest-priority cases by hand. Useful before a Friday-afternoon deploy.
2. **Playwright run** — author Playwright tests that map 1:1 to the eval IDs (`EC-AUTH-1`, `EC-WIZ-3`, etc.). Test names should embed the eval ID for traceability. Tests live in `briefly/tests/e2e/`.
3. **Hand-off to evaluator agent** — feed this folder to the deployment-evaluator agent. It derives a test plan, runs the Playwright agent, and emits a GO/NO-GO report.

Regardless of mode, the eval cases below are **the criteria**. Test code is just one way of executing them.

---

## Conventions Verified Throughout

These project conventions (per [[Conventions]]) should be implicitly verified by every test that touches the relevant surface:

- **Zod v4 (4.3.6)** — `z.record()` requires 2 args; error messages match v4 format
- **Sonner** — all async-action feedback uses `toast.*`, never shadcn's `useToast`
- **Inter font** — primary; JetBrains Mono for code; *not* Geist
- **OKLCH colors** — defined in `src/app/globals.css`; no fallback hex regressions
- **Soft delete** — briefs use `deleted_at`; queries always filter `.is("deleted_at", null)`
- **Server-side auth** — `getUser()` from `src/lib/supabase/auth.ts` in every server action; never trust a client-sent `user_id`

---

## Pending / Known Gaps (Tag as P1, not P0)

Per [[Roadmap]] and the feature pages, these are not yet implemented as of 2026-05-10. Eval cases that cover them should be marked clearly so a "fail" here is expected, not a regression:

- Connected Accounts section in `/settings` (Google disconnect)
- Rate limiting on AI calls (Upstash Redis — planned)
- `ai_metadata` tracking on `briefs`
- `lib/ai/parse.ts` typed response parser / error normalizer
- OAuth account linking when same email exists via password
- Loading skeleton states (Dashboard, Wizard)
- Dashboard sort dropdown

---

## See Also

- [[Home]] — wiki entry point
- [[Architecture]] — routes and server actions under test
- [[Wizard]] — authoritative step / section reference
- [[AI Pipeline]] — what the AI calls actually do and how they should fail
- [[Database]] — RLS contract that data-integrity evals verify

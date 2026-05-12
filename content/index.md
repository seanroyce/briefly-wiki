---
title: Briefly — Project Wiki
tags:
  - home
---

# Briefly

**AI-powered campaign brief builder.** Paste rough marketing notes, walk a 6-step guided wizard, and get a structured, gap-analyzed campaign brief — ready to export as PDF or Markdown, or push to your project management tool.

**Live app:** [project-yqnrm.vercel.app](https://project-yqnrm.vercel.app) · **GitHub:** [seanroyce/briefly](https://github.com/seanroyce/briefly)

---

## Technical Reference

| Page | Description |
|------|-------------|
| [[Architecture]] | App Router route tree, server actions, middleware wiring, and end-to-end data flow. |
| [[Database]] | Postgres schema, Supabase RLS policies, storage bucket setup, and migration history. |
| [[Auth]] | Email/password and Google OAuth flows, session handling, and middleware route protection. |
| [[AI Pipeline]] | Claude API integration, prompt design, and the `processContext` / `processAllNotes` / `analyzeGaps` server actions. |
| [[Wizard]] | 6-step wizard — step/section mapping, AI extraction per card, gap analysis UI, and auto-save behavior. |
| [[Components]] | Annotated reference for every UI component: shadcn/ui base components and custom wrappers. |
| [[Conventions]] | Project-wide code patterns — Zod v4, Sonner, OKLCH colors, naming rules, and known gotchas. |
| [[Deploy]] | Vercel deployment workflow, environment variable management, and Supabase CLI usage. |
| [[Extensibility]] | Planned architectural upgrades — streaming AI responses, background jobs, and alternative hosting paths. |

---

## Planning

| Page | Description |
|------|-------------|
| [[About]] | Product vision, target users, and the core user stories Briefly is built around. |
| [[Roadmap]] | Phase-by-phase overview of what's shipped, what's in progress, and what's queued for future sprints. |
| [[MVP Retrospective]] | How the MVP was built — 4-agent methodology, 6-step development cycle, and key learnings. |

---

## Sections

| Section | Description |
|---------|-------------|
| [[Evals/index\|Evals]] | Given/When/Then test cases for auth, wizard, AI pipeline, dashboard, and data integrity — the release criteria. |
| [[Features/index\|Features]] | Feature specifications organized by phase (0–3), each with status, completion percentage, and spec references. |
| [[Phases/index\|Phases]] | Phase summaries grouping features into Foundation, MVP, Enhanced, and Scale milestones. |
| [[Tasks/index\|Tasks]] | Granular implementation tasks with status, priority tier, and acceptance criteria. |

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

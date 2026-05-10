---
title: Briefly — Project Wiki
tags:
  - home
  - wiki
aliases:
  - Wiki Home
---

# Briefly

> [!abstract] One-Liner
> AI-powered campaign brief builder. Turns rough marketing notes into structured, gap-analyzed campaign briefs through a 6-step guided wizard.

## Quick Reference

| Area | Note | Purpose |
|------|------|---------|
| Architecture | [[Architecture]] | Stack, app structure, data flow |
| Database | [[Database]] | Tables, RLS, migrations |
| Auth | [[Auth]] | Login flows, middleware, session |
| AI Pipeline | [[AI Pipeline]] | Claude API, prompts, actions |
| Wizard | [[Wizard]] | 6-step wizard, sections |
| Components | [[Components]] | UI component library |
| Conventions | [[Conventions]] | Code patterns to follow |
| Deployment | [[Deploy]] | Env vars, Vercel, Supabase CLI |
| Extensibility | [[Extensibility]] | Future libraries, Railway, architectural upgrades |
| Features | [[Features.base]] | All features by phase, status, and completion |
| Sprint Board | [[Sprint.base]] | Task-level kanban — source of truth for sprint planning |
| Roadmap | [[Roadmap]] | Phase overview and status |

## Project Status

![[Features.base#By Phase]]

## Visual Overview

![[Overview.canvas]]

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict mode) |
| Styling | TailwindCSS 4 + shadcn/ui |
| Database | Supabase (Postgres + Auth + Storage) |
| AI | Anthropic Claude API (`@anthropic-ai/sdk`) |
| Validation | Zod v4 (4.3.6) |
| Hosting | Vercel |

## Key Source Docs

- [[spec|Full Specification]] — detailed functional requirements and wireframes (~115KB)
- [[project-plan|Project Plan]] — phased task list with checkboxes

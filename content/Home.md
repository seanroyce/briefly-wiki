---
title: Briefly Wiki
tags:
  - home
  - wiki
aliases:
  - Wiki Home
---

# Briefly Wiki

AI-powered campaign brief builder. Paste rough marketing notes, walk through a 6-step guided wizard, and get a structured, gap-analyzed brief.

**Live app:** [project-yqnrm.vercel.app](https://project-yqnrm.vercel.app) · **GitHub:** [seanroyce/briefly](https://github.com/seanroyce/briefly)

---

## Overview

| Topic | Page |
|-------|------|
| What Briefly is and who it's for | [[About]] |

## Building & Running

| Topic | Page |
|-------|------|
| Architecture & routes | [[Architecture]] |
| Database schema & migrations | [[Database]] |
| Auth flows & middleware | [[Auth]] |
| Deployment (Vercel + Supabase) | [[Deploy]] |
| Conventions & gotchas | [[Conventions]] |

## Features & UI

| Topic | Page |
|-------|------|
| 6-step wizard | [[Wizard]] |
| UI component library | [[Components]] |
| AI pipeline (Claude API) | [[AI Pipeline]] |
| Extensibility & future upgrades | [[Extensibility]] |

## Planning

| Topic | Page |
|-------|------|
| Roadmap & phase overview | [[Roadmap]] |
| Sprint board (active tasks) | [[Sprint.base]] |
| Feature tracker (by phase) | [[Features.base]] |
| Full specification | [[spec]] |

---

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

## What's Built

- Full auth — email/password, Google OAuth, password reset, `users` profile table
- Dashboard — brief list, search, sort, delete, duplication
- 6-step wizard — auto-save, per-section AI extraction, file upload, gap analysis
- Brief view — read view, PDF + Markdown export, edit route (`/brief/[id]/edit`)
- AI pipeline — `processContext`, `processAllNotes`, `analyzeGaps`, `/api/ai/refine`
- Account settings — profile, password, account deletion

## Current Sprint

**Sprint 6 complete.** Dashboard error state, Shareable Brief Links, and Brief Templates all shipped. Phase 2 is 40% complete. Sprint 7 queues Dark Mode, Version History, and Project Management Adapters. See [[Sprint.base]] for the full board.

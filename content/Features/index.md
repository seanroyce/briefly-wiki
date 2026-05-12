---
title: Features
tags:
  - features
  - planning
aliases:
  - Features
---

# Features

Feature specifications organized by phase. Each page tracks implementation status, completion percentage, and references to the product spec.

---

## Phase 0 — Foundation

| Feature | Description |
|---------|-------------|
| [[0.1 - Repo & Framework]] | Next.js 16 repo setup, TypeScript config, TailwindCSS 4, and shadcn/ui. |
| [[0.2 - Supabase Setup]] | Supabase project provisioning, initial Postgres schema, and Auth configuration. |
| [[0.3 - Dev Tooling]] | ESLint, Prettier, Husky, lint-staged, and Playwright scaffolding. |
| [[0.4 - Deployment Pipeline]] | Vercel project link, CI/CD pipeline, and environment variable sync workflow. |

## Phase 1 — MVP

| Feature | Description |
|---------|-------------|
| [[1.1 - Design System]] | OKLCH color tokens, Inter font, shadcn/ui new-york variant, and global CSS. |
| [[1.2 - Authentication]] | Email/password + Google OAuth, password reset, and session middleware. |
| [[1.3 - Dashboard]] | Brief list with search, sort, delete confirmation, and duplication. |
| [[1.4 - Brief Data Layer]] | `briefs` table schema, server actions, soft-delete (`deleted_at`), and RLS. |
| [[1.5 - AI Processing Pipeline]] | `processContext`, `processAllNotes`, and `analyzeGaps` server actions wrapping the Claude API. |
| [[1.6 - Wizard UI]] | 6-step wizard — section cards, auto-save, file upload, and per-section AI extraction. |
| [[1.7 - Gap Analysis]] | AI review across all 9 sections with inline hints, stepper badge, and empty-brief guard. |
| [[1.8 - Brief View & Export]] | Read-only brief view, PDF export, Markdown export, and edit route. |
| [[1.9 - Account Settings]] | Profile, password change, account deletion, and connected integrations UI. |
| [[1.10 - Landing Page]] | Public marketing landing page with sign-up CTA. |

## Phase 2 — Enhanced

| Feature | Description |
|---------|-------------|
| [[2.1 - Shareable Brief Links]] | Public share tokens for read-only brief access without login. |
| [[2.2 - Brief Templates]] | Starter templates that pre-fill wizard sections for common campaign types. |
| [[2.3 - Brief Duplication]] | Clone an existing brief as a new draft. |
| [[2.4 - Version History]] | Snapshot-based version history with diff view and restore. |
| [[2.5 - Dark Mode]] | System-aware dark/light mode toggle using OKLCH tokens. |

## Phase 3 — Scale

| Feature | Description |
|---------|-------------|
| [[3.1 - Team Collaboration]] | Multi-user workspaces with role-based access and brief sharing. |
| [[3.2 - Integrations]] | Connected accounts for Asana, Monday.com, and Jira with project plan export. |
| [[3.3 - Public API]] | API key–authenticated REST endpoints for programmatic brief CRUD. |
| [[3.4 - Campaign Performance Tracking]] | Link campaign outcomes back to briefs for performance analysis. |
| [[3.5 - Slack & Workflow Integration]] | Slack bot notifications and outbound webhooks on brief lifecycle events. |

---

See [[Phases/index|Phases]] for milestone summaries and [[Roadmap]] for sprint status.

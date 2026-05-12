---
title: Tasks
tags:
  - tasks
  - planning
aliases:
  - Tasks
  - Sprint Tasks
---

# Tasks

Granular implementation tasks, each with a status, priority tier, and acceptance criteria. Tasks map to features and are tracked on the sprint board.

---

## AI & Pipeline

| Task | Description |
|------|-------------|
| [[AI Metadata Tracking]] | Track token usage and model metadata on `briefs` rows. |
| [[AI Refine Endpoint]] | `/api/ai/refine` endpoint for inline AI-assisted section editing. |
| [[Project Plan Generation]] | Generate a structured project plan document from a finalized brief. |

## Auth & Security

| Task | Description |
|------|-------------|
| [[Auth Edge Cases]] | OAuth account linking, session edge cases, and middleware hardening. |
| [[Rate Limiting]] | Upstash Redis rate limiting on AI endpoints. |
| [[Security Hardening]] | CSP headers, RLS audit, CSRF review, and secret rotation checklist. |

## Data & Infrastructure

| Task | Description |
|------|-------------|
| [[Apply Migration 005]] | Apply pending Supabase migration 005 and verify schema integrity. |
| [[Supabase Restoration]] | Restore paused Supabase instance and verify RLS policies. |
| [[Users Profile Table]] | Create and backfill the `users` profile table linked to Supabase Auth. |

## Ingest (File Upload)

| Task | Description |
|------|-------------|
| [[Ingest - CSV Support]] | Parse uploaded CSV files and map columns to brief sections. |
| [[Ingest - PDF Extraction Config]] | Configure PDF text extraction settings in the file upload flow. |
| [[Ingest - Route Hardening]] | File type validation, size limits, and error handling on the ingest route. |
| [[Ingest - Storage Bucket and RLS]] | Supabase storage bucket setup with per-user RLS policies. |
| [[Ingest - Upload Error UX]] | User-facing error states and recovery flows for failed uploads. |
| [[Ingest - XLSX Support]] | Parse uploaded Excel files and map sheets to brief sections. |

## UI & Polish

| Task | Description |
|------|-------------|
| [[Brief Edit Route]] | `/brief/[id]/edit` route with wizard pre-populated from existing brief data. |
| [[Brief Templates]] | Template picker UI and starter data for common campaign types. |
| [[Dark Mode]] | System-aware dark/light toggle with OKLCH token compliance. |
| [[Dashboard Polish]] | Sort dropdown, empty state, skeleton loading, and copy improvements. |
| [[Gap Analysis - Empty Brief Guard]] | Block gap analysis when the brief has no meaningful content filled in. |
| [[Gap Analysis - Inline Section Hints]] | Display AI gap hints inline within each wizard section card. |
| [[Gap Analysis - Loading UX]] | Skeleton/loading state during the gap analysis API call. |
| [[Gap Analysis - Stepper Badge]] | Amber badge on the stepper when gap analysis finds critical missing sections. |
| [[Landing Page Polish]] | Final copy, visuals, and CTA refinement on the public landing page. |
| [[Loading Skeletons]] | Skeleton placeholders for dashboard and wizard while data fetches. |

## Testing

| Task | Description |
|------|-------------|
| [[E2E Tests - Dashboard]] | Playwright tests for brief list, search, sort, delete, and duplication flows. |
| [[E2E Tests - Wizard Flow]] | Playwright tests covering all 6 wizard steps and gap analysis submission. |

## Integrations

| Task | Description |
|------|-------------|
| [[Connected Accounts Settings]] | Settings UI for connecting and disconnecting Google, Asana, and Monday.com. |
| [[Project Management Adapters]] | Export brief as a project plan to Asana, Monday.com, or Jira. |
| [[Shareable Brief Links]] | Generate and revoke public share tokens for read-only brief access. |
| [[Slack Bot]] | Slack app that notifies a channel when a brief is finalized or shared. |
| [[Team Collaboration]] | Multi-user workspace support and role-based brief access. |
| [[Third-Party Integrations]] | OAuth flows and token storage for connected third-party services. |
| [[Version History]] | Snapshot and diff engine for brief version tracking with restore. |
| [[Workflow Automation Webhooks]] | Outbound webhooks triggered on brief lifecycle events (created, finalized, exported). |

## Deployment & Observability

| Task | Description |
|------|-------------|
| [[Campaign Performance Tracking]] | Link campaign result data back to briefs for post-launch analysis. |
| [[Public API]] | API key–authenticated REST endpoints for brief CRUD operations. |
| [[Sentry Error Tracking]] | Sentry DSN wiring, CSP `report-uri` header, and wizard-only session replay. |
| [[Vercel Deployment]] | Initial Vercel project link, environment variable sync, and deploy pipeline. |

---

See [[Evals/index|Evals]] for test coverage per feature area and [[Roadmap]] for sprint status.

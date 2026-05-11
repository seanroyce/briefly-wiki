---
title: "Project Plan Generation"
status: "3-backlog"
sprint: 4
phase: 3
section: "3.2"
priority: p2
size: m
category: ai
tags:
  - task
  - integration
  - ai
---

# Project Plan Generation

AI step that turns a completed brief into a structured project plan JSON (phases, tasks, owners, due dates, dependencies) — the foundation for pushing briefs into Asana, Monday.com, and Jira.

## Background

Briefs already contain the raw material for a project plan: campaign dates, channel strategy, deliverables, owners, and a Timeline & Budget section. Today that content is human-readable prose. To push it into a project tool, we need a deterministic structured representation. A new server action calls Claude with the full brief, asks for a typed JSON plan, validates with Zod v4, and stores the generated plan so it can be previewed/edited before pushing through any adapter (see [[Tasks/Project Management Adapters]]).

## Tasks

- [ ] Define `ProjectPlan` Zod v4 schema — `phases[] { name, startDate, endDate, tasks[] { title, description, assignee?, dueDate?, dependencies?, channel? } }`
- [ ] Author Claude system prompt — instructs the model to derive phases from campaign dates, deliverables from channels, dates from the Timeline section
- [ ] Build `generateProjectPlan(briefId)` server action in `src/actions/generate-project-plan.ts` (new) — fetches brief + sections, calls Claude, validates with Zod, returns `ProjectPlan`
- [ ] Persist plans — `project_plans` table (`id`, `brief_id`, `plan_json`, `model`, `created_at`, `created_by`); RLS scoped to brief owner
- [ ] Defensive normalization — coerce missing dates to brief campaign window, dedupe duplicate task titles, cap depth
- [ ] Streaming-friendly action — return progress chunks for the eventual preview UI
- [ ] Unit tests — fixture briefs covering thin / rich / multi-channel cases
- [ ] Telemetry — log token usage and generation latency to existing AI metadata table

## See Also

- [[Features/3.2 - Integrations]]
- [[Tasks/Project Management Adapters]]
- [[Tasks/AI Metadata Tracking]]
- [[AI Pipeline]]

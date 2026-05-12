---
title: "Project Management Adapters"
status: "3-backlog"
sprint: 5
phase: 3
section: "3.2"
priority: p2
size: l
category: integration
tags:
  - task
  - integration
---

# Project Management Adapters

Adapter layer that pushes a generated `ProjectPlan` into Asana, Monday.com, or Jira — plus the OAuth connection flow that lets users link those workspaces from account settings.

## Background

Each project tool has its own object model (Asana: project/section/task, Monday: board/group/item, Jira: epic/story/subtask). Wrapping each behind a `ProjectPlanAdapter` interface keeps `generateProjectPlan` (see [[Tasks/Project Plan Generation]]) and the brief view UI tool-agnostic. Connections are stored per user, encrypted at rest, and reusable across briefs. This task assumes the AI generation step exists and produces a validated `ProjectPlan`.

## Tasks

- [ ] Define `ProjectPlanAdapter` interface in `src/integrations/adapters/types.ts` (new) — `connect()`, `listWorkspaces()`, `listProjects(workspaceId)`, `pushPlan(plan, target) → { externalId, url }`, `getStatus(externalId)`
- [ ] `connected_integrations` table — `id`, `user_id`, `provider` (asana/monday/jira), `access_token` (encrypted), `refresh_token`, `workspace_id`, `expires_at`; RLS scoped to user
- [ ] OAuth callback routes — `/api/integrations/asana/callback`, `/api/integrations/monday/callback`, `/api/integrations/jira/callback`
- [ ] Asana adapter — create project, sections per phase, tasks per task, set due dates and assignees
- [ ] Monday.com adapter — create board, groups per phase, items per task, map columns (status, owner, date)
- [ ] Jira adapter — create epic per brief, story per task, subtasks per dependency; respect project key
- [ ] Settings UI — `/settings/integrations` page lists providers with Connect/Disconnect buttons and last-used timestamp
- [ ] Brief view "Send to project tool" UI — destination picker (lists connected providers), plan preview, target workspace/project picker, push button, success toast with external link
- [ ] Error handling — surface adapter API errors verbatim, retry transient failures, mark integration as needs-reconnect on 401
- [ ] E2E test — mock provider APIs, push a fixture plan end-to-end

## See Also

- [[Features/3.2 - Integrations]]
- [[Tasks/Project Plan Generation]]
- [[Tasks/Connected Accounts Settings]]
- [[Extensibility]]

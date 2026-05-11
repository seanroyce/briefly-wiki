---
title: "Workflow Automation Webhooks"
status: "3-backlog"
sprint: 4
phase: 3
section: "3.5"
priority: p2
size: l
category: infra
tags:
  - task
  - integration
  - webhooks
---

# Workflow Automation Webhooks

Reliable outbound webhook infrastructure that emits Briefly events to user-registered URLs — the backbone for n8n, Workato, Make, Zapier, and the Slack bot's notification subscriber.

## Background

iPaaS tools (n8n, Workato, Make, Zapier) connect to SaaS via two primitives: a documented API for actions (create / fetch) and signed webhooks for triggers (events). The public API ([[Features/3.3 - Public API]]) covers the action side; this task builds the trigger side. Delivery must be durable — drop a webhook and a user's automation breaks silently — so each delivery attempt runs through a background queue with retries, and every attempt is recorded in a per-endpoint delivery log the user can inspect and replay.

## Tasks

- [ ] `webhook_endpoints` table — `id`, `user_id`, `url`, `secret`, `event_filter` (text[]), `active`, `created_at`; RLS scoped to user
- [ ] `webhook_deliveries` table — `id`, `endpoint_id`, `event_type`, `payload_json`, `attempt`, `status_code`, `response_body`, `delivered_at`, `next_retry_at`
- [ ] Event catalogue — `brief.completed`, `brief.shared`, `gap_analysis.completed`, `project_plan.generated`, `project_plan.pushed`
- [ ] Event emitter helper — `emitWebhookEvent(eventType, payload, userId)` enqueues delivery jobs for matching endpoints
- [ ] Background queue worker — Inngest or Vercel Queues; exponential backoff (1m, 5m, 30m, 2h, 12h), max 5 attempts, dead-letter table
- [ ] HMAC signing — `X-Briefly-Signature` (sha256), `X-Briefly-Timestamp`, replay window check on docs side
- [ ] Settings UI — `/settings/webhooks` list, create/edit/delete endpoint, event filter checkboxes, test-fire button, delivery log viewer with replay
- [ ] Hook event emission into existing flows — brief completion server action, gap analysis completion, project plan push success
- [ ] Public docs — event catalogue page, signature verification snippet (Node + Python), curl examples
- [ ] Stretch: ship a community n8n node + Workato connector that wrap the API + webhook subscription

## See Also

- [[Features/3.5 - Slack & Workflow Integration]]
- [[Features/3.3 - Public API]]
- [[Tasks/Public API]]
- [[Tasks/Slack Bot]]
- [[Extensibility]]

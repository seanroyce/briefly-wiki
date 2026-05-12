---
title: "Sentry Error Tracking"
status: "4-done"
sprint: 2
phase: 1
section: "cross-cutting"
priority: p1
size: s
category: infrastructure
tags:
  - task
---

# Sentry Error Tracking

Add Sentry before onboarding any external users so production errors are visible.

## Tasks

- [ ] Install `@sentry/nextjs`
- [ ] Run `npx @sentry/wizard@latest -i nextjs` to configure `sentry.client.config.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts`
- [ ] Set `SENTRY_DSN` env var in `.env.local` and Vercel dashboard
- [ ] Create alerts: AI API errors (5xx from Anthropic), auth failures, unhandled exceptions
- [ ] Set up Vercel Analytics (enable in Vercel dashboard — zero config)

## See Also

- [[Deploy]]
- [[Extensibility]]

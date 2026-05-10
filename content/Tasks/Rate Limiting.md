---
title: "Rate Limiting"
status: "4-done"
sprint: 2
phase: 1
section: "1.5"
priority: p0
size: m
category: ai
tags:
  - task
---

# Rate Limiting

Protect AI endpoints from abuse before public launch. Upstash Redis is the right choice — durable across serverless cold starts.

## Tasks

- [ ] Add `@upstash/ratelimit` + `@upstash/redis` packages
- [ ] Create Upstash Redis database (free tier)
- [ ] Set `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` env vars
- [ ] Apply rate limits: `processAllNotes` → 10/hr per user, `analyzeGaps` → 20/hr, `POST /api/ai/refine` → 30/hr
- [ ] Return `429` with a user-facing message when limit is hit

## See Also

- [[Features/1.5 - AI Processing Pipeline]]
- [[Extensibility]]

---
title: "Public API"
status: "3-backlog"
sprint: 0
phase: 3
section: "3.3"
priority: p3
size: l
category: integrations
tags:
  - task
---

# Public API

A RESTful API for programmatic brief creation and management.

## Tasks

- [ ] API key management — generate/revoke keys in account settings; store hashed in DB
- [ ] Auth middleware — validate `Authorization: Bearer <key>` header on all `/api/v1/` routes
- [ ] `POST /api/v1/briefs` — create brief from JSON payload
- [ ] `GET /api/v1/briefs/:id` — fetch brief + sections
- [ ] `PATCH /api/v1/briefs/:id` — update brief
- [ ] Per-key rate limiting and usage tracking
- [ ] OpenAPI spec (auto-generated or manual)

## See Also

- [[Features/3.3 - Public API]]
- [[Extensibility]]

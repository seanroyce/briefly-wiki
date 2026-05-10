---
title: "Security Hardening"
status: "3-backlog"
sprint: 2
phase: 1
section: "cross-cutting"
priority: p1
size: m
category: infrastructure
tags:
  - task
---

# Security Hardening

Pre-launch security pass before external users touch the app.

## Tasks

- [ ] Content Security Policy headers in `next.config.ts`
- [ ] File upload magic bytes validation — verify file content matches declared MIME type (don't trust extension alone)
- [ ] `npm audit` step in CI (GitHub Actions)
- [ ] Enable Dependabot for automated dependency updates (`.github/dependabot.yml`)
- [ ] RLS integration tests — verify each policy rejects cross-user data access

## See Also

- [[Database]]
- [[Deploy]]

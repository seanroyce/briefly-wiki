---
title: "Auth Edge Cases"
status: "3-backlog"
sprint: 1
phase: 1
section: "1.2"
priority: p1
size: s
category: auth
tags:
  - task
---

# Auth Edge Cases

Handle the auth failure modes that should be resolved before public launch.

## Tasks

- [ ] Duplicate email on signup → show "An account with this email already exists" with link to `/login`
- [ ] OAuth email collision (same email, different provider) → link accounts or show clear resolution error
- [ ] Expired session → redirect to `/login` with "Your session expired" message, preserve the original destination URL in `?redirect=`

## See Also

- [[Features/1.2 - Authentication]]
- [[Auth]]

---
title: "Connected Accounts Settings"
status: "3-backlog"
sprint: 2
phase: 1
section: "1.9"
priority: p2
size: s
category: auth
tags:
  - task
---

# Connected Accounts Settings

Show Google OAuth connection status in `/settings` and allow users to disconnect.

## Tasks

- [ ] Detect whether the current user signed in via Google (check `app_metadata.provider`)
- [ ] Render "Connected Accounts" section in settings — Google logo, "Connected" badge or "Not connected" state
- [ ] "Disconnect Google" button → unlink via Supabase Admin API; show confirmation toast

## See Also

- [[Features/1.9 - Account Settings]]
- [[Auth]]

---
title: "Shareable Brief Links"
status: "3-backlog"
sprint: 3
phase: 2
section: "2.1"
priority: p1
size: m
category: sharing
tags:
  - task
---

# Shareable Brief Links

Allow users to generate a public read-only link for any brief — no login required for the recipient.

## Tasks

- [ ] `shareBrief` server action — generate `share_token` (nanoid), set `is_shared = true`
- [ ] `unshareBrief` server action — clear `share_token`, set `is_shared = false`
- [ ] RLS policy: allow `SELECT` on `briefs` and `brief_sections` where `is_shared = true` without `auth.uid()` check
- [ ] `GET /api/shared/[token]` route — fetch brief + sections by token, no auth required
- [ ] `/brief/share/[token]` page — clean read-only view, "Created with Briefly" footer
- [ ] Share/unshare toggle UI on brief view page (copy link to clipboard on share)

## See Also

- [[Features/2.1 - Shareable Brief Links]]
- [[Database]]

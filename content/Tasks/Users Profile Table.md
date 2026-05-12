---
title: "Users Profile Table"
status: "4-done"
sprint: 1
phase: 1
section: "1.2"
priority: p0
size: s
category: auth
tags:
  - task
---

# Users Profile Table

Add a `users` public profile table so name and avatar are stored in Postgres (not just Supabase Auth metadata).

## Tasks

- [x] Write migration: `users` table — `id` (references `auth.users`), `email`, `full_name`, `avatar_url`, `auth_provider`, `created_at`, `updated_at`
- [x] Add RLS: users can only select/update their own row
- [x] Write DB trigger: auto-insert into `users` on `auth.users` insert
- [x] Update `updateProfile` server action to write to `users` table (not just auth metadata)
- [x] Apply migration to Supabase — confirmed applied (2026-05-10); public.users table live with auto-populate trigger verified against prod

## See Also

- [[Features/1.2 - Authentication]]
- [[Database]]

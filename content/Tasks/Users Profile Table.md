---
title: "Users Profile Table"
status: "2-ready"
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

- [ ] Write migration: `users` table — `id` (references `auth.users`), `email`, `full_name`, `avatar_url`, `auth_provider`, `created_at`, `updated_at`
- [ ] Add RLS: users can only select/update their own row
- [ ] Write DB trigger: auto-insert into `users` on `auth.users` insert
- [ ] Update `updateProfile` server action to write to `users` table (not just auth metadata)
- [ ] Apply migration to Supabase

## See Also

- [[Features/1.2 - Authentication]]
- [[Database]]

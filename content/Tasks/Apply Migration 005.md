---
title: "Apply Migration 005 — project_plans table"
status: "4-done"
sprint: 5
phase: 3
section: "3.2"
priority: p0
size: xs
category: infrastructure
tags:
  - task
---

# Apply Migration 005 — project_plans table

`supabase/migrations/005_project_plans.sql` was written and committed in Sprint 4 but not yet applied to the remote Supabase instance. Must be applied before `generateProjectPlan()` can persist plans in production.

## Tasks

- [x] Paste `supabase/migrations/005_project_plans.sql` into the Supabase SQL Editor for project `fhrolhncxmwviichjmst`
- [x] Confirm `project_plans` table appears in the Supabase dashboard with RLS enabled and 2 policies (select + insert)
- [ ] Verify a test call to `generateProjectPlan()` inserts a row successfully

## SQL

```sql
create table public.project_plans (
  id          uuid primary key default gen_random_uuid(),
  brief_id    uuid not null references public.briefs(id) on delete cascade,
  plan_json   jsonb not null,
  model       text not null,
  created_at  timestamptz not null default now(),
  created_by  uuid not null references auth.users(id)
);

create index idx_project_plans_brief_id on public.project_plans(brief_id);

alter table public.project_plans enable row level security;

create policy "Users can select own project plans"
  on public.project_plans for select
  using (brief_id in (select id from public.briefs where user_id = auth.uid()));

create policy "Users can insert own project plans"
  on public.project_plans for insert
  with check (
    brief_id in (select id from public.briefs where user_id = auth.uid())
    and created_by = auth.uid()
  );
```

## See Also

- [[Tasks/Project Plan Generation]]
- [[Database]]
- [[Deploy]]

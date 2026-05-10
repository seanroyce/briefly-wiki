---
title: Database Schema
tags:
  - database
  - supabase
  - reference
---

# Database Schema

All tables live in Supabase Postgres. Row Level Security (RLS) is enabled on all tables — users can only access their own rows.

## Tables

### `users`

Public profile table — mirrors auth identity in Postgres so profile data is joinable.

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` | Primary key, references `auth.users.id` |
| `email` | `text` | User email |
| `full_name` | `text` | Display name |
| `avatar_url` | `text` | Profile photo URL |
| `auth_provider` | `text` | e.g. `email`, `google` |
| `created_at` | `timestamptz` | Auto-set |
| `updated_at` | `timestamptz` | Auto-updated via trigger |

**Trigger:** `on_auth_user_created` — fires after `auth.users` insert, auto-populates this table via `handle_new_user()` (security definer).  
**RLS:** Users can select and update their own row only.

### `briefs`

Central table. One row per campaign brief.

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` | Primary key |
| `user_id` | `uuid` | References `auth.users.id` |
| `name` | `text` | Brief name |
| `status` | `text` | `draft` \| `in_progress` \| `complete` |
| `raw_notes` | `text` | Unprocessed user input |
| `ai_metadata` | `jsonb` | Model, tokens, processing time |
| `share_token` | `text` | Unique token for shared links |
| `is_shared` | `boolean` | Whether brief is publicly accessible |
| `created_at` | `timestamptz` | Auto-set |
| `updated_at` | `timestamptz` | Auto-updated via trigger |
| `deleted_at` | `timestamptz` | Soft delete — filter with `.is("deleted_at", null)` |

**Indexes:** `user_id`, `status`, composite `(user_id, updated_at)`

### `brief_sections`

One row per section per brief (9 sections per brief by default).

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` | Primary key |
| `brief_id` | `uuid` | References `briefs.id` |
| `section_number` | `integer` | 1–9 |
| `section_key` | `text` | e.g. `campaign_overview`, `target_audience` |
| `title` | `text` | Display name |
| `content` | `text` | Markdown content |
| `structured_content` | `jsonb` | Subsection-level structured data (added in migration 002) |
| `ai_confidence` | `text` | `high` \| `medium` \| `low` |
| `prompt_answers` | `jsonb` | User answers to prompt questions |
| `is_applicable` | `boolean` | Section applies to this campaign |
| `is_skipped` | `boolean` | User skipped in wizard |
| `wizard_step` | `integer` | Which wizard step (1–6) this section belongs to |

**Unique constraint:** `(brief_id, section_number)`

### `uploaded_files`

Files attached to a brief.

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` | Primary key |
| `brief_id` | `uuid` | References `briefs.id` |
| `filename` | `text` | Original filename |
| `file_type` | `text` | MIME type |
| `file_size` | `integer` | Bytes |
| `storage_path` | `text` | Path in Supabase Storage |
| `extracted_text` | `text` | Text extracted for AI processing |
| `extraction_status` | `text` | `pending` \| `complete` \| `failed` |

### `gaps`

AI-identified planning gaps in a brief.

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` | Primary key |
| `brief_id` | `uuid` | References `briefs.id` |
| `section_number` | `integer` | Which section has the gap |
| `severity` | `text` | `critical` \| `recommended` \| `nice_to_have` |
| `description` | `text` | What's missing |
| `suggested_prompt` | `text` | Question to ask the user |
| `is_dismissed` | `boolean` | User dismissed this gap |

## RLS Policies

All tables follow the same pattern:

```sql
-- Users can only SELECT/INSERT/UPDATE/DELETE their own rows
USING (user_id = auth.uid())
```

For `brief_sections`, `uploaded_files`, and `gaps` — policies join through `briefs` to check `user_id`.

## Migrations

| File | Description |
|------|-------------|
| `supabase/migrations/001_briefs.sql` | All tables, RLS, indexes, `updated_at` triggers |
| `supabase/migrations/002_structured_content.sql` | Adds `structured_content` JSONB to `brief_sections` |
| `supabase/migrations/003_users_profile.sql` | `users` public profile table, RLS, auto-populate trigger |

> [!warning] Migration 003 Pending
> `003_users_profile.sql` has not yet been applied to the remote Supabase instance. Apply via the SQL Editor.

## Supabase Clients

| File | When to Use |
|------|------------|
| `src/lib/supabase/client.ts` | Browser (client components) |
| `src/lib/supabase/server.ts` | Server (server components, server actions) |
| `src/lib/supabase/auth.ts` | `getUser()` helper — always use in server actions |

## Brief Section Keys

The 9 sections defined in `src/lib/mock-data.ts`:

| # | Section Key | Title | Wizard Step |
|---|------------|-------|-------------|
| 1 | `campaign_overview` | Campaign Overview | 1 |
| 2 | `objectives_kpis` | Objectives & KPIs | 1 |
| 3 | `target_audience` | Target Audience | 2 |
| 4 | `value_proposition` | Value Proposition & Messaging | 2 |
| 5 | `channel_strategy` | Channel Strategy | 3 |
| 6 | `budget_resources` | Budget & Resources | 4 |
| 7 | `timeline_milestones` | Timeline & Milestones | 4 |
| 8 | `metrics_approvals` | Metrics & Approvals | 5 |
| 9 | `review` | Review & Gaps | 6 |

## See Also

- [[Architecture]] — data fetchers and server actions
- [[AI Pipeline]] — how gaps are generated
- [[Deploy]] — applying migrations

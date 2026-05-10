---
title: Data Integrity Evals
tags:
  - evals
  - data
  - rls
  - zod
  - persistence
---

# Data Integrity Evals

Cross-cutting eval cases covering Zod validation at every API boundary, Row Level Security row-ownership enforcement, brief duplication fidelity, auto-save partial-state correctness, and soft-delete consistency.

These evals span auth, wizard, AI pipeline, dashboard, and brief view — they are the guardrails that make the per-feature evals meaningful.

**Related wiki:** [[Database]] · [[Conventions]] · [[Architecture]] · [[Auth]]

**Tables under contract:** `users`, `briefs`, `brief_sections`, `uploaded_files`, `gaps`

---

### EC-DATA-1: Zod schema validates every server action's `FormData` boundary

**Given:** any server action that accepts `FormData` (e.g., `signup`, `login`, `createBrief`, `updateBrief`, `updateProfile`, `updatePassword`)
**When:** the action receives malformed input — wrong types, missing required fields, oversize strings, unknown extra fields
**Then:** `mySchema.safeParse(Object.fromEntries(formData))` returns `{ success: false }`, the action returns `{ error }` (Zod v4 formatted message) without touching Supabase, and the UI surfaces a Sonner error or inline message. Critically, no Supabase call occurs before validation passes
**Priority:** P0
**Tags:** #data-integrity #zod #validation #boundary

---

### EC-DATA-2: Zod v4 syntax is used everywhere (no v3 holdovers)

**Given:** the type/schema files (`src/types/brief.ts`, `src/types/auth.ts`, etc.)
**When:** the code is compiled and tested
**Then:** every `z.record(...)` has TWO arguments per Zod v4 convention (e.g., `z.record(z.string(), z.unknown())`); no `z.record(z.unknown())` single-arg calls remain. Validation error messages match Zod v4 output format (not v3)
**Priority:** P0
**Tags:** #data-integrity #zod

---

### EC-DATA-3: RLS — users see only their own briefs

**Given:** the database contains briefs for users A, B, C
**When:** authenticated user A executes ANY query against `briefs` (via dashboard load, single brief fetch, export endpoint, etc.)
**Then:** the result set contains only rows where `briefs.user_id = A`. This must hold even if a malicious request tries to pass `user_id = B` or query by a known `briefs.id` belonging to B. Verify by inspecting Supabase logs or by direct REST call attempts
**Priority:** P0
**Tags:** #data-integrity #rls #security

---

### EC-DATA-4: RLS — `brief_sections`, `uploaded_files`, `gaps` ownership joins through `briefs`

**Given:** authenticated user A and a brief belonging to user B with sections, uploaded files, and gaps
**When:** A attempts to read or write any of these child rows by id (e.g., direct REST PATCH on `brief_sections/{B-section-id}`)
**Then:** RLS blocks the access — policies join through `briefs` to check `user_id = auth.uid()`. The response is empty (for SELECT) or rejected (for UPDATE/DELETE/INSERT). No child row is mutated
**Priority:** P0
**Tags:** #data-integrity #rls #security

---

### EC-DATA-5: RLS — `users` profile table ownership

**Given:** the `users` public profile table populated for users A, B
**When:** authenticated user A reads or updates `users`
**Then:** A can only SELECT and UPDATE their own row. Attempts to read B's row return zero results; attempts to update B's row are rejected. The `on_auth_user_created` trigger correctly populates the row on signup with security-definer privilege
**Priority:** P0
**Tags:** #data-integrity #rls #users

> Per [[Database]] / [[Roadmap]]: migration `003_users_profile.sql` was pending in older notes. Verify it has been applied to the remote Supabase before testing.

---

### EC-DATA-6: Soft delete — deleted briefs are excluded from all reads

**Given:** a user with 3 briefs, one of which has `deleted_at` set
**When:** the data fetchers `listBriefs`, `getBrief`, `getBriefWithSections` run, and the export endpoints are hit
**Then:** the deleted brief is excluded from every response — fetchers add `.is("deleted_at", null)` per [[Conventions]]. Direct navigation to `/brief/{deleted-id}` returns 404. Export endpoints for the deleted brief return 404
**Priority:** P0
**Tags:** #data-integrity #soft-delete

---

### EC-DATA-7: Soft delete — account deletion cascades to soft-deleting briefs

**Given:** an authenticated user with 5 briefs in mixed statuses
**When:** they confirm account deletion in `/settings`
**Then:** every one of their 5 briefs gets `deleted_at` set (or is hard-deleted if that is the documented behavior — verify and assert), the user is signed out, and a new user with the same email cannot see any of those briefs (RLS plus `deleted_at` filter)
**Priority:** P0
**Tags:** #data-integrity #soft-delete #destructive

---

### EC-DATA-8: Auto-save preserves partial state correctly

**Given:** the user types into Section 4 of the wizard, with Sections 1, 2, 3 already populated and Sections 5–9 empty
**When:** the 3s debounce fires (`bulkUpdateBriefSections` is called)
**Then:** ONLY the changed section's row is updated with the new content (or all rows are updated but only the diff is applied — verify the implemented contract). Sections 1, 2, 3 are not overwritten or zeroed. Sections 5–9 are not corrupted. After reload, the partial state is exactly what the user had before save
**Priority:** P0
**Tags:** #data-integrity #autosave #partial-state

---

### EC-DATA-9: Auto-save does not create duplicate `brief_sections` rows

**Given:** the unique constraint on `brief_sections (brief_id, section_number)`
**When:** rapid auto-saves fire concurrently (e.g., user types and clicks Next within 100ms)
**Then:** existing rows are UPDATEd, not INSERTed. The unique constraint protects against duplicates. The DB never has two rows for the same `(brief_id, section_number)` pair
**Priority:** P0
**Tags:** #data-integrity #autosave #constraint

---

### EC-DATA-10: Brief duplication preserves all relevant fields

**Given:** a source brief with: `name`, populated 9 sections each with `content`, `structured_content`, `ai_confidence`, `prompt_answers`, `is_applicable`, `is_skipped`, `wizard_step`
**When:** `duplicateBrief` runs
**Then:** the new brief has a fresh `id`, fresh `created_at`/`updated_at`, the duplicating user's `user_id`, a derived name (e.g., "{original} (copy)"), `status = 'draft'` or matching the documented contract, AND all 9 `brief_sections` rows are copied with `content`, `structured_content`, `ai_confidence`, `prompt_answers`, `is_applicable`, `is_skipped`, `wizard_step` preserved. Per the documented contract: confirm whether `uploaded_files` and `gaps` are also copied (they shouldn't be by default), and assert the chosen behavior
**Priority:** P0
**Tags:** #data-integrity #duplication

---

### EC-DATA-11: Brief duplication respects RLS

**Given:** authenticated user A and `briefId` belonging to user B
**When:** A invokes `duplicateBrief` with B's id
**Then:** The fetch of B's brief returns nothing (RLS), the action errors out, and no new row appears in user A's account. This is the same security guarantee as [[dashboard-evals]] EC-DASH-11 and [[ai-pipeline-evals]] EC-AI-2
**Priority:** P0
**Tags:** #data-integrity #duplication #rls

---

### EC-DATA-12: `gaps` rows are schema-valid after every `analyzeGaps` run

**Given:** any `analyzeGaps` invocation (initial or "Re-check")
**When:** the action persists results
**Then:** every inserted `gaps` row satisfies the table schema and constraints from [[Database]]:
- `id` is a uuid
- `brief_id` references an existing brief owned by the user
- `section_number` is an integer 1–9
- `severity` is one of `critical` / `recommended` / `nice_to_have`
- `description` is a non-empty string
- `suggested_prompt` is a non-empty string
- `is_dismissed` defaults to `false`
No row violates any column type, nullability, or check constraint
**Priority:** P0
**Tags:** #data-integrity #gaps #schema

---

### EC-DATA-13: `briefs.status` only ever takes documented values

**Given:** any code path that sets `briefs.status`
**When:** mutations occur
**Then:** the value is always one of `draft` / `in_progress` / `complete`. No code path sets it to a typo or arbitrary string. Database-level check constraint or enum (if used) catches violations
**Priority:** P1
**Tags:** #data-integrity #enum #status

---

### EC-DATA-14: `ai_confidence` only takes `high` / `medium` / `low`

**Given:** any code path that sets `brief_sections.ai_confidence`
**When:** mutations occur
**Then:** the value is always one of `high` / `medium` / `low`. Bad Claude output that produces an out-of-range value should be normalized or rejected at parse time (see also [[ai-pipeline-evals]] EC-AI-4)
**Priority:** P1
**Tags:** #data-integrity #ai #enum

---

### EC-DATA-15: `structured_content` JSONB shape is consistent per section

**Given:** a `brief_sections` row with `structured_content` populated
**When:** the column is read back
**Then:** the JSONB is a flat object whose keys correspond to the subsection keys defined for that `section_key` (per `BRIEF_SECTIONS` / `CHANNEL_SUB_SECTIONS` in `src/lib/mock-data.ts`), and values are strings (or the documented value type). The `<SubsectionPreviewTable />` renders it as a two-column key/value table without errors
**Priority:** P1
**Tags:** #data-integrity #jsonb #shape

---

### EC-DATA-16: Server actions never trust client-supplied `user_id`

**Given:** any server action (e.g., `createBrief`, `updateBrief`, `duplicateBrief`)
**When:** the action runs
**Then:** the user identity is always pulled from `getUser()` server-side; no `user_id` from `FormData` or request body is used to determine ownership. This is the [[Auth]] "Never Trust Client-Sent User IDs" rule. Even if a `user_id` field is sent, the action ignores it
**Priority:** P0
**Tags:** #data-integrity #security #server-action

---

### EC-DATA-17: `updated_at` triggers fire on every row mutation

**Given:** the `updated_at` triggers on `briefs`, `users`, `brief_sections` (per migration 001)
**When:** any UPDATE happens — auto-save, status change, name edit, profile update
**Then:** the row's `updated_at` is bumped to NOW(), the dashboard last-modified timestamp reflects the change, and the dashboard sort by "last modified" reorders correctly
**Priority:** P1
**Tags:** #data-integrity #triggers #updated-at

---

### EC-DATA-18: Composite index `(user_id, updated_at)` on `briefs` is used by the dashboard query

**Given:** the dashboard query that fetches a user's briefs sorted by last-modified
**When:** the query plan is examined (`EXPLAIN ANALYZE`)
**Then:** the planner uses the composite index `(user_id, updated_at)` rather than a sequential scan. This becomes load-bearing as users accumulate briefs and is worth verifying once if not in routine CI
**Priority:** P2
**Tags:** #data-integrity #performance #index

---
title: Dashboard Evals
tags:
  - evals
  - dashboard
  - ui
---

# Dashboard Evals

Eval cases for the brief list at `/dashboard`.

**Related wiki:** [[Components]] (`<BriefCard />`, `<EmptyState />`) · [[Features/1.3 - Dashboard]] · [[Architecture]]

**Routes under test:** `/dashboard`
**Server actions under test:** `createBrief`, `deleteBrief`, `duplicateBrief` (used from this surface), `listBriefs` (data fetcher)

---

### EC-DASH-1: Empty state for new account

**Given:** an authenticated user with zero briefs (no rows in `briefs` matching their `user_id` with `deleted_at IS NULL`)
**When:** they navigate to `/dashboard`
**Then:** `<EmptyState />` renders with an illustration, headline ("No briefs yet" or similar), description, and a CTA button that creates a new brief and routes to `/brief/new?briefId=...&step=1`
**Priority:** P0
**Tags:** #dashboard #empty-state

---

### EC-DASH-2: Brief list renders cards for owned briefs

**Given:** the authenticated user owns 3 non-deleted briefs in mixed statuses (`draft`, `in_progress`, `complete`)
**When:** they navigate to `/dashboard`
**Then:** exactly 3 `<BriefCard />` items render, each showing: brief name, status badge, completion progress bar, gap count, last-modified timestamp, and an options menu (3-dot dropdown). Soft-deleted briefs (with `deleted_at` set) are NOT visible
**Priority:** P0
**Tags:** #dashboard #brief-card

---

### EC-DASH-3: Brief card click routes to the read view

**Given:** a `complete` brief on the dashboard
**When:** the user clicks the card body (not the options menu)
**Then:** they are navigated to `/brief/{id}` (the read view), the URL updates, and the read view renders the brief
**Priority:** P0
**Tags:** #dashboard #navigation

---

### EC-DASH-4: Brief card click on draft routes to the wizard

**Given:** a `draft` or `in_progress` brief on the dashboard
**When:** the user clicks the card body
**Then:** they are navigated either to `/brief/{id}/edit?step=1` or to `/brief/new?briefId={id}` per the implementation choice — verify the implemented behavior, document it, and assert the user can resume editing without losing state
**Priority:** P1
**Tags:** #dashboard #navigation

---

### EC-DASH-5: Search filters by brief name (client-side)

**Given:** the user has 5 briefs with names "Q1 Launch", "Q2 Launch", "Brand Refresh", "Holiday Push", "Webinar Series"
**When:** they type "Launch" into the search input
**Then:** the visible cards reduce to "Q1 Launch" and "Q2 Launch" only, matching is case-insensitive, the filter is debounced or instant (no flicker), and clearing the search restores all cards. Per the wiki, this is client-side — verify no extra DB queries fire on each keystroke
**Priority:** P0
**Tags:** #dashboard #search

---

### EC-DASH-6: Search with no matches shows zero-result state

**Given:** the user has any number of briefs, none matching "zzzzz"
**When:** they search for "zzzzz"
**Then:** the cards container is empty, a clear "no results" message renders (distinct from the empty-state for an account with zero briefs), and clearing the search restores the list
**Priority:** P1
**Tags:** #dashboard #search #empty-state

---

### EC-DASH-7: Sort dropdown reorders the list

**Given:** the user has briefs created and modified at different times
**When:** they choose "Sort by name (A→Z)" / "Created date" / "Last modified"
**Then:** the cards reorder accordingly, the selected sort persists for the session, and the default sort is "Last modified, newest first"
**Priority:** P1
**Tags:** #dashboard #sort

> Per [[Features/1.3 - Dashboard]], the sort dropdown is listed as remaining work. If absent, this case may FAIL — record as known gap, not regression.

---

### EC-DASH-8: Delete with confirmation dialog

**Given:** a brief on the dashboard
**When:** the user opens the card's options menu, clicks "Delete", reviews the confirmation Dialog, and clicks Confirm
**Then:** `deleteBrief` server action runs, sets `deleted_at = now()` (soft delete per [[Conventions]]), the card disappears from the dashboard via revalidation, a Sonner success toast confirms deletion, and the brief no longer renders even after a hard refresh
**Priority:** P0
**Tags:** #dashboard #delete #destructive

---

### EC-DASH-9: Delete cancellation leaves the brief intact

**Given:** the delete confirmation dialog is open
**When:** the user clicks Cancel (or presses Escape, or clicks the backdrop)
**Then:** the dialog closes, no `deleteBrief` call is made, the brief remains visible on the dashboard, and `deleted_at` in the DB is still null
**Priority:** P0
**Tags:** #dashboard #delete #safety

---

### EC-DASH-10: Duplicate creates a new brief preserving sections

**Given:** an existing brief with all 9 sections populated and 3 uploaded files
**When:** the user clicks "Duplicate" in the card options menu
**Then:** `duplicateBrief` server action creates a NEW `briefs` row (new `id`, same `user_id`, name appended with " (copy)" or similar), copies all `brief_sections` rows preserving `content`, `structured_content`, `ai_confidence`, `is_applicable`, and routes the user to either the duplicate's read view or wizard. The original brief is unchanged. Whether `uploaded_files` and `gaps` are duplicated is implementation-defined — document the contract and assert it
**Priority:** P0
**Tags:** #dashboard #duplicate #data-integrity

---

### EC-DASH-11: Duplicate respects ownership (cannot duplicate another user's brief)

**Given:** authenticated user A and a `briefId` belonging to user B
**When:** A simulates a `duplicateBrief` call with B's id
**Then:** the action errors out (RLS-enforced read fails), no new row is created in user A's account, and no row in user B's account is mutated
**Priority:** P0
**Tags:** #dashboard #duplicate #security #rls

---

### EC-DASH-12: "+ New brief" CTA in navbar/empty-state creates and routes

**Given:** any authenticated dashboard view
**When:** the user clicks the "+ New brief" button
**Then:** `createBrief` runs, a new row is inserted with `status = 'draft'`, the user is redirected to `/brief/new?briefId={uuid}&step=1`, and the wizard renders Step 1 with empty inputs
**Priority:** P0
**Tags:** #dashboard #create

---

### EC-DASH-13: Loading skeleton state on initial dashboard render

**Given:** an authenticated user navigating to `/dashboard` with throttled network
**When:** the data fetcher (`listBriefs`) is in-flight
**Then:** a grid of skeleton placeholders (target: 6 skeleton cards in a responsive grid per [[Features/1.3 - Dashboard]]) renders, the layout does not jump when real cards swap in, and there is no flash of empty-state during loading
**Priority:** P1
**Tags:** #dashboard #loading

> Per [[Features/1.3 - Dashboard]], skeletons are remaining work. Treat absence as known gap.

---

### EC-DASH-14: Dashboard does not leak other users' briefs

**Given:** the database contains briefs owned by users A, B, C
**When:** user A loads `/dashboard`
**Then:** only A's briefs are visible. The network response from `listBriefs` (or its underlying Supabase query) returns only rows where `user_id = A`, enforced by RLS regardless of any client-side filter. This is a security-critical case — see also [[data-integrity-evals]] EC-DATA-3
**Priority:** P0
**Tags:** #dashboard #security #rls

---

### EC-DASH-15: Status badges and gap counts reflect DB truth

**Given:** a brief with `status = 'in_progress'` and 4 active (non-dismissed) gaps in the DB
**When:** the dashboard card renders
**Then:** the status badge text matches the status, the gap count shows 4 (not "0", not stale), the completion bar reflects the proportion of populated sections (or whatever the documented formula is), and dismissed gaps are NOT counted
**Priority:** P1
**Tags:** #dashboard #brief-card #data-fidelity

---
title: Wizard Evals
tags:
  - evals
  - wizard
  - ux
---

# Wizard Evals

Eval cases for the 6-step brief builder at `/brief/new?briefId={id}` and `/brief/[id]/edit`.

**Related wiki:** [[Wizard]] · [[Features/1.6 - Wizard UI]]

**Authoritative step definition:** `WIZARD_STEPS` in `src/lib/mock-data.ts`. The wiki notes that the original spec described 5 steps but the implementation is 6 — these evals follow the implementation.

| Step | Name | Sections covered |
|------|------|------------------|
| 1 | Import & Overview | Campaign Overview, Objectives & KPIs |
| 2 | Audience & Messaging | Target Audience, Value Proposition |
| 3 | Channel Strategy | Channel Strategy (8 sub-channels) |
| 4 | Budget & Timeline | Budget & Resources, Timeline & Milestones |
| 5 | Metrics & Approvals | Metrics & Approvals |
| 6 | Review & Gaps | Full review + AI gap analysis |

---

### EC-WIZ-1: Wizard entry requires a `briefId`

**Given:** an authenticated user
**When:** they click "+ New brief" on the dashboard
**Then:** `createBrief` is called, a new `briefs` row is created with `status = 'draft'`, the user is redirected to `/brief/new?briefId={uuid}&step=1`, and the wizard renders Step 1. Navigating directly to `/brief/new` without a `briefId` either creates a new brief or redirects to the dashboard — it must NOT render an undefined-state wizard
**Priority:** P0
**Tags:** #wizard #navigation

---

### EC-WIZ-2: Step indicator reflects 6 steps

**Given:** the wizard is rendered at any step
**When:** the user inspects `<WizardStepper />`
**Then:** exactly 6 steps are shown, each with one of these states: `pending` / `active` / `complete` / `skipped`. The active step matches `?step=N` from the URL. The labels match `WIZARD_STEPS` in `src/lib/mock-data.ts`
**Priority:** P0
**Tags:** #wizard #stepper

---

### EC-WIZ-3: Step 1 raw notes input + file upload happy path

**Given:** a fresh draft brief on Step 1
**When:** the user pastes a paragraph of marketing notes into the textarea AND drops a valid 1MB PDF into `<FileUploadZone />`
**Then:** the file uploads successfully (progress bar reaches 100%, toast confirms), `uploaded_files` row is created with `extraction_status` cycling `pending → complete`, and the "Process notes" button becomes enabled
**Priority:** P0
**Tags:** #wizard #step-1 #file-upload

---

### EC-WIZ-4: Step 1 file upload rejects unsupported type and oversize

**Given:** Step 1 is rendered
**When:** the user attempts to drop (a) a `.zip` file, (b) an 11MB PDF, or (c) a 6th file when 5 are already attached
**Then:** each rejection produces a Sonner error toast with a specific reason ("Unsupported file type", "File exceeds 10MB", "Maximum 5 files"), no `uploaded_files` row is created, and the existing valid files remain untouched
**Priority:** P0
**Tags:** #wizard #step-1 #file-upload #edge

---

### EC-WIZ-5: Step 1 "Process notes" with empty input

**Given:** Step 1 with no raw notes typed and no files uploaded
**When:** the user looks at / clicks the "Process notes" button
**Then:** the button is disabled (preferred), or if clicked, the action returns a Zod validation error and shows a Sonner error toast — no Claude API call is made and no `processing` indicator appears
**Priority:** P0
**Tags:** #wizard #step-1 #ai #edge

---

### EC-WIZ-6: Step 1 "Process notes" happy path → fan-out to 9 sections

**Given:** Step 1 with substantive raw notes (and optionally a parsed file)
**When:** the user clicks "Process notes"
**Then:** `<AIProcessingIndicator />` shows the animated gradient bar with rotating status text, `processAllNotes` fans out across all 9 sections in parallel, on completion each `BriefSectionCard` for sections 1 and 2 is populated with `content` and `structured_content`, an AI confidence badge (emerald/amber/slate) is visible, and the user can advance to Step 2
**Priority:** P0
**Tags:** #wizard #step-1 #ai

---

### EC-WIZ-7: Auto-save on idle (3s debounce)

**Given:** the user is editing the textarea on any `BriefSectionCard`
**When:** they stop typing for >= 3 seconds
**Then:** `bulkUpdateBriefSections` is called once (not per keystroke), the indicator transitions "Saving..." → "Saved ✓", and reloading the page shows the typed content persisted in `brief_sections.content`
**Priority:** P0
**Tags:** #wizard #autosave

---

### EC-WIZ-8: Auto-save on step transition

**Given:** unsaved edits exist in a section card
**When:** the user clicks "Next"
**Then:** save fires *immediately* (does not wait 3s), the next step renders only after the save resolves successfully, and the saved state is visible if the user uses the back button to return
**Priority:** P0
**Tags:** #wizard #autosave #navigation

---

### EC-WIZ-9: Back navigation preserves state

**Given:** Step 3 is fully populated and saved
**When:** the user clicks Back, edits a value on Step 2, then clicks Next
**Then:** Step 3's prior content is intact (not regenerated, not blanked), the Step 2 edit is persisted, and `?step=N` in the URL stays in sync with the rendered step
**Priority:** P0
**Tags:** #wizard #navigation #state

---

### EC-WIZ-10: Step 3 channel sub-section accordion

**Given:** Step 3 (Channel Strategy) is rendered
**When:** the user inspects the accordion
**Then:** exactly 8 sub-channels are listed in this order: Web, Social Media, Email, Webinars, Events, Paid Media, Press Releases, Analyst Relations. Each has an "applicable / not applicable" toggle. Toggling one to non-applicable greys out its content area and persists `is_applicable = false` for that sub-section
**Priority:** P0
**Tags:** #wizard #step-3 #channel

---

### EC-WIZ-11: Step 3 only stores non-applicable for marked-off channels

**Given:** the user has marked Webinars and Events as non-applicable on Step 3
**When:** they save and reload the wizard
**Then:** the toggles for Webinars and Events render as off, their content remains greyed, and the brief's overall `channel_strategy.structured_content` reflects only the applicable channels in any AI re-processing or gap analysis
**Priority:** P1
**Tags:** #wizard #step-3 #persistence

---

### EC-WIZ-12: Per-section "Process Context" button

**Given:** Step 2 with raw notes that mention an audience
**When:** the user clicks "Process Context" on the Target Audience section card only
**Then:** only that one section is sent to Claude (`processContext` for that `section_key`), `<AIProcessingIndicator />` is scoped to that card, on completion only that card is updated, the AI confidence badge is set, and other cards on the same step are untouched
**Priority:** P0
**Tags:** #wizard #ai #per-section

---

### EC-WIZ-13: AI failure shows error and preserves user input

**Given:** the user has typed content into Section 4 and clicks "Process Context"
**When:** the Claude API call fails (timeout, 5xx, or thrown exception via `lib/ai/retry.ts` exhausting retries)
**Then:** a Sonner error toast appears with a clear message, the typed content remains in the textarea (NOT overwritten by partial/empty AI output), the AI confidence badge is not falsely set to high, and the user can retry by clicking the button again
**Priority:** P0
**Tags:** #wizard #ai #error-handling #resilience

---

### EC-WIZ-14: "Ask AI to help" inline refine

**Given:** Section 3 has existing structured content
**When:** the user types additional context into the "Add context" textarea on the section card and clicks the Sparkles "Ask AI to help" button
**Then:** `POST /api/ai/refine` is called with `{ briefId, sectionKey, currentContent, userContext }`, on success the structured content is updated in place, the "Add context" textarea is cleared, a Sonner toast confirms refinement, and the section confidence badge updates if changed
**Priority:** P1
**Tags:** #wizard #ai #refine

---

### EC-WIZ-15: "Ask AI to help" disabled on empty section

**Given:** a section card with no existing content
**When:** the user inspects the "Ask AI to help" button
**Then:** the button is disabled (per [[AI Pipeline]]: "Enabled when the section has existing content"), and no `/api/ai/refine` request can be made
**Priority:** P1
**Tags:** #wizard #ai #refine #edge

---

### EC-WIZ-16: Step 6 gap analysis happy path

**Given:** all sections of a brief are populated
**When:** the user reaches Step 6 and clicks "Analyze gaps"
**Then:** `analyzeGaps` is called, a loading state is shown, on completion the `gaps` table is repopulated (previous gaps cleared), `<GapCard />` items render sorted by severity (critical → recommended → nice_to_have), each card shows `description` + `suggested_prompt` + a "Fix this" link to the relevant wizard step + a "Dismiss" button
**Priority:** P0
**Tags:** #wizard #step-6 #ai #gaps

---

### EC-WIZ-17: Step 6 "Fix this" navigates to the gap's section

**Given:** a gap of severity `critical` for `section_number = 4` is rendered on Step 6
**When:** the user clicks "Fix this"
**Then:** the wizard navigates to the step containing section 4 (Step 4: Budget & Timeline), scrolls to / focuses the Budget & Resources card, and `?step=4` is reflected in the URL
**Priority:** P1
**Tags:** #wizard #step-6 #navigation

---

### EC-WIZ-18: Step 6 "Dismiss" optimistic update

**Given:** Step 6 with one or more gaps rendered
**When:** the user clicks "Dismiss" on a gap card
**Then:** the gap is immediately removed from the visible list (optimistic UI), `dismissGap` server action sets `is_dismissed = true` in the DB, and re-renders do not bring it back. If the action fails, the card returns with a Sonner error toast
**Priority:** P1
**Tags:** #wizard #step-6 #optimistic-ui

---

### EC-WIZ-19: Step 6 "Mark as complete" finalizes the brief

**Given:** Step 6 with zero un-dismissed critical gaps (or the user accepts remaining gaps)
**When:** the user clicks "Mark as complete"
**Then:** `briefs.status` is set to `complete`, `updated_at` is bumped, the user is redirected to `/brief/{id}` (the read view), and the dashboard reflects the new status badge on next load
**Priority:** P0
**Tags:** #wizard #step-6 #completion

---

### EC-WIZ-20: Step 6 "Save as draft" exits without completing

**Given:** Step 6 is rendered
**When:** the user clicks "Save as draft"
**Then:** `briefs.status` remains (or becomes) `in_progress`, the user is redirected to `/dashboard`, and the brief is visible in the list with the in-progress status badge
**Priority:** P0
**Tags:** #wizard #step-6 #completion

---

### EC-WIZ-21: Edit mode skips Step 1 processing gate

**Given:** a complete brief, navigating to `/brief/{id}/edit`
**When:** the user inspects the wizard
**Then:** all 6 steps are directly navigable (Step 1's "Process notes" gate is bypassed because content already exists), existing structured content is pre-populated in every section card, the `editMode` prop on `WizardClient` is true, and saves go to the same brief (no duplicate row)
**Priority:** P0
**Tags:** #wizard #edit-mode

---

### EC-WIZ-22: Brief naming inline

**Given:** the wizard is open
**When:** the user clicks the brief name in the header and edits it
**Then:** the new name persists via `updateBrief` (debounced or on blur), the change is reflected on `/dashboard` and `/brief/{id}` after navigation, and an empty name is rejected with a Zod error / inline message
**Priority:** P1
**Tags:** #wizard #naming

---

### EC-WIZ-23: Concurrent autosave does not corrupt section content

**Given:** the user types rapidly into Section 2, then immediately clicks Next before the 3s debounce fires
**When:** both the debounced save and the on-transition save resolve
**Then:** the most recent typed content is what persists in `brief_sections.content` (no race condition where an earlier save overwrites the later one), and the indicator settles on "Saved ✓"
**Priority:** P1
**Tags:** #wizard #autosave #race

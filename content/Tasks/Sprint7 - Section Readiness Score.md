---
title: Section Readiness Score
status: 3-backlog
sprint: 7
phase: 2
section: "2.6"
priority: p2
size: m
category: ai
tags: [task]
---

# Sprint 7 — Section Readiness Score

Implement a per-section **Readiness** score (1–10) returned by Claude alongside gap analysis, persisted on `brief_sections`, and rendered as a red-to-green 10-segment bar in each section card and on the Step 6 Review view. See [[Features/2.6 - Section Actionability Score]] for the full spec.

## Summary

Extend `GAP_ANALYSIS_TOOL` so Claude emits a `readiness_score` per section in the same tool call as gaps. Add two columns to `brief_sections` (`readiness_score`, `score_analyzed_at`). Build a `ReadinessBar` component rendered below the section title (and on Step 6). Dim the bar when the section's `updated_at` is newer than `score_analyzed_at`. Hide entirely until analysis has run.

> [!info] Order of work
> Land the migration and prompt change first so the data flows end-to-end before UI work begins.

## Subtasks

### Database

- [ ] Create migration `supabase/migrations/007_section_readiness_score.sql` adding `readiness_score INTEGER NULL` (with 1–10 check) and `score_analyzed_at TIMESTAMPTZ NULL` to `brief_sections`.
- [ ] Apply migration locally and regenerate Supabase types.
- [ ] Confirm no RLS changes needed (inherits from `briefs`).

### AI / Prompt

- [ ] Extend `GAP_ANALYSIS_TOOL` in `briefly/src/lib/ai/gap-prompts.ts` to add `readiness_score: integer (1–10)` to each per-section item; mark required.
- [ ] Update `buildGapAnalysisMessage` with scoring rubric (10 = ready, 1 = risky) and the criteria (completeness, specificity, consistency, gap severity).
- [ ] Update TypeScript types for the tool-use response payload.

### Server action

- [ ] In `analyzeGaps`, after parsing Claude's tool-use result, `UPDATE brief_sections SET readiness_score = $1, score_analyzed_at = now() WHERE id = $2` for each section.
- [ ] Keep the existing wipe-and-reinsert flow for `gaps` rows unchanged.
- [ ] Add defensive normalization: clamp any returned score to `[1, 10]`; treat malformed/missing as `NULL`.

### UI

- [ ] Build `ReadinessBar` component (10 segments, red→amber→green gradient, fills 1..N where N = score).
- [ ] Show numeric label `Readiness N/10` alongside the bar.
- [ ] Wire `ReadinessBar` into `BriefSectionCard` between the section title and the content/textarea.
- [ ] Render `ReadinessBar` on the Step 6 Review view per section.
- [ ] Hide the bar entirely when `hasAnalyzed === false` or `readiness_score === null`.
- [ ] Apply `opacity-40` + small clock/refresh icon + tooltip "Re-analyze to update" when `section.updated_at > section.score_analyzed_at`.

### Verification

- [ ] Manual: run analysis on a brief, confirm scores render and match Claude's output.
- [ ] Manual: edit a section after analysis, confirm bar dims and tooltip appears.
- [ ] Manual: re-run analysis, confirm staleness clears and score updates.
- [ ] Manual: load a brief that has never been analyzed, confirm no bar renders anywhere.

## Dependencies

- [[Features/1.7 - Gap Analysis]] — must remain green; this builds on `analyzeGaps` and `GAP_ANALYSIS_TOOL`.
- Supabase migration tooling working locally (see [[Database]]).
- Current Claude model + `max_tokens` budget sufficient for added field (negligible — single integer per section).

> [!warning] Don't backfill
> Existing rows must stay `readiness_score = NULL` until the user re-runs analysis. Do not seed a default; the UI relies on `NULL` to mean "hide the bar".

## Acceptance Criteria

- [ ] Migration applied; both new columns exist on `brief_sections`.
- [ ] `analyzeGaps` writes `readiness_score` and `score_analyzed_at` for every section on every run.
- [ ] `ReadinessBar` renders only after analysis, below the section title, on every wizard step card and on Step 6.
- [ ] Bar uses a red→amber→green gradient across 10 segments with N filled.
- [ ] Stale state (edit after analysis) renders the bar dimmed with a re-analyze hint.
- [ ] No regressions in existing [[Gap Analysis]] behavior.

## See Also

- [[Features/2.6 - Section Actionability Score]]
- [[Features/1.7 - Gap Analysis]]
- [[Gap Analysis]]
- [[Wizard UI]]
- [[AI Pipeline]]
- [[Database]]
- `briefly/src/lib/ai/gap-prompts.ts` — tool schema + message builder
- `briefly/src/components/brief-section-card.tsx` — bar placement
- `briefly/src/app/brief/new/wizard-client.tsx` — Step 6 review render

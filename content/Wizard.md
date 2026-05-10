---
title: Wizard
tags:
  - wizard
  - ux
  - reference
---

# Wizard (6-Step Brief Builder)

The wizard at `/brief/new?briefId=:id` walks users through populating a campaign brief. A `briefId` **must exist** before entering — `createBrief` is called when the user clicks "+ New brief" on the dashboard.

> [!info] 6 Steps, Not 5
> The spec originally described 5 steps. The wizard was reworked to 6. `WIZARD_STEPS` in `src/lib/mock-data.ts` is the authoritative definition.

## Steps

| Step | Name | Sections Covered |
|------|------|-----------------|
| 1 | Import & Overview | Campaign Overview, Objectives & KPIs |
| 2 | Audience & Messaging | Target Audience, Value Proposition |
| 3 | Channel Strategy | Channel Strategy (8 sub-channels) |
| 4 | Budget & Timeline | Budget & Resources, Timeline & Milestones |
| 5 | Metrics & Approvals | Metrics & Approvals |
| 6 | Review & Gaps | Full brief review + gap analysis |

## Navigation

- Current step driven by `?step=N` URL query param
- `wizard-client.tsx` holds client-side state
- Back/Next buttons in wizard footer
- Auto-save: debounced 3s after last input + on step transition

## Step 1 — Import & Overview

- Raw notes `<textarea>` — user pastes unstructured marketing context
- `<FileUploadZone />` — drag-and-drop or click to browse
  - Accepted: PDF, DOCX, TXT, PNG, JPG
  - Limits: 10MB per file, 5 files max
- **"Process notes"** button → calls `processContext` server action → `<AIProcessingIndicator />`
- After processing: populates `<BriefSectionCard />` for sections 1 and 2

## Step 3 — Channel Strategy

Uses an **8 sub-channel accordion** (defined in `CHANNEL_SUB_SECTIONS` in `src/lib/mock-data.ts`):

| Sub-channel | Key |
|------------|-----|
| Web | `web` |
| Social Media | `social` |
| Email | `email` |
| Webinars | `webinars` |
| Events | `events` |
| Paid Media | `paid_media` |
| Press Releases | `press_releases` |
| Analyst Relations | `analyst_relations` |

Each: toggle switch (applicable / not applicable), AI-pre-filled content when applicable, prompt questions. Non-applicable channels grey out.

## Step 6 — Review & Gaps

- Read-only view of all 9 sections (only sections with content shown)
- **"Analyze gaps"** → calls `analyzeGaps` → shows loading
- `<GapCard />` list sorted by severity (critical first)
  - "Fix this" → navigates to the relevant wizard step
  - "Dismiss" → calls `dismissGap`, optimistic UI update
- **"Re-check gaps"** → re-runs `analyzeGaps`, replaces gap list
- **"Mark as complete"** → sets `status = 'complete'`, redirects to `/brief/:id`
- **"Save as draft"** → keeps `status = 'in_progress'`, redirects to `/dashboard`

## `BriefSectionCard` Component

`src/components/brief-section-card.tsx` — shared across all wizard steps:

- Section title + AI confidence badge (emerald=high, amber=medium, slate=low)
- `<SubsectionPreviewTable />` — renders `structured_content` JSONB as a two-column table
- Editable `<textarea>` for free-form content
- Collapsible **prompt questions** panel (from section template)
- **"Process Context"** button → calls `processContext` for this section

## Auto-Save

```
3s debounce after last keystroke → saves via bulkUpdateBriefSections
On step transition → immediate save
Indicator: "Saving..." / "Saved ✓"
```

## Key Files

| File | Purpose |
|------|---------|
| `src/app/brief/new/page.tsx` | Server component — auth check, load brief |
| `src/app/brief/new/wizard-client.tsx` | Client wizard shell, step state |
| `src/components/wizard-stepper.tsx` | Horizontal step indicator |
| `src/components/brief-section-card.tsx` | Per-section editor |
| `src/components/file-upload-zone.tsx` | File upload UI |
| `src/components/ai-processing-indicator.tsx` | Animated gradient bar |
| `src/components/gap-card.tsx` | Gap display (severity, description, actions) |
| `src/lib/mock-data.ts` | `WIZARD_STEPS`, `BRIEF_SECTIONS`, `CHANNEL_SUB_SECTIONS`, `SubsectionDef` |

## See Also

- [[AI Pipeline]] — `processContext` and `analyzeGaps` implementation
- [[Components]] — component details and props
- [[Database]] — `brief_sections` schema and `structured_content` column

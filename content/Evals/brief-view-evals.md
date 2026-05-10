---
title: Brief View & Export Evals
tags:
  - evals
  - brief-view
  - export
---

# Brief View & Export Evals

Eval cases for the read view at `/brief/[id]`, the export endpoints, and the edit-route hand-off back to the wizard.

**Related wiki:** [[Architecture]] · [[Features/1.8 - Brief View & Export]] · [[Components]] (`<BriefContent />`, `<BriefSectionNav />`, `<InlineGap />`)

**Routes under test:**
- `/brief/[id]` — read view
- `/brief/[id]/edit` — wizard pre-populated
- `GET /api/brief/[id]/export/pdf`
- `GET /api/brief/[id]/export/markdown`

---

### EC-VIEW-1: Read view renders all 9 sections (when populated)

**Given:** a brief with all 9 sections populated (campaign_overview, objectives_kpis, target_audience, value_proposition, channel_strategy, budget_resources, timeline_milestones, metrics_approvals, review)
**When:** the user navigates to `/brief/{id}`
**Then:** all 9 section blocks render via `<BriefContent />`, the section nav (`<BriefSectionNav />`) shows links to all 9, and the order matches the wiki-defined section numbers 1–9
**Priority:** P0
**Tags:** #brief-view #sections

---

### EC-VIEW-2: Read view shows only populated sections in Step 6 sub-mode

**Given:** a brief with only sections 1, 2, and 5 populated
**When:** the read view renders (or alternatively the Step 6 review sub-view)
**Then:** per the [[Wizard]] note "Read-only view of all 9 sections (only sections with content shown)", empty sections are either hidden or marked clearly as empty rather than rendering blank-but-present headers
**Priority:** P1
**Tags:** #brief-view #sections #empty

---

### EC-VIEW-3: Read view header — name, status, last modified

**Given:** a brief with `name = "Q1 Launch"`, `status = "complete"`, recent `updated_at`
**When:** the read view renders
**Then:** the header shows the brief name, a status badge with the correct text and color, and a human-readable last-modified timestamp ("2 minutes ago" / "May 9, 2026" depending on convention)
**Priority:** P0
**Tags:** #brief-view #header

---

### EC-VIEW-4: Section nav sticky sidebar (desktop)

**Given:** the read view on a desktop viewport (>= lg breakpoint)
**When:** the user scrolls
**Then:** `<BriefSectionNav />` remains sticky on the left/right (per implementation), section links highlight the section currently in view, and clicking a link smooth-scrolls to that section
**Priority:** P1
**Tags:** #brief-view #navigation

---

### EC-VIEW-5: Inline gap indicators within sections

**Given:** a brief with active (non-dismissed) gaps for sections 3 and 7
**When:** the read view renders
**Then:** `<InlineGap />` indicators appear within sections 3 and 7 (not in the others), each showing severity color, a short description, and a way to address the gap (link to edit route or jump to gap detail)
**Priority:** P1
**Tags:** #brief-view #gaps

---

### EC-VIEW-6: PDF export downloads a valid PDF

**Given:** a populated brief
**When:** the user clicks Export → PDF (which triggers `GET /api/brief/{id}/export/pdf`)
**Then:** the response is `Content-Type: application/pdf` (or `application/octet-stream` with a `.pdf` filename), `Content-Disposition` suggests a sane filename derived from the brief name, the body is a valid PDF (starts with `%PDF-`), and the file opens in a PDF viewer with all section headers and content visible
**Priority:** P0
**Tags:** #export #pdf

---

### EC-VIEW-7: PDF export requires ownership

**Given:** authenticated user A and a `briefId` belonging to user B
**When:** A makes `GET /api/brief/{B-briefId}/export/pdf`
**Then:** the response is 403 or 404, no PDF is streamed, and no information about the brief's existence or content is leaked in headers or error body
**Priority:** P0
**Tags:** #export #pdf #security #rls

---

### EC-VIEW-8: PDF export with completely empty brief

**Given:** a brief with all sections empty (just a name)
**When:** the user requests PDF export
**Then:** either the export still produces a valid PDF (with empty section placeholders) OR the request is rejected with a clean 4xx — choose one and document it; assert the chosen behavior. There must NOT be a 500 / unhandled exception
**Priority:** P1
**Tags:** #export #pdf #edge

---

### EC-VIEW-9: Markdown export downloads `.md` file

**Given:** a populated brief
**When:** the user clicks Export → Markdown (`GET /api/brief/{id}/export/markdown`)
**Then:** the response uses `Content-Type: text/markdown` (or `text/plain`) with a `Content-Disposition: attachment; filename="*.md"`, the body is valid Markdown with `#`-prefixed section headers in section-number order, and structured content is rendered as Markdown lists or tables (not raw JSON)
**Priority:** P0
**Tags:** #export #markdown

---

### EC-VIEW-10: Markdown export requires ownership

**Given:** authenticated user A and a `briefId` belonging to user B
**When:** A makes `GET /api/brief/{B-briefId}/export/markdown`
**Then:** the response is 403 or 404, no Markdown body is returned, no info leak in headers
**Priority:** P0
**Tags:** #export #markdown #security #rls

---

### EC-VIEW-11: Edit route renders wizard with pre-populated content

**Given:** a complete brief
**When:** the user clicks Edit on the read view (or navigates directly to `/brief/{id}/edit`)
**Then:** the wizard mounts with `editMode = true`, all 6 steps are immediately navigable (no Step 1 processing gate), every `BriefSectionCard` shows the pre-existing structured content from the DB, and saves continue to write to the same brief id (no duplicate row created)
**Priority:** P0
**Tags:** #brief-view #edit #wizard

---

### EC-VIEW-12: Duplicate from brief view header

**Given:** a complete brief on `/brief/{id}`
**When:** the user clicks Duplicate in the header actions
**Then:** `duplicateBrief` runs (per `src/actions/brief.ts`), a new brief is created with copied sections, the user is redirected to either the new brief's read view or wizard, and the original brief is unchanged. Same security guarantees as [[dashboard-evals]] EC-DASH-11
**Priority:** P0
**Tags:** #brief-view #duplicate

---

### EC-VIEW-13: Section completeness indicators

**Given:** a brief where 6 of 9 sections have content and 3 are empty
**When:** the read view (or section nav) renders
**Then:** populated sections are visually distinguishable from empty ones (e.g., dim color, "empty" badge, or hidden — per implementation), the completion indicator on the page header (if present) reflects 6/9 or ~67%, and the wizard stepper visited via the edit link reflects the same state
**Priority:** P1
**Tags:** #brief-view #completeness

---

### EC-VIEW-14: Read view of soft-deleted brief returns 404

**Given:** a brief with `deleted_at` set
**When:** the owner navigates to `/brief/{id}` directly
**Then:** the page renders a 404 / not-found state — soft-deleted briefs are filtered out by `.is("deleted_at", null)` in the data fetcher, and there is no way to view or export a deleted brief without restoring it
**Priority:** P0
**Tags:** #brief-view #soft-delete #data-integrity

---

### EC-VIEW-15: Read view loads under 2s on warm CDN

**Given:** a populated brief at `/brief/{id}` with a warm Vercel build cache
**When:** the page is requested over a typical broadband connection
**Then:** Time-to-first-byte and largest-contentful-paint are within reasonable bounds for a server-rendered Next.js page (qualitative — flag if visibly slow or if React hydration causes layout shift)
**Priority:** P2
**Tags:** #brief-view #performance

---

### EC-VIEW-16: Section content respects Markdown / structured content rendering

**Given:** a section's `content` contains Markdown (headers, lists, bold) and `structured_content` contains a record of subsection key→value pairs
**When:** the section renders in the read view
**Then:** Markdown is rendered as formatted HTML (not raw `**bold**`), `<SubsectionPreviewTable />` renders `structured_content` as a two-column key/value table, and the two views (free-form content vs. structured) coexist without duplication
**Priority:** P1
**Tags:** #brief-view #rendering

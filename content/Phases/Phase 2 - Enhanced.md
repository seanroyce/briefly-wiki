---
title: Phase 2 — Enhanced
phase: 2
status: in-progress
completion: 10
tags:
  - phase
  - roadmap
---

# Phase 2 — Enhanced

> Post-MVP features that add depth and stickiness.

## Status: In Progress · 10%

## Tasks

### 2.1 Shareable Brief Links ⏳

- [ ] `shareBrief` server action — generates unique `share_token`, sets `is_shared = true`
- [ ] `GET /api/shared/:token` route — fetch brief + sections without auth (RLS policy for shared)
- [ ] `/brief/share/:token` read-only view page — clean layout, "Created with Briefly" footer
- [ ] Share/unshare toggle UI on brief view page
- [ ] `unshareBrief` action — clears `share_token`, sets `is_shared = false`

### 2.2 Brief Templates ⏳

- [ ] Define 3-5 built-in templates: "Product Launch", "Event Promotion", "Content Campaign", "Brand Awareness", "Seasonal/Promotional"
- [ ] Each template: pre-filled prompt suggestions, section hints, example snippets
- [ ] Template selection UI — card grid before wizard starts
- [ ] Templates merge with raw notes import

### 2.3 Brief Duplication ✅

- [x] "Duplicate" in BriefCard options menu and brief view header
- [x] `duplicateBrief` server action — copies brief + all sections (preserving `structured_content`, `prompt_answers`), appends "(Copy)", resets status to `draft`

### 2.4 Version History ⏳

- [ ] Snapshots on step completion, manual save, gap re-analysis
- [ ] Version list sidebar on brief edit page — timestamp + trigger description
- [ ] Version preview — read-only past snapshot
- [ ] "Restore this version" action

### 2.5 Dark Mode ⏳

- [ ] `dark:` variants on all components and pages
- [ ] System preference detection + manual toggle
- [ ] Store preference in localStorage

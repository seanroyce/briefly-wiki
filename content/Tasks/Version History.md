---
title: "Version History"
status: "3-backlog"
sprint: 3
phase: 2
section: "2.4"
priority: p2
size: l
category: data
tags:
  - task
---

# Version History

Snapshot brief content at key moments so users can roll back to a previous state.

## Tasks

- [ ] New `brief_snapshots` table — `id`, `brief_id`, `triggered_by` (step_complete | manual_save | gap_analysis), `snapshot_data` (JSONB), `created_at`
- [ ] Save snapshot on: each step completion, manual "Save as draft", gap re-analysis run
- [ ] Version list sidebar on brief edit page — timestamp + trigger label
- [ ] Read-only version preview — render snapshot as a brief view
- [ ] "Restore this version" action — write snapshot content back to `brief_sections`

## See Also

- [[Features/2.4 - Version History]]
- [[Database]]

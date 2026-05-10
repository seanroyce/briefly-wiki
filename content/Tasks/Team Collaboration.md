---
title: "Team Collaboration"
status: "3-backlog"
sprint: 0
phase: 3
section: "3.1"
priority: p3
size: xl
category: collaboration
tags:
  - task
---

# Team Collaboration

Enable multiple users to share, co-edit, and review a brief together.

## Tasks

- [ ] `teams` + `team_memberships` tables — id, name, owner_id; membership: team_id, user_id, role (owner/editor/viewer/commenter)
- [ ] Update RLS policies to allow team members to access shared briefs
- [ ] Email invite flow — generate invite token, send invite email, accept/decline page
- [ ] Role-based UI — editors can edit, viewers can read, commenters can annotate
- [ ] Real-time presence — Supabase Realtime subscription on `brief_sections` for live updates

## See Also

- [[Features/3.1 - Team Collaboration]]
- [[Extensibility]]

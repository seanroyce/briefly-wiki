---
title: "Supabase Restoration"
status: "1-active"
sprint: 1
phase: 0
section: "0.2"
priority: p0
size: s
category: infrastructure
tags:
  - task
---

# Supabase Restoration

Restore the Supabase connection after free-plan pause.

## Tasks

- [ ] Update `SUPABASE_SERVICE_ROLE_KEY` in `.env.local` (currently `placeholder`)
- [ ] Verify anon key in dashboard still matches `.env.local`
- [ ] Apply migration `002_structured_content.sql` via SQL Editor
- [ ] Confirm `briefs`, `brief_sections`, `gaps`, `uploaded_files` tables are intact
- [ ] Confirm auth providers (email + Google OAuth) are still enabled

## See Also

- [[Deploy]]
- [[Database]]

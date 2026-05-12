---
title: "Ingest - Storage Bucket and RLS"
status: "4-done"
sprint: 4
phase: 1
section: "1.6"
priority: p0
size: s
category: infrastructure
tags:
  - task
---

# Ingest - Storage Bucket and RLS

The `/api/files/upload` route references a Supabase Storage bucket named `brief-files` that has never been created. Every non-image upload returns `Bucket not found` from Supabase, causing 100% of PDF/DOCX/TXT imports to silently fail.

## Option A — Create the bucket (proper fix)

Add `supabase/migrations/004_storage.sql` and apply it via SQL Editor:

```sql
insert into storage.buckets (id, name, public)
values ('brief-files', 'brief-files', false)
on conflict do nothing;

-- Users can only touch their own folder (path: {user_id}/{brief_id}/{filename})
create policy "brief-files: owner insert"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'brief-files' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "brief-files: owner select"
  on storage.objects for select to authenticated
  using (bucket_id = 'brief-files' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "brief-files: owner update"
  on storage.objects for update to authenticated
  using (bucket_id = 'brief-files' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "brief-files: owner delete"
  on storage.objects for delete to authenticated
  using (bucket_id = 'brief-files' and (storage.foldername(name))[1] = auth.uid()::text);
```

- [ ] Write `supabase/migrations/004_storage.sql`
- [ ] Apply migration via Supabase SQL Editor (remote; same pattern as `003_users_profile.sql`)
- [ ] Verify bucket and 4 policies appear in Supabase dashboard → Storage → Policies
- [ ] Test upload of a `.txt` file in prod — confirm `200` from `/api/files/upload`
- [ ] Update `Wiki/Database.md` with a Storage subsection

## Option B — Short-circuit: skip storage entirely

Remove the `storage.upload()` call from the route. Extract text and insert the `uploaded_files` row as before, but do not persist the file bytes. Files are ephemeral — text extraction still works.

- [ ] In `src/app/api/files/upload/route.ts`, delete the `supabase.storage.from("brief-files").upload(...)` block and its error guard
- [ ] Set `storage_path` column to `null` on the `uploaded_files` insert (column already nullable)
- [ ] Remove dead `BUCKET` constant if present
- [ ] Confirm `uploaded_files` table schema allows null `storage_path` (check `001_briefs.sql`)

**Trade-off:** Files cannot be re-extracted or downloaded later. Acceptable until direct-to-storage upload migration is warranted.

## See Also

- [[Database]]
- [[Deploy]]
- `src/app/api/files/upload/route.ts`

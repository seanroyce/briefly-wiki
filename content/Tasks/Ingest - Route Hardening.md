---
title: "Ingest - Route Hardening"
status: "4-done"
sprint: 4
phase: 1
section: "1.6"
priority: p2
size: s
category: infrastructure
tags:
  - task
---

# Ingest - Route Hardening

Small defensive fixes to the upload route to prevent silent failures and clarify behaviour under Vercel's function constraints.

## Tasks

### Error logging
- [ ] Add `console.error` for upload errors and DB insert errors in `src/app/api/files/upload/route.ts` — include bucket name and storage path so Vercel logs are actionable

### Magic-byte guard
- [ ] Add `buffer.length >= 8` guard before the DOCX magic-byte check (`PK\x03\x04`) — streaming or empty files can underflow the slice and produce misleading rejection messages

### Runtime config
- [ ] Add `export const runtime = "nodejs"` and `export const maxDuration = 30` to the route handler — prevents accidental Edge runtime selection and sets an explicit timeout

### File size cap decision
Pick one:
- [ ] **Option A — Lower cap:** Reduce `MAX_FILE_SIZE` in `file-upload-zone.tsx` from 10 MB to 4.5 MB to stay safely under Vercel's function body limit. Update the client-side validation message.
- [ ] **Option B — Keep 10 MB:** Accept the risk and document that files >~8 MB may 413 on Vercel until a direct-to-storage migration is implemented.

## See Also

- `src/app/api/files/upload/route.ts`
- `src/components/file-upload-zone.tsx`
- [[Deploy]]

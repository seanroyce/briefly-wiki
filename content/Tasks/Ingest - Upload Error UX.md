---
title: "Ingest - Upload Error UX"
status: "4-done"
sprint: 4
phase: 1
section: "1.6"
priority: p1
size: xs
category: ui
tags:
  - task
---

# Ingest - Upload Error UX

When a file upload fails, `file-upload-zone.tsx` sets per-file `status: "error"` but fires no toast. Users see the "Process notes" button stay disabled with no explanation — the error is only visible in a small badge on the file row. This compounds the ingest bug by hiding it from users.

## Tasks

- [ ] In `src/components/file-upload-zone.tsx`, call `toast.error(errorMessage)` (Sonner) when a file transitions to `status: "error"`
- [ ] Ensure the error message from the API (`{ error: string }`) is passed through to the toast — don't swallow it
- [ ] Verify the "Process notes" button disabled state includes a tooltip or sub-label explaining *why* it's disabled when files are in error state (optional: only if straightforward)

## See Also

- `src/components/file-upload-zone.tsx`
- `src/app/brief/new/wizard-client.tsx` (lines 594–606 — button gate logic)

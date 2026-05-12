---
title: "Ingest - Upload Error UX"
status: "4-done"
sprint: 7
phase: 1
section: "1.6"
priority: p1
size: xs
category: ui
tags:
  - task
---

# Ingest - Upload Error UX

## Completed

- [x] `toast.error(message)` fires in `file-upload-zone.tsx` when a file transitions to `status: "error"` — Sonner toast shows the API error message
- [x] OCR errors rethrown from `src/lib/files/ocr.ts` with `"Image OCR failed: {detail}"` prefix for clarity
- [x] Image "No text found" label improved: "No text found — try a clearer image" for blank/low-quality images

## Root cause found (Sprint 7)

The underlying silent failure for PNG/JPEG was a CSP violation, not a missing toast. Tesseract.js v7 creates web workers from blob URLs — the `next.config.ts` CSP had no `worker-src` directive, so the browser fell back to `script-src 'self'` and blocked the worker. The worker also calls `importScripts` from `cdn.jsdelivr.net`, which requires `https://cdn.jsdelivr.net` in both `script-src` and `connect-src`.

Fix committed: added `worker-src blob:` and `https://cdn.jsdelivr.net` to both `script-src` and `connect-src`.

## See Also

- `src/components/file-upload-zone.tsx`
- `src/lib/files/ocr.ts`
- `next.config.ts` (CSP headers)

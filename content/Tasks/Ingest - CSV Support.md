---
title: "Ingest - CSV Support"
status: "4-done"
sprint: 5
phase: 1
section: "1.6"
priority: p1
size: xs
category: infrastructure
tags:
  - task
---

# Ingest - CSV Support

Added CSV file upload support to the wizard ingest pipeline.

## Completed

- [x] Add `text/csv` to `ALLOWED_TYPES` in upload route
- [x] Implement CSV extractor in `extract.ts` — reads as UTF-8 (same as plain text; no extra library needed)
- [x] Add `.csv` to `accept` attribute and label in `file-upload-zone.tsx`
- [x] Unit tests: 4 cases covering content preservation, whitespace trimming, empty file, comma/newline fidelity

## Notes

- CSV is treated as structured text and passed through directly (no parsing into rows/fields). The AI model receives raw CSV which it can interpret in context.
- No magic bytes defined for `text/csv` — validation passes through, relying on MIME type from the browser.

## See Also

- `src/lib/files/extract.ts`
- `src/app/api/files/upload/route.ts`
- `src/components/file-upload-zone.tsx`
- [[Ingest - XLSX Support]]

---
title: "Ingest - XLSX Support"
status: "4-done"
sprint: 5
phase: 1
section: "1.6"
priority: p1
size: s
category: infrastructure
tags:
  - task
---

# Ingest - XLSX Support

Added XLSX (Excel) file upload support to the wizard ingest pipeline.

## Completed

- [x] Install `xlsx` (SheetJS) package
- [x] Add `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` to `ALLOWED_TYPES` in upload route
- [x] Add PK zip magic bytes signature for XLSX to `validate.ts`
- [x] Implement XLSX extractor in `extract.ts` — reads all sheets, joins with `\n\n` separator
- [x] Add `xlsx` to `serverExternalPackages` in `next.config.ts`
- [x] Add `.xlsx` to `accept` attribute and label in `file-upload-zone.tsx`
- [x] Unit tests: 5 cases covering single-sheet, multi-sheet, empty workbook, buffer pass-through, corrupt file error

## Notes

- `xlsx` (SheetJS community edition) has a known high-severity prototype pollution CVE (CVE-2023-30533). Mitigated by: auth-only access, 4.5MB size cap, magic byte validation. Track in Security Hardening task.
- DOCX and XLSX share the same PK zip magic bytes — disambiguation is by MIME type (declared by the browser on upload).

## See Also

- `src/lib/files/extract.ts`
- `src/lib/files/validate.ts`
- `src/app/api/files/upload/route.ts`
- `src/components/file-upload-zone.tsx`
- [[Ingest - CSV Support]]

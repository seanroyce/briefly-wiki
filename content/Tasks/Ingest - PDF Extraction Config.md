---
title: "Ingest - PDF Extraction Config"
status: "4-done"
sprint: 5
phase: 1
section: "1.6"
priority: p0
size: s
category: infrastructure
tags:
  - task
---

# Ingest - PDF Extraction Config

Two-part fix required to make PDF extraction work on Vercel. Both issues were diagnosed via the `/api/debug/pdf` no-auth diagnostic route.

## Root Causes Found

**Issue 1 — pdf-parse v2 crashes at import on Vercel Lambda:**
pdf-parse v2 bundles pdfjs-dist 5.x which calls `DOMMatrix` (a browser Web API) at module load time. Vercel's Lambda runtime has no DOM, and `@napi-rs/canvas` (which would polyfill it) cannot install its Linux native binary on Lambda. Every import throws `ReferenceError: DOMMatrix is not defined`.

**Issue 2 — pdfjs v1.10.100 rejects Node.js `Buffer`:**
Even after downgrading to pdf-parse v1 (pdfjs v1.10.100), passing a raw `Buffer` throws `"bad XRef entry"` on any valid PDF. pdfjs v1.10.100 requires a `Uint8Array`. Node.js `Buffer` is a subclass of `Uint8Array` but its internal type markers differ, breaking the pdfjs stream reader.

## Completed

- [x] Pin `pdf-parse` to `v1.1.4` in `package.json` — eliminates the DOMMatrix crash
- [x] Add `serverExternalPackages: ["pdf-parse", "mammoth", "xlsx"]` to `next.config.ts`
- [x] Wrap buffer in `new Uint8Array(buffer)` before calling `pdfParse()` in `extract.ts`
- [x] Add `/api/debug/pdf` route (no auth) to verify import + parse end-to-end on Vercel
- [x] Confirm fix on Vercel: diagnostic route returns `ok: true`, `text: "Hello World"`

## Key Rule

```typescript
// ✅ Correct — pdfjs v1.10.100 requires Uint8Array
const data = await pdfParse(new Uint8Array(buffer));

// ❌ Wrong — Buffer causes "bad XRef entry" on any valid PDF
const data = await pdfParse(buffer);
```

**Do not upgrade pdf-parse past v1.x.** The v2 DOMMatrix issue cannot be fixed by polyfilling in the Lambda environment.

## See Also

- `next.config.ts`
- `src/lib/files/extract.ts`
- `src/app/api/debug/pdf/route.ts`
- [[Conventions]] — File Ingest section

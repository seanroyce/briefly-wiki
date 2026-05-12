---
title: "Ingest - PNG OCR CSP Fix"
status: "4-done"
sprint: 7
phase: 1
section: "1.6"
priority: p0
size: xs
category: infrastructure
tags:
  - task
---

# Ingest - PNG OCR CSP Fix

## Root Cause

Tesseract.js v7 (client-side OCR for PNG/JPEG) creates web workers from `blob:` URLs. The `next.config.ts` CSP had no `worker-src` directive, so the browser fell back to `script-src 'self'` and blocked the worker with:

> Creating a worker from 'blob:...' violates Content Security Policy directive "script-src". Note that 'worker-src' was not explicitly set, so 'script-src' is used as a fallback.

Once the worker was allowed (`worker-src blob:`), a second error surfaced: the worker calls `importScripts('https://cdn.jsdelivr.net/npm/tesseract.js@v7.0.0/dist/worker.min.js')`, which also falls under `script-src` and was blocked.

## Completed

- [x] Add `worker-src blob:` to `next.config.ts` CSP — allows Tesseract.js to create workers from blob URLs
- [x] Add `https://cdn.jsdelivr.net` to `script-src` — allows worker's `importScripts` call for Tesseract worker bundle
- [x] Add `https://cdn.jsdelivr.net` to `connect-src` — allows worker to fetch WASM core and `eng.traineddata` from jsDelivr

## Verified

- Playwright smoke test: `tests/e2e/file-upload.spec.ts` — PNG test passes (no CSP errors, file reaches complete state)
- PDF and XLSX smoke tests also added and passing
- 122/122 unit tests passing

## See Also

- `next.config.ts` (CSP headers)
- `src/lib/files/ocr.ts`
- `tests/e2e/file-upload.spec.ts`
- [[Ingest - Upload Error UX]]

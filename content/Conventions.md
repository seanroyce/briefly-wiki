---
title: Conventions & Patterns
tags:
  - conventions
  - patterns
  - reference
---

# Conventions & Patterns

## Zod v4

Project uses **Zod 4.3.6**. The API changed from v3:

```typescript
// ✅ Correct — z.record() requires 2 args in Zod v4
z.record(z.string(), z.unknown())

// ❌ Wrong — Zod v3 syntax, fails in v4
z.record(z.unknown())
```

All schemas in `src/types/brief.ts` and `src/types/auth.ts`.

## Notifications (Toast)

```typescript
// ✅ Always import from sonner
import { toast } from "sonner";
toast.success("Brief saved");
toast.error("Something went wrong");

// ❌ Never use shadcn's toast
```

## Server Action Pattern

```typescript
"use server";

export async function myAction(formData: FormData) {
  const { user, error } = await getUser();
  if (error || !user) return { error: "Unauthorized" };

  const parsed = mySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.message };

  const supabase = await createClient();
  const { error: dbError } = await supabase.from("table").insert({ ... });
  if (dbError) return { error: dbError.message };

  revalidatePath("/dashboard");
}
```

Pattern: accept `FormData` → validate with Zod → call Supabase → `revalidatePath()` → return `{ error }` on failure.

## Next.js 16 `searchParams`

Page props are Promises in Next.js 16 — must be awaited:

```typescript
// ✅ Correct
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ step?: string; briefId?: string }>;
}) {
  const { step, briefId } = await searchParams;
}
```

## Supabase Client Selection

| Context | Import |
|---------|--------|
| Server component, server action | `import { createClient } from "@/lib/supabase/server"` |
| Client component | `import { createClient } from "@/lib/supabase/client"` |
| Get current user in server context | `import { getUser } from "@/lib/supabase/auth"` |

## Soft Deletes

Briefs use soft delete — never hard-delete:

```typescript
// Delete: set deleted_at
.update({ deleted_at: new Date().toISOString() })

// Always filter out deleted rows
.is("deleted_at", null)
```

## `cn()` Utility

```typescript
import { cn } from "@/lib/utils";

// ✅ No duplicate keys
cn("base", { "text-green-600": isSuccess, "text-red-600": isError })

// ❌ Duplicate keys — TypeScript strict catches this
cn("base", { "font-bold": a, "font-bold": b })
```

## Fonts

- **Primary:** Inter (body, UI) — configured via `next/font/google` in `src/app/layout.tsx`
- **Code:** JetBrains Mono
- **Not Geist** — the project uses Inter, not Next.js's default Geist

## Colors

OKLCH color system defined in `src/app/globals.css`.

| Semantic | Color |
|----------|-------|
| Primary | Indigo-600 |
| Secondary | Emerald-500 |
| Neutrals | Slate |
| AI confidence high | Emerald |
| AI confidence medium | Amber |
| AI confidence low | Slate |
| Gap severity critical | Red |
| Gap severity recommended | Amber |
| Gap severity nice-to-have | Slate |

## Adding shadcn Components

```bash
# From briefly/
npx shadcn@latest add <component-name>
```

## File Ingest (`src/lib/files/`)

### Supported formats

| Format | MIME | Extractor |
|--------|------|-----------|
| PDF | `application/pdf` | pdf-parse v1 + pdfjs v1.10.100 |
| DOCX | `application/vnd.openxmlformats-officedocument.wordprocessingml.document` | mammoth |
| XLSX | `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` | SheetJS (xlsx) |
| CSV | `text/csv` | raw UTF-8 |
| TXT | `text/plain` | raw UTF-8 |
| PNG/JPEG | `image/png`, `image/jpeg` | client-side OCR (`ocr.ts`) |

### pdf-parse: always use `new Uint8Array(buffer)`

pdfjs v1.10.100 (bundled in pdf-parse v1) requires a `Uint8Array`, not a Node.js `Buffer`. Passing a raw `Buffer` throws `"bad XRef entry"` on any valid PDF:

```typescript
// ✅ Correct
const data = await pdfParse(new Uint8Array(buffer));

// ❌ Crashes with "bad XRef entry" even on a perfectly valid PDF
const data = await pdfParse(buffer);
```

**Do not upgrade pdf-parse to v2.x** — v2 bundles pdfjs-dist 5.x which references `DOMMatrix` (browser-only) at import time, crashing Vercel Lambda with `ReferenceError: DOMMatrix is not defined`.

### `serverExternalPackages` (required)

`next.config.ts` must list all three packages or Next.js bundles them and they break:

```typescript
serverExternalPackages: ["pdf-parse", "mammoth", "xlsx"]
```

### PNG/JPEG OCR — Tesseract.js CSP requirements

PNG and JPEG files use client-side OCR via **Tesseract.js v7** (`src/lib/files/ocr.ts`). Tesseract creates web workers from `blob:` URLs and calls `importScripts` from `cdn.jsdelivr.net`. Both require explicit CSP directives — omitting them causes silent "Processing failed" errors with no visible source.

Three directives must be present in `next.config.ts`:

```
worker-src blob:
script-src  ... https://cdn.jsdelivr.net
connect-src ... https://cdn.jsdelivr.net
```

- `worker-src blob:` — allows the Tesseract worker to be created from a blob URL
- `script-src https://cdn.jsdelivr.net` — allows the worker's `importScripts` call for `tesseract.js@v7.0.0/dist/worker.min.js`
- `connect-src https://cdn.jsdelivr.net` — allows the worker to fetch WASM core and `eng.traineddata`

### Magic bytes validation

`src/lib/files/validate.ts` centralises all format detection. Validate before extraction — MIME type alone is not trustworthy. DOCX and XLSX share the same PK zip signature (`50 4B 03 04`); disambiguation is by MIME type.

### XLSX CVE note

SheetJS (`xlsx`) has a known prototype pollution CVE (CVE-2023-30533). Mitigated by auth-only access and the 4.5 MB upload cap. Track under Security Hardening task.

## See Also

- [[Components]] — component list and shadcn usage
- [[Architecture]] — server action data flow

---
title: Architecture
tags:
  - architecture
  - reference
---

# Architecture

## App Router Structure

Pages follow a **server component → client component** split:
- `page.tsx` — server component, fetches data, checks auth
- `*-client.tsx` — client component, handles interactivity

| Route | File | Purpose |
|-------|------|---------|
| `/` | `app/page.tsx` | Public landing page |
| `/login` | `app/login/page.tsx` | Email + Google OAuth login |
| `/signup` | `app/signup/page.tsx` | Account creation |
| `/forgot-password` | `app/forgot-password/page.tsx` | Password reset request |
| `/reset-password` | `app/reset-password/page.tsx` | Set new password |
| `/dashboard` | `app/dashboard/page.tsx` | Brief list (protected) |
| `/brief/new` | `app/brief/new/page.tsx` | 6-step wizard (protected) |
| `/brief/[id]` | `app/brief/[id]/page.tsx` | Brief detail/read view (protected) |
| `/brief/[id]/edit` | `app/brief/[id]/edit/page.tsx` | Wizard pre-populated for editing (protected) |
| `/settings` | `app/settings/page.tsx` | Account settings (protected) |

## Data Flow

```
UI (Client Component)
  → Server Action (src/actions/) — validates with Zod, calls Supabase, revalidates cache
  → Supabase (RLS enforces row-level ownership)

Server Component (page.tsx)
  → Data Fetcher (src/lib/data/) — reads from Supabase
  → Props to Client Component
```

## Key Directories

| Directory | Purpose |
|-----------|---------|
| `src/app/` | App Router pages and layouts |
| `src/actions/` | Server actions (`"use server"`) |
| `src/components/` | Custom UI components |
| `src/components/ui/` | shadcn/ui primitives (new-york style) |
| `src/lib/ai/` | Anthropic SDK client, system prompts |
| `src/lib/data/` | Read-only data fetchers for server components |
| `src/lib/export/` | PDF and Markdown export utilities |
| `src/lib/files/` | File extraction: `extract.ts` (pdf-parse, mammoth, SheetJS, UTF-8), `validate.ts` (magic bytes), `ocr.ts` (client-side image OCR) |
| `src/lib/supabase/` | Supabase client factories |
| `src/types/` | Zod schemas + inferred TypeScript types |
| `supabase/migrations/` | SQL migration files |

## Server Actions Reference

| File | Actions |
|------|---------|
| `src/actions/auth.ts` | `login`, `signup`, `logout`, `forgotPassword`, `resetPassword` |
| `src/actions/brief.ts` | `createBrief`, `updateBrief`, `deleteBrief`, `saveBrief`, `duplicateBrief` |
| `src/actions/brief-section.ts` | `updateBriefSection`, `bulkUpdateBriefSections` |
| `src/actions/gap.ts` | `analyzeGaps`, `dismissGap` |
| `src/actions/process-context.ts` | `processContext` (Claude API call per section) |
| `src/actions/process-all-notes.ts` | `processAllNotes` (batch process all sections) |
| `src/actions/settings.ts` | `updateProfile`, `updatePassword`, `deleteAccount` |

## API Routes

| Route | Purpose |
|-------|---------|
| `GET /api/brief/[id]/export/pdf` | Stream PDF of brief |
| `GET /api/brief/[id]/export/markdown` | Download .md file |
| `POST /api/files/upload` | Accept file, validate magic bytes, extract text, record in `uploaded_files` |
| `POST /api/ai/refine` | Refine a section's structured content using Claude |
| `GET /api/debug/pdf` | No-auth diagnostic: verifies pdf-parse import + parse work on Vercel |
| `GET /auth/callback` | OAuth + email verification callback |

## See Also

- [[Database]] — table schemas and RLS
- [[Auth]] — middleware and session handling
- [[AI Pipeline]] — Claude API integration details
- [[Extensibility]] — future libraries, Railway migration, and architectural upgrade paths

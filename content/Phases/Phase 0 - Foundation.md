---
title: Phase 0 — Foundation
phase: 0
status: in-progress
completion: 90
tags:
  - phase
  - roadmap
---

# Phase 0 — Foundation

> Set up the repo, tooling, and infrastructure so all subsequent work lands on solid ground.

## Status: In Progress · 90%

## Tasks

### 0.1 Repository & Framework Init ✅

- [x] Next.js 16 with App Router, TypeScript, TailwindCSS, ESLint
- [x] Strict `tsconfig.json` with `@/` path aliases
- [x] shadcn/ui initialized (new-york style)
- [x] Directory structure: `src/app`, `components`, `lib`, `types`, `actions`
- [x] Git repo + initial commit

### 0.2 Supabase Setup ✅

- [x] Supabase project created
- [x] `@supabase/supabase-js` + `@supabase/ssr` installed
- [x] Client utilities: `lib/supabase/client.ts`, `lib/supabase/server.ts`
- [x] `.env.local` configured, `.env.example` created

### 0.3 Dev Tooling ✅

- [x] ESLint with Next.js recommended rules
- [x] Prettier with Tailwind plugin (class sorting)
- [x] Inter font via `next/font/google` in `layout.tsx`
- [x] Dev server runs cleanly on localhost:3000

### 0.4 Deployment Pipeline ⏳

- [ ] Connect GitHub repo to Vercel (auto-deploy `main`, preview on PRs)
- [ ] Set environment variables in Vercel dashboard
- [ ] Verify preview deployment with a basic landing page

## See Also

- [[Deploy]] — Vercel setup instructions and env vars

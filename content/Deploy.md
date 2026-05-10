---
title: Deployment & Environment
tags:
  - deploy
  - environment
  - reference
---

# Deployment & Environment

## Environment Variables

| Variable | Scope | Notes |
|----------|-------|-------|
| `NEXT_PUBLIC_SITE_URL` | Public | `http://localhost:3000` in dev; production URL in prod |
| `NEXT_PUBLIC_SUPABASE_URL` | Public | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | Supabase anon key (safe for browser) |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only | Never expose to client |
| `ANTHROPIC_API_KEY` | Server only | Claude API key — never expose |

Set in `briefly/.env.local` for development. Template: `briefly/.env.example`.

## Local Dev Commands

```bash
# From briefly/
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build check
npm run lint         # ESLint
```

## Supabase CLI

```bash
# Apply pending migrations to remote instance
supabase db push

# Or paste migration SQL directly into Supabase SQL Editor
```

> [!warning] Pending Migration
> `supabase/migrations/002_structured_content.sql` has not been applied to the remote Supabase instance. Apply after the project finishes restoring from pause.

## Vercel Deployment

> [!todo] Not Yet Configured
> GitHub repo is not yet connected to Vercel. Phase 0.4 task.

**Steps to connect:**
1. Go to [vercel.com](https://vercel.com) → Import project from GitHub
2. Set all 5 environment variables in Vercel project settings
3. Set `NEXT_PUBLIC_SITE_URL` to the Vercel production URL (e.g. `https://briefly.vercel.app`)
4. Auto-deploy: `main` branch → production; PRs → preview URLs

## Supabase Auth URL Config

In **Supabase → Authentication → URL Configuration**, set:

| Setting | Local | Production |
|---------|-------|-----------|
| Site URL | `http://localhost:3000` | `https://your-app.vercel.app` |
| Redirect URLs | `http://localhost:3000/auth/callback` | `https://your-app.vercel.app/auth/callback` |

## Testing

```bash
# From briefly/
npx vitest                    # Run unit tests
npx playwright test           # Run E2E tests (requires dev server running)
```

Test files in `briefly/tests/`:
- `tests/unit/` — Zod schemas, AI prompts, gap actions, components
- `tests/e2e/` — gap analysis flow (Playwright)

## Key Version Constraints

| Package | Version | Note |
|---------|---------|------|
| Next.js | 16 | App Router, `searchParams` is a Promise |
| Zod | 4.3.6 | `z.record()` requires 2 args |
| TailwindCSS | 4 | New config format |

## Future: Railway

Railway is the preferred long-term hosting platform — see [[Extensibility#Railway *(future)*]] for migration rationale and steps. Not an immediate priority while Vercel + serverless handles current load.

## See Also

- [[Auth]] — Supabase Auth redirect URL details
- [[Database]] — migration files and how to apply them
- [[Extensibility]] — future infrastructure and library upgrades

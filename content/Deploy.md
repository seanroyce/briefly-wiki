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
> `supabase/migrations/003_users_profile.sql` has not been applied to the remote Supabase instance. Paste into the Supabase SQL Editor to create the `users` table, RLS policies, and auto-populate trigger.

## Vercel Deployment

| Setting | Value |
|---------|-------|
| Production URL | https://project-yqnrm.vercel.app |
| Stable alias | https://briefly-seanrgibbons-2790s-projects.vercel.app |
| GitHub repo | https://github.com/seanroyce/briefly |
| Vercel project | `seanrgibbons-2790s-projects/briefly` |
| Vercel project ID | `prj_8Z72x6gbboo3vCLEgvpEVujJq3RR` |
| Vercel team ID | `team_8u3tQdrSu7UiujUlsY6vKp2V` |

All 5 env vars are configured in Vercel project settings. Framework is set to `nextjs`.

### Deploy command

**Always run from `briefly/`** — running from the repo root will create a new accidental project:

```bash
cd /Users/seangibbons/Code/swords-to-plowshares/briefly
npx vercel --prod        # production deploy
npx vercel               # preview deploy
npx vercel --prod --force  # skip build cache
```

### Vercel CLI auth token

Stored at `~/Library/Application Support/com.vercel.cli/auth.json`. Needed for direct API calls.

### Known gotchas

- **Run from `briefly/` only.** The `.vercel/project.json` lives there. Running from the repo root creates a new `swords-to-plowshares` project by mistake.
- **Framework must be `nextjs`.** If it shows `null` in project settings, deployments build successfully but Next.js routing breaks (404 on all routes). Fix via API: `PATCH /v9/projects/{id}` with `{"framework":"nextjs"}`.
- **Commit author email must match Vercel account.** Vercel blocks deploys from commits with unverified author emails. Git is configured with `sean.r.gibbons@gmail.com`.
- **Bot filter** (`managedRules.bot_filter`) is active — challenges non-browser clients with a 429. Normal browser traffic passes automatically.
- **Deployment Protection** (`ssoProtection`) is disabled — production is publicly accessible.
- **pdf-parse must stay at v1.x.** v2 bundles pdfjs-dist 5.x which calls `DOMMatrix` at import time — crashes Vercel Lambda on every cold start. v1 uses pdfjs-dist 1.10.100 (no DOM). And in `extract.ts`, always wrap: `pdfParse(new Uint8Array(buffer))` — pdfjs v1.10.100 throws "bad XRef entry" when given a plain Node.js `Buffer`. See [[Conventions#File Ingest]] and [[Tasks/Ingest - PDF Extraction Config]].
- **Tesseract.js CSP.** Client-side OCR for PNG/JPEG requires `worker-src blob:`, `https://cdn.jsdelivr.net` in both `script-src` and `connect-src`. Omitting any of these silently fails all image uploads. See [[Conventions#PNG/JPEG OCR — Tesseract.js CSP requirements]] and [[Tasks/Ingest - PNG OCR CSP Fix]].

## Supabase Auth URL Config

In **Supabase → Authentication → URL Configuration**, set:

| Setting | Local | Production |
|---------|-------|-----------|
| Site URL | `http://localhost:3000` | `https://project-yqnrm.vercel.app` |
| Redirect URLs | `http://localhost:3000/auth/callback` | `https://project-yqnrm.vercel.app/auth/callback` |

Both are configured. If you add a custom domain, add its `/auth/callback` here too.

## Testing

```bash
# From briefly/
npx vitest                    # Run unit tests
npx playwright test           # Run E2E tests (requires dev server running)
```

Test files in `briefly/tests/`:
- `tests/unit/` — Zod schemas, AI prompts, gap actions, components
- `tests/e2e/` — gap analysis flow, file upload smoke tests (PDF/XLSX/PNG) — Playwright

## Key Version Constraints

| Package | Version | Note |
|---------|---------|------|
| Next.js | 16 | App Router, `searchParams` is a Promise |
| Zod | 4.3.6 | `z.record()` requires 2 args |
| TailwindCSS | 4 | New config format |

## Future: Railway

Railway is the preferred long-term hosting platform — see [[Extensibility#Railway *(future)*]] for migration rationale and steps. Not an immediate priority while Vercel + serverless handles current load.

## Wiki Publishing (Quartz)

The wiki is published as a static site using **Quartz v4.5.2**, deployed to GitHub Pages.

| Setting | Value |
|---------|-------|
| Live URL | https://seanroyce.github.io/briefly-wiki/ |
| GitHub repo | https://github.com/seanroyce/briefly-wiki |
| Branch | `v4` (auto-deploys via `.github/workflows/deploy.yml`) |
| Quartz location | `swords-to-plowshares/quartz/` |
| Content location | `quartz/content/` (synced from `Wiki/`) |
| Config files | `quartz/quartz.config.ts`, `quartz/quartz.layout.ts` |
| `baseUrl` | `seanroyce.github.io/briefly-wiki` |

### How it works

`Wiki/` is the source of truth (Obsidian vault). `quartz/content/` is a mirror of it — never edit `quartz/content/` directly. The `sync-wiki.sh` script uses `rsync` to copy `Wiki/ → quartz/content/`, then builds the static site into `quartz/public/`. Pushing the `quartz/` repo's `v4` branch triggers GitHub Actions which redeploys to Pages.

The `quartz/` directory is a **separate git repo** (`seanroyce/briefly-wiki`) nested inside `swords-to-plowshares/`. It has its own `origin` remote and commit history, independent of the main app repo.

### Full publish workflow

Run all of the following from `swords-to-plowshares/` root:

```bash
# 1. Sync Wiki/ → quartz/content/ and build
./sync-wiki.sh

# 2. Commit and push the updated content
cd quartz
git add content/
git commit -m "Update wiki content"
git push
```

GitHub Actions picks up the push and redeploys to Pages in ~1–2 minutes. Check the live URL to confirm.

### Preview locally before pushing

```bash
# From swords-to-plowshares/ root
./sync-wiki.sh --serve   # syncs + builds + serves at http://localhost:8080
```

### Checking deploy status

Go to https://github.com/seanroyce/briefly-wiki/actions — the latest `Deploy Quartz site to GitHub Pages` workflow run shows build and deploy progress.

### Theme

Custom theme defined in `quartz.config.ts`:

| Token | Dark | Light |
|-------|------|-------|
| Background | Ink Black `#161618` | `#faf8f8` |
| Text/headers | Porcelain `#fdfffc` | (Quartz default) |
| Links | Amber `#ff9f1c` | Steel Blue `#0582ca` |
| Hover | Fresh Sky `#00a6fb` | Fresh Sky `#00a6fb` |

Layout (`quartz.layout.ts`): left sidebar = `PageTitle` + `Search` + `Darkmode` + `Explorer`; right sidebar = `TableOfContents`. **Disabled:** graph view, backlinks, reader mode.

### Common issues

| Problem | Fix |
|---------|-----|
| Local preview shows stale content | Re-run `./sync-wiki.sh --serve` — the sync step may have been skipped |
| Push rejected | `cd quartz && git pull --rebase origin v4` then push again |
| Pages not updating after push | Check Actions tab at https://github.com/seanroyce/briefly-wiki/actions for build errors |
| Wikilinks broken in Quartz | Quartz resolves `[[PageName]]` by filename — make sure the target `.md` file exists in `Wiki/` |

## See Also

- [[Auth]] — Supabase Auth redirect URL details
- [[Database]] — migration files and how to apply them
- [[Extensibility]] — future infrastructure and library upgrades

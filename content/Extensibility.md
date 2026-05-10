---
title: Extensibility & Architecture Improvements
tags:
  - architecture
  - extensibility
  - future
---

# Extensibility & Architecture Improvements

> [!abstract] Purpose
> This document tracks architectural upgrades worth considering as Briefly scales — organized by system area. Each entry notes the trigger condition (when it becomes worth doing) and the tradeoff vs. the current approach.

---

## Infrastructure & Hosting

### Railway *(future)*

**What it is:** Container-based PaaS that runs any Dockerized workload — Next.js, background workers, cron jobs, WebSocket servers — on persistent infrastructure instead of serverless functions.

**Why it matters for Briefly:**
- Vercel serverless functions time out at 60s (Hobby) / 300s (Pro). Long-running AI calls — batch note processing across all 9 sections — approach this ceiling.
- Railway containers stay alive, making background job queues, WebSocket connections, and streaming AI responses straightforward.
- Predictable pricing at scale: container hours vs. per-invocation.

**Migration path:**
1. Dockerize the Next.js app (`Dockerfile` + `railway.toml`)
2. Move background AI processing to a dedicated worker service in the same Railway project
3. Keep Supabase (Postgres + Auth + Storage) — Railway is the compute layer only
4. Point DNS to Railway; decommission Vercel

**Trigger:** When AI processing times out in production or when background job support is needed (e.g. scheduled gap re-analysis, email digests).

---

## AI Pipeline

### Vercel AI SDK

**What it is:** `ai` package from Vercel — streaming text generation, tool use, and structured output with built-in React hooks (`useChat`, `useCompletion`).

**Why it matters:** Currently, `processContext` and `processAllNotes` are blocking server actions — the UI shows a spinner while waiting for the full Claude response. The AI SDK enables streaming, so users see content populate in real time.

**Trigger:** When perceived latency becomes a UX problem. The SDK integrates cleanly with the existing Anthropic client — `streamText()` replaces `messages.create()`.

---

### Inngest or Trigger.dev *(background job queue)*

**What it is:** Event-driven background job runners that handle retries, concurrency limits, and fan-out — purpose-built for AI workloads.

**Why it matters:** `processAllNotes` fans out to 9 Claude calls in parallel. Today this is fine; under load or with rate limits, a proper queue with backoff and retry is safer. Both Inngest and Trigger.dev integrate with Next.js without needing a separate worker process.

**Trigger:** When rate-limit errors appear in production logs or when multi-user concurrency causes Claude API throttling.

---

### LangChain / LangGraph *(agent orchestration)*

**What it is:** Frameworks for chaining LLM calls, managing memory, and building multi-step agents.

**When relevant:** If Briefly evolves toward agentic brief generation — e.g., Claude autonomously researching competitors, fetching CRM data, or iterating on drafts — LangGraph's stateful graph model handles that better than hand-rolled chains.

**Not needed now:** Current prompts are single-shot and well-served by the raw Anthropic SDK.

---

## Database & Persistence

### Drizzle ORM

**What it is:** Lightweight, TypeScript-first ORM with SQL-like query building and schema-as-code migrations.

**Why it matters:** The current pattern (`supabase.from('briefs').select(...)`) is untyped at the query level — type safety comes from manually cast return types. Drizzle generates types from the schema directly, catches mistakes at compile time, and makes migrations version-controlled in TypeScript rather than raw SQL.

**Migration path:** Define the schema in `drizzle/schema.ts`, generate types, swap Supabase data fetchers to use Drizzle's query builder. The Supabase Postgres connection string works with Drizzle — Auth and Storage stay as-is.

**Trigger:** When the schema grows complex enough that untyped queries become a maintenance burden, or when the team expands.

---

### Upstash Redis *(rate limiting + caching)*

**What it is:** Serverless Redis — per-request rate limiting, response caching, and ephemeral key-value storage compatible with Vercel and Railway.

**Why it matters for Briefly:**
- **Rate limiting:** `processContext` and `analyzeGaps` call the Claude API. In-memory rate limiting (current plan) resets on every cold start — Upstash makes limits durable across instances.
- **Response caching:** Cache gap analysis results for a brief that hasn't changed, avoiding redundant Claude calls.

**Package:** `@upstash/ratelimit` + `@upstash/redis`

---

## Real-Time & Collaboration

### Supabase Realtime *(already available)*

Supabase ships Realtime out of the box — Postgres changes broadcast to subscribed clients over WebSocket. No additional dependency needed.

**When to use:** Phase 3 team collaboration (co-editing a brief, live gap count badge update). Activate by subscribing to `brief_sections` channel changes in the wizard client.

---

### Liveblocks or PartyKit *(multiplayer)*

For richer collaborative editing — presence cursors, conflict resolution, operational transforms — purpose-built multiplayer platforms are a better fit than Supabase Realtime alone.

**Trigger:** If Phase 3 team features require simultaneous text editing (vs. section-level locking).

---

## Auth

### Clerk *(if Supabase Auth becomes limiting)*

Supabase Auth covers email/password + OAuth and is already integrated. Clerk would only become relevant if:
- User management UI (admin panel, org switching) is needed
- B2B SSO (SAML, SCIM) is required
- MFA and advanced session management become a sales requirement

**Not a near-term concern.** Supabase Auth handles everything in Phase 1–2.

---

## File Handling

### UploadThing

**What it is:** Typed file upload infrastructure for Next.js — handles chunked uploads, resumable uploads, and direct-to-storage routing with a clean server/client API.

**Why relevant:** The current `POST /api/files/upload` route streams files through the Next.js server to Supabase Storage. For large files (10MB PDFs), this adds latency and eats serverless memory. UploadThing routes uploads directly to storage from the browser.

**Trigger:** If file upload timeouts or memory errors appear, or if file size limits need to increase beyond 10MB.

---

## Monitoring & Observability

| Tool | Purpose | When to Add |
|------|---------|-------------|
| **Sentry** | Error tracking, performance traces | Before first external users |
| **Posthog** | Product analytics, feature flags, session replay | When validating feature adoption |
| **Axiom** | Structured log aggregation, AI pipeline tracing | When Claude API errors need root-cause analysis across requests |
| **Vercel Analytics** | Web Vitals + traffic | Already available on Vercel — enable in dashboard |

---

## Testing

### Storybook

**What it is:** Isolated component development and visual documentation.

**When relevant:** As the component library (`BriefSectionCard`, `GapCard`, `WizardStepper`, etc.) grows, Storybook makes it easier to develop and regression-test components in isolation without running the full app.

**Not urgent** while the team is small and components are stable.

---

## Summary: Priority Order

| Priority | Upgrade | Trigger |
|----------|---------|---------|
| Near-term | Upstash Redis rate limiting | Before public launch |
| Near-term | Sentry error tracking | Before external users |
| Medium | Vercel AI SDK streaming | When AI latency is a UX complaint |
| Medium | Inngest background jobs | When Claude rate limits hit in production |
| Future | Railway migration | When serverless timeouts or per-seat pricing hurts |
| Future | Drizzle ORM | When schema complexity warrants typed queries |
| Future | Supabase Realtime (Phase 3) | When team collaboration is built |
| Future | Liveblocks / Clerk / UploadThing | Phase 3+ scale scenarios |

---

## See Also

- [[Architecture]] — current stack and data flow
- [[Deploy]] — Vercel and Supabase setup
- [[Roadmap]] — phase overview and what's next
- [[Phases/Phase 3 - Scale]] — collaboration and integration features

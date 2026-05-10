---
title: AI Pipeline Evals
tags:
  - evals
  - ai
  - claude
---

# AI Pipeline Evals

Eval cases for the four Claude API surfaces:

| Operation | Surface |
|-----------|---------|
| `processContext` | Per-section "Process Context" button on `BriefSectionCard` |
| `processAllNotes` | Wizard Step 1 "Process notes" button |
| `analyzeGaps` | Wizard Step 6 "Analyze gaps" / "Re-check gaps" |
| `POST /api/ai/refine` | "Ask AI to help" Sparkles button on `BriefSectionCard` |

**Related wiki:** [[AI Pipeline]] · [[Features/1.5 - AI Processing Pipeline]]

**Key files:** `src/lib/ai/client.ts`, `src/lib/ai/prompts.ts`, `src/lib/ai/gap-prompts.ts`, `src/lib/ai/retry.ts`, `src/actions/process-context.ts`, `src/actions/process-all-notes.ts`, `src/actions/gap.ts`, `src/app/api/ai/refine/route.ts`

---

### EC-AI-1: `processContext` requires authentication

**Given:** an unauthenticated request (no session cookie)
**When:** `processContext` server action is invoked (e.g. via direct fetch or simulated client call)
**Then:** the action returns `{ error: "Unauthorized" }` (or equivalent), no Claude API call is made, no DB write occurs
**Priority:** P0
**Tags:** #ai #process-context #security

---

### EC-AI-2: `processContext` requires brief ownership

**Given:** an authenticated user A and a `briefId` belonging to user B
**When:** user A calls `processContext` with B's `briefId`
**Then:** the action returns an error (RLS-enforced read fails when fetching the brief), no Claude call is made, and no rows in `brief_sections` belonging to user B are mutated
**Priority:** P0
**Tags:** #ai #process-context #security #rls

---

### EC-AI-3: `processContext` happy path returns structured output

**Given:** an authenticated user, a draft brief with raw notes containing audience-relevant content, and `section_key = "target_audience"`
**When:** `processContext` is called for that section
**Then:** Claude is called once via the Anthropic SDK using the system prompt from `src/lib/ai/prompts.ts`, the response is parsed into `{ content, structured_content, ai_confidence }`, `updateBriefSection` persists the result, `ai_confidence` is one of `high` / `medium` / `low`, and `structured_content` is a JSON object (not a string, not an array)
**Priority:** P0
**Tags:** #ai #process-context #happy-path

---

### EC-AI-4: `processContext` handles malformed Claude output gracefully

**Given:** a stubbed/mocked Claude response that is invalid JSON or missing required fields
**When:** `processContext` parses the response
**Then:** the action returns an error rather than crashing the server, no partial/garbage row is written to `brief_sections`, the user-facing toast is informative, and the existing `brief_sections` content (if any) is preserved
**Priority:** P0
**Tags:** #ai #process-context #error-handling

> Per [[AI Pipeline]] "Planned but Not Built": `lib/ai/parse.ts` typed parser is not yet implemented. If the parser doesn't exist, this case may show stack traces — record as P0 FAIL pending implementation.

---

### EC-AI-5: `processContext` retry-on-timeout

**Given:** a Claude call that times out on first attempt
**When:** `processContext` runs through `src/lib/ai/retry.ts` wrapper
**Then:** the action retries exactly once with ~2s backoff, succeeds on retry if Claude responds, and surfaces a clean error if the retry also fails. The retry does not double-write to the DB
**Priority:** P1
**Tags:** #ai #retry #resilience

---

### EC-AI-6: `processContext` rate-limit message surfaces cleanly

**Given:** a Claude API response with 429 (rate limit)
**When:** the retry wrapper detects the rate limit
**Then:** the user-facing error is a clean "Please try again in a moment" Sonner toast (per the wiki: "Rate limit: surface queue message"), not a stack trace, and no partial write to `brief_sections` occurs
**Priority:** P1
**Tags:** #ai #rate-limit

> Per [[AI Pipeline]] "Planned but Not Built": Upstash-backed rate limiting (10 process/hr) is planned. Until then, this only covers Anthropic-side 429s.

---

### EC-AI-7: `processAllNotes` fans out to all 9 sections in parallel

**Given:** Step 1 with substantive raw notes
**When:** the user clicks "Process notes"
**Then:** `processAllNotes` issues 9 parallel `processContext`-equivalent calls (one per section), all 9 return within a reasonable wall-clock time (< total serial time), each section is independently saved, partial failures (e.g., 1 of 9 sections errors) do not roll back the 8 successful saves, and the UI surfaces which sections failed
**Priority:** P0
**Tags:** #ai #process-all-notes #fan-out

---

### EC-AI-8: `processAllNotes` with empty raw notes is rejected at the boundary

**Given:** an authenticated user with a brief whose `raw_notes` is empty/whitespace and no uploaded files
**When:** `processAllNotes` is invoked
**Then:** Zod validation (or an explicit guard) rejects the call before issuing any Claude requests, returns `{ error }`, and the UI shows a Sonner error toast
**Priority:** P0
**Tags:** #ai #process-all-notes #validation #edge

---

### EC-AI-9: `analyzeGaps` requires brief ownership

**Given:** authenticated user A and a `briefId` belonging to user B
**When:** user A invokes `analyzeGaps`
**Then:** the action errors out (RLS read fails on `getBriefWithSections`), no Claude call, no rows in `gaps` are written for user B's brief
**Priority:** P0
**Tags:** #ai #gaps #security #rls

---

### EC-AI-10: `analyzeGaps` returns gaps with all required fields

**Given:** a populated brief
**When:** `analyzeGaps` runs and persists results
**Then:** every row inserted into `gaps` has all required fields: `brief_id` (uuid), `section_number` (integer 1–9), `severity` (one of `critical` / `recommended` / `nice_to_have`), `description` (non-empty string), `suggested_prompt` (non-empty string), and `is_dismissed = false`. No row violates the column types or has nulls in non-nullable columns
**Priority:** P0
**Tags:** #ai #gaps #schema-integrity

---

### EC-AI-11: `analyzeGaps` clears previous gaps before inserting new ones

**Given:** a brief that previously had 5 gaps, including some dismissed
**When:** the user clicks "Re-check gaps"
**Then:** `analyzeGaps` deletes (or supersedes) the previous gap rows for that brief, inserts the fresh set, and the UI immediately reflects the new list. There is no situation where stale gaps from the prior run linger and double-count
**Priority:** P0
**Tags:** #ai #gaps #re-check

---

### EC-AI-12: `analyzeGaps` on an empty brief still produces well-formed gaps

**Given:** a brief with no content in any section (a near-empty brief)
**When:** `analyzeGaps` is called
**Then:** the call still completes successfully, returns gaps that flag the empty sections as `critical`, every gap row passes the schema check from EC-AI-10, and the UI renders them sorted by severity
**Priority:** P1
**Tags:** #ai #gaps #edge

---

### EC-AI-13: `dismissGap` is idempotent and ownership-checked

**Given:** authenticated user A and a `gapId` belonging to user B's brief
**When:** A invokes `dismissGap` for that gap
**Then:** RLS prevents the update, the response is an error, and `gaps.is_dismissed` for user B's gap remains unchanged. Calling `dismissGap` twice for the user's own gap leaves it dismissed without raising an error
**Priority:** P0
**Tags:** #ai #gaps #security #idempotency

---

### EC-AI-14: `POST /api/ai/refine` requires authentication

**Given:** an unauthenticated POST to `/api/ai/refine`
**When:** the route handler runs
**Then:** the response is 401 (or equivalent error JSON), no Claude call, no DB write
**Priority:** P0
**Tags:** #ai #refine #security

---

### EC-AI-15: `POST /api/ai/refine` validates body with Zod

**Given:** an authenticated POST to `/api/ai/refine` with malformed body — e.g., missing `briefId`, `sectionKey` not in the allowed enum, `currentContent` not an object
**When:** the handler validates input
**Then:** the response is a 4xx with a Zod v4 formatted error message, no Claude call is made, no DB write
**Priority:** P0
**Tags:** #ai #refine #zod #validation

---

### EC-AI-16: `POST /api/ai/refine` enforces brief ownership

**Given:** authenticated user A POSTing to `/api/ai/refine` with `briefId` belonging to user B
**When:** the handler checks ownership before calling Claude
**Then:** the response is 403/404, no Claude call, and no `brief_sections` mutation
**Priority:** P0
**Tags:** #ai #refine #security #rls

---

### EC-AI-17: `POST /api/ai/refine` happy path returns structured content

**Given:** an authenticated user, valid `briefId` they own, valid `sectionKey`, valid `currentContent` object, and an optional `userContext` string
**When:** the handler invokes Claude with `REFINE_SYSTEM_PROMPT`
**Then:** the response body matches `{ structuredContent: Record<string, string> }`, the content reflects the user's existing structured shape (same keys, refined values), and the call uses the same tool-use pattern as `process-context.ts`
**Priority:** P0
**Tags:** #ai #refine #happy-path

---

### EC-AI-18: `POST /api/ai/refine` does NOT persist on its own

**Given:** a successful refine response
**When:** the handler returns
**Then:** the brief sections in the database are not yet updated by the API route (the client is responsible for calling the relevant save action after user confirmation, OR the handler explicitly persists — verify which is implemented and that double-writes do not occur). Document the chosen contract and assert it
**Priority:** P1
**Tags:** #ai #refine #persistence

---

### EC-AI-19: AI calls never expose `ANTHROPIC_API_KEY` to the browser

**Given:** the production deployment
**When:** the page source, network requests, and client-side JS bundles are inspected
**Then:** `ANTHROPIC_API_KEY` is never present in any client-visible payload, has no `NEXT_PUBLIC_` prefix, and is only used in server actions and API routes (per [[AI Pipeline]] "Server Only" callout)
**Priority:** P0
**Tags:** #ai #security #secrets

---

### EC-AI-20: AI confidence badge maps to correct color

**Given:** a section with `ai_confidence = 'high'`, another with `'medium'`, another with `'low'`
**When:** the wizard renders the badges
**Then:** colors map to the OKLCH-defined semantic tokens — emerald for high, amber for medium, slate for low (per [[Conventions]]) — and not to fallback hex or wrong color tokens
**Priority:** P1
**Tags:** #ai #ui #colors

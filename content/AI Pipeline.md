---
title: AI Pipeline
tags:
  - ai
  - claude
  - reference
---

# AI Pipeline

Briefly uses the **Anthropic Claude API** for three AI operations:

1. **Process Context** — parse user notes → structured section content
2. **Analyze Gaps** — evaluate brief quality → return gaps with severity
3. **Section Refinement** — improve a section given new user context (`POST /api/ai/refine`)

## Setup

`src/lib/ai/client.ts` — initializes the Anthropic SDK:

```typescript
import Anthropic from "@anthropic-ai/sdk";
export const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
```

> [!tip] Server Only
> `ANTHROPIC_API_KEY` has no `NEXT_PUBLIC_` prefix — AI calls happen exclusively in server actions and API routes, never in the browser.

## Process Context

**Server action:** `src/actions/process-context.ts` → `processContext()`

**What it does:**
1. Accepts raw notes + section context for a specific brief section
2. Calls Claude with the notes-parsing system prompt from `src/lib/ai/prompts.ts`
3. Returns structured content: `{ content, structured_content, ai_confidence }`
4. Saved via `updateBriefSection`

> [!warning] Not Yet Implemented
> The action validates auth and takes the right inputs, but the **Claude API call is a stub**. Implementing this is the top near-term priority. See [[Roadmap]].

**Next steps to implement:**
1. Fetch `raw_notes` from the brief and any extracted file text
2. Build prompt using section template from `src/lib/ai/prompts.ts`
3. Call `anthropic.messages.create({ model, system, messages })`
4. Parse JSON response into `{ content, structured_content, ai_confidence }`
5. Call `updateBriefSection` to persist

## Gap Analysis

**Server action:** `src/actions/gap.ts` → `analyzeGaps()`

**What it does:**
1. Accepts a `briefId`, fetches all sections via `getBriefWithSections`
2. Calls Claude with the gap analysis prompt from `src/lib/ai/gap-prompts.ts`
3. Claude evaluates content against GTM template quality benchmarks
4. Returns gaps: `{ section_number, severity, description, suggested_prompt }`
5. Clears previous gaps for the brief, inserts new ones into `gaps` table

**Status:** Fully implemented.

Also in `src/actions/gap.ts`: `dismissGap()` — sets `is_dismissed = true`.

## Prompts

### Notes Processing (`src/lib/ai/prompts.ts`)

Instructs Claude to:
- Parse unstructured marketing notes into 9 brief sections
- Return structured JSON: `{ content, confidence, missing_info }` per section

### Gap Analysis (`src/lib/ai/gap-prompts.ts`)

Instructs Claude to:
- Evaluate brief content against GTM quality benchmarks
- Return gaps with `{ section_number, severity, description, suggested_prompt }`
- Severity values: `critical`, `recommended`, `nice_to_have`

## Retry Logic

`src/lib/ai/retry.ts` — wraps API calls:
- Timeout: retry once with 2s backoff
- Rate limit: surface queue message

## Models

Configured in `src/lib/ai/client.ts`. Default choices:

| Model | ID | Use Case |
|-------|----|---------|
| Opus 4.7 | `claude-opus-4-7` | Best quality, higher cost |
| Sonnet 4.6 | `claude-sonnet-4-6` | Fast, good quality, lower cost |

## Key Files

| File | Purpose |
|------|---------|
| `src/lib/ai/client.ts` | Anthropic SDK init |
| `src/lib/ai/prompts.ts` | Notes parsing + section refinement prompts |
| `src/lib/ai/gap-prompts.ts` | Gap analysis prompt templates |
| `src/lib/ai/retry.ts` | Retry + backoff logic |
| `src/actions/process-context.ts` | `processContext` server action (stub) |
| `src/actions/process-all-notes.ts` | `processAllNotes` batch action |
| `src/actions/gap.ts` | `analyzeGaps`, `dismissGap` |

## Section Refinement

**Route:** `POST /api/ai/refine` (`src/app/api/ai/refine/route.ts`)

**Body:** `{ briefId, sectionKey, currentContent: Record<string, string>, userContext?: string }`  
**Response:** `{ structuredContent: Record<string, string> }`

Uses a distinct `REFINE_SYSTEM_PROMPT` focused on improving existing content rather than extracting from raw notes. Verifies brief ownership before calling Claude. Uses the same tool-use pattern as `process-context.ts`.

**UI:** "Ask AI to help" button (`Sparkles` icon) in `BriefSectionCard`. Enabled when the section has existing content. Sends the current structured content + any text in the "Add context" textarea as `userContext`. Clears the textarea on success.

## Planned but Not Built

- `src/lib/ai/parse.ts` — typed response parser for Claude JSON output
- Rate limiting: 10 process/hr, 20 gaps/hr, 30 refine/hr per user
- `ai_metadata` tracking on `briefs` (model, tokens, processing time)

## See Also

- [[Wizard]] — where `processContext` is triggered (Step 1 "Process Notes" button)
- [[Database]] — `gaps` table schema
- [[Roadmap]] — implementation priority

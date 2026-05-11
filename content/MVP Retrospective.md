---
title: MVP Retrospective
tags:
  - retrospective
  - methodology
  - learnings
aliases:
  - MVP Retrospective
  - Retrospective
---

# MVP Retrospective

**Briefly** — *Build Better Briefs.*

The MVP was completed in approximately one week of Claude Code Pro usage, then deployed from localhost to Vercel with a published GitHub Actions wiki for stakeholder review. This page captures the methodology used to build it, the key learnings from that process, and the extensibility decisions made along the way.

---

## The Problem

Poorly planned and undocumented go-to-market campaigns create downstream errors, delays, and misalignment that cost businesses pipeline and revenue. Campaign managers, designers, developers, and marketing operators end up working from incomplete or conflicting information, leading to revision cycles that should have been avoided with upfront alignment.

With the advent of AI allowing teams to move much faster, the bottleneck has shifted from execution to alignment. The key to running the most effective campaigns is establishing operating guardrails and getting early buy-in from all contributing teams on the plan before execution begins. Briefly exists to solve that problem.

---

## What Was Built

Briefly is a six-step guided wizard that turns rough campaign notes into a structured, AI-analyzed brief — covering objectives, audience, channel strategy, budget and timeline, metrics, and a final gap analysis that flags incomplete or underdeveloped areas before production work begins.

The application is a living source of truth for documenting GTM campaigns, giving all teams a single place to rally around. Outputs can be exported as PDF or Markdown (Confluence, Obsidian, etc.). See [[About]] for the full product overview.

---

## How It Was Built

### Spec-Driven Development

The idea for Briefly came from consistent downstream pain points shared by end users — channel managers, designers, operators, and developers — who were lacking key details from campaign briefs. Incomplete plans were causing reworks, missed deadlines, and misaligned deliverables.

Those observations were used to specify a product requirements document (PRD), which fed into a more extensive planning process with Claude Code to define features and functionality using a custom **Spec-Driven Development (SDD)** methodology.

### Multi-Agent Architecture

The development framework consists of four agent roles, each with a distinct purpose and defined share of human-in-the-loop (HITL) time:

| Role | HITL | Responsibilities |
|------|------|-----------------|
| **Planner** | 60% | Builds and maintains the PRD and Spec.md; breaks spec into milestones, slices, and tasks; manages the Obsidian project wiki; runs discovery via AskUserQuestions; revises plans based on evaluator feedback; updates CLAUDE.md |
| **Generator** | 10% | Executes the framework by working through milestones and tasks; runs in parallelized sessions via tmux and git worktrees, or through Agent Teams; human role is mostly approvals, danger zone reviews, and wiki incorporation |
| **Evaluator** | 30% | Creates and updates UAT and eval criteria; applies scoring rubric; provides hyper-critical review; steers on subjective outputs; writes insights back to CLAUDE.md for self-improvement; runs Playwright-based functional tests |
| **Researcher** | N/A | Handles deep domain research, connected services and API integration, ETL/ingestion, and logging/annotation/linking; dispatched by the Planner as needed (not used in this project) |

### Development Iteration Cycle

The process followed a repeatable cycle that maximized context efficiency and minimized rework:

1. **Discovery** — Parse the Spec.md with the planning agent and run discovery questions using AskUserQuestions to refine requirements and resolve ambiguity before any code is written
2. **Documentation-first** — Maintain ongoing documentation within the project repository using Obsidian; publish via Quartz and GitHub Actions as a shareable, living artifact
3. **Sprint planning** — Read the project wiki and roadmap, then build a sprint cycle with scoped milestones and tasks aligned to the specification
4. **Build and deploy** — Develop the sprint's changes and deploy to dev, then production via Vercel and Quartz/GitHub Actions
5. **Evaluate** — Create tests with the evaluator agent and document eval criteria to ensure each phase is feature-complete against the specification
6. **Functional testing** — Use Playwright to test application functionality against eval criteria, catching regressions before they ship

### Self-Healing Documentation

A key design decision was ensuring the CLAUDE.md file instructed agents to always start a session by reading the wiki documentation for the next feature, and to finish every session by documenting changes in the wiki and updating the sprint plan and roadmap.

This creates a self-healing, self-building documentation system where the wiki stays current without manual effort. The Claude Code harness reads the wiki on session start to understand where it left off, then writes back on session end with what it accomplished. The result is a project that maintains its own institutional memory.

---

## Key Learnings

> [!tip] 1. Self-maintained documentation is the highest-leverage investment
> Building a comprehensive project wiki alongside the app itself — covering architecture, database schema, AI pipeline, components, conventions, and extensibility — was the single most valuable decision made. It forced explicit thinking through decisions and created documentation that lets agents and other developers traverse the project efficiently. More importantly, it ensured more effective context usage across agent sessions, which meant building faster at a lower cost. Every session started with shared understanding instead of re-deriving context from scratch.

> [!tip] 2. Structured AI output requires deliberate prompt design
> Getting Claude to return consistent, parseable JSON across a variety of messy inputs required careful iteration. The breakthrough was giving the model a rigid schema definition and explicit instructions about what to do when input data was ambiguous or incomplete: return low confidence scores and flag missing fields rather than hallucinating content.

> [!tip] 3. The gap analysis is the real value add
> The most powerful part of Briefly is not the note parsing — it is the gap analysis at the end. A human writing a brief alone will almost always miss something. Having an objective evaluator read the full document, flag gaps, and suggest fixes catches the issues that would otherwise surface during production and create risk. This allows campaign planners to address issues proactively or accept the risks deliberately.

---

## Extensibility & What's Next

The MVP scope was intentionally constrained to one week of Claude Code Pro usage, but the architecture was designed to support a clear set of extensions. See [[Extensibility]] for the full breakdown organized by system area with trigger conditions.

### Near-Term
- **Rate limiting** — Upstash Redis replacing the current in-memory approach that resets on every cold start *(WIP)*
- **Sentry error tracking** — essential before exposing to external users *(WIP)*
- **Vercel AI SDK streaming** — replace blocking AI responses with real-time content population
- **Multi-channel interactivity** — Slack, Microsoft Teams, SharePoint via connected APIs and webhooks
- **Project plan export** — push a brief directly into Airtable, ClickUp, Asana, Monday.com as a templatized campaign deliverable tracker
- **Background job queue** — Inngest or Trigger.dev for safer parallel AI processing with backoff and retry

### Future Vision
- **Railway migration** — container-based hosting for long-running AI operations and background workers
- **Supabase Realtime collaboration** — multiple team members co-editing a brief simultaneously
- **Drizzle ORM** — compile-time type safety as the schema grows
- **Agentic brief generation** — Claude autonomously researches competitors, pulls CRM data, and iterates on drafts based on historical campaign performance

---

## Closing Thoughts

Good planning leads to great execution. AI has moved the bottleneck from team execution to stakeholder alignment, so getting everyone looking at the same playbook before sprinting is the differentiator that makes effective campaigns.

This project demonstrated not only the capability of spec-driven development, but also the efficiency gains that allow developers to build comprehensive applications within limited context budgets at reduced cost. Briefly is an end-to-end example of a system working together to solve a fundamental user problem and optimize a core function of any marketing department.

---

## See Also

- [[About]] — product overview, what it does, who it's for
- [[Roadmap]] — phase status and what's next
- [[Extensibility]] — detailed architectural upgrade paths
- [[AI Pipeline]] — Claude API implementation details
- [[Deploy]] — Vercel and Supabase setup

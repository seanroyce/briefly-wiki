---
title: "Slack Bot"
status: "3-backlog"
sprint: 5
phase: 3
section: "3.5"
priority: p2
size: l
category: integration
tags:
  - task
  - integration
  - slack
---

# Slack Bot

Slack app that lets team members interact with Briefly briefs from Slack — view a brief, summarise gaps, ask questions, and receive completion notifications.

## Background

Marketing teams live in Slack. Surfacing brief content and gap analysis there cuts context-switching and gets more eyes on completed briefs. The bot installs per workspace via OAuth, listens for slash commands, and posts Block Kit-formatted messages. Notifications are pushed when `brief.completed` and `gap_analysis.completed` events fire — these flow through the same outbound webhook infrastructure built in [[Tasks/Workflow Automation Webhooks]], with the Slack delivery handled as an internal subscriber.

## Tasks

- [ ] Create Slack app — manifest with bot scopes (`commands`, `chat:write`, `links:read`, `links:write`), redirect URL, slash command definitions
- [ ] OAuth install flow — `/api/slack/install` → `/api/slack/oauth/callback`, persist team token in `slack_workspaces` table (encrypted)
- [ ] Map Slack workspace to Briefly user/team — connection page in `/settings/integrations`
- [ ] Slash command `/briefly view <briefId|url>` — fetch brief, render Block Kit summary card
- [ ] Slash command `/briefly gaps <briefId>` — run / read gap analysis, render gaps as Block Kit list with severity
- [ ] Slash command `/briefly ask <briefId> <question>` — Claude call grounded on brief content, threaded reply
- [ ] Block Kit renderer — `src/integrations/slack/blocks.ts` (new) with brief summary, gap card, completion notification templates
- [ ] Link unfurling — detect Briefly share URLs in messages, post unfurl with summary card
- [ ] Notification subscriber — subscribe to `brief.completed` and `gap_analysis.completed` events, post to user-configured channel
- [ ] Request signature verification — validate Slack signing secret on every inbound webhook
- [ ] Rate limit + auth — only respond if invoking Slack user has a connected Briefly account with access to the brief

## See Also

- [[Features/3.5 - Slack & Workflow Integration]]
- [[Tasks/Workflow Automation Webhooks]]
- [[Tasks/Connected Accounts Settings]]
- [[Extensibility]]

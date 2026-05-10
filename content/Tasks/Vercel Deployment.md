---
title: "Vercel Deployment"
status: "2-ready"
sprint: 1
phase: 0
section: "0.4"
priority: p0
size: s
category: infrastructure
tags:
  - task
---

# Vercel Deployment

Connect the GitHub repo to Vercel and verify the production deployment pipeline.

## Tasks

- [ ] Import GitHub repo into Vercel
- [ ] Set all 5 env vars in Vercel dashboard (`NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `ANTHROPIC_API_KEY`)
- [ ] Set `NEXT_PUBLIC_SITE_URL` to Vercel production URL
- [ ] Update Supabase Auth → URL Configuration with production redirect URLs
- [ ] Verify preview deployment on a test PR

## See Also

- [[Deploy]]
- [[Auth]]

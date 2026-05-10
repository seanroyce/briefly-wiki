---
title: "Vercel Deployment"
status: "4-done"
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

- [x] Import GitHub repo into Vercel (`seanroyce/briefly`, deployed via CLI from `briefly/`)
- [x] Set all 5 env vars in Vercel project settings
- [x] Set `NEXT_PUBLIC_SITE_URL` to `https://project-yqnrm.vercel.app`
- [x] Update Supabase Auth → URL Configuration with production Site URL and redirect URL
- [x] Fix `framework: null` → set to `nextjs` via API (required for correct routing)
- [x] Fix git commit author email (`sean.r.gibbons@gmail.com`) to unblock Vercel deploy protection
- [x] Production live and accessible at https://project-yqnrm.vercel.app
- [ ] Verify preview deployment on a test PR

## See Also

- [[Deploy]]
- [[Auth]]

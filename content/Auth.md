---
title: Auth & Middleware
tags:
  - auth
  - supabase
  - reference
---

# Auth & Middleware

Handled by **Supabase Auth** with email/password + Google OAuth. Sessions are stored in cookies and refreshed automatically by the middleware.

## Auth Flows

### Sign Up

1. User fills `/signup` form
2. `signup` server action → `supabase.auth.signUp()`
3. Supabase sends verification email
4. User clicks verify link → `/auth/callback` route exchanges code for session → redirect to `/dashboard`

### Login

1. User fills `/login` form
2. `login` server action → `supabase.auth.signInWithPassword()`
3. Session stored in cookies → redirect to intended URL

### Google OAuth

1. "Continue with Google" button → `supabase.auth.signInWithOAuth()` → Google consent screen
2. Google redirects to `/auth/callback?code=...`
3. Callback route exchanges code for session → redirect to `/dashboard`

### Password Reset

1. `/forgot-password` → `forgotPassword` action → `supabase.auth.resetPasswordForEmail()`
2. User clicks email link → `/reset-password?code=...`
3. `resetPassword` action → `supabase.auth.updateUser({ password: newPassword })`

## Middleware

`src/middleware.ts` runs on every request to protected routes.

**Protected routes:** `/dashboard`, `/brief/*`, `/settings`

**Behavior:**
1. Calls `supabase.auth.getUser()` — refreshes session cookie if needed
2. If no valid session → redirect to `/login?redirectTo=<original-url>`
3. Unprotected routes pass through

```typescript
export const config = {
  matcher: ["/dashboard/:path*", "/brief/:path*", "/settings/:path*"],
};
```

## `getUser()` Helper

`src/lib/supabase/auth.ts` — always use this in server actions to get the authenticated user.

```typescript
const { user, error } = await getUser();
if (error || !user) return { error: "Unauthorized" };
```

> [!warning] Never Trust Client-Sent User IDs
> Always call `getUser()` server-side. Never accept `user_id` as a parameter from the client — while RLS enforces ownership at the DB level, server actions should validate auth first.

## Types

`src/types/auth.ts` — `AuthUser` type (inferred from Supabase session user object).

## Key Files

| File | Purpose |
|------|---------|
| `src/middleware.ts` | Session refresh + route protection |
| `src/app/auth/callback/route.ts` | OAuth code exchange, email verify redirect |
| `src/actions/auth.ts` | login, signup, logout, forgotPassword, resetPassword |
| `src/lib/supabase/auth.ts` | `getUser()` server helper |
| `src/types/auth.ts` | AuthUser type |

## Environment Variables

| Variable | Used For |
|----------|---------|
| `NEXT_PUBLIC_SITE_URL` | Auth redirect base URL (e.g. `http://localhost:3000`) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |

## Known Gaps

> [!todo] Not Yet Implemented
> - `users` public profile table (planned in Phase 1.2) — for storing name, avatar_url, auth_provider
> - DB trigger to auto-create profile row on `auth.users` insert
> - OAuth account linking when same email exists via password

## See Also

- [[Database]] — planned `users` profile table
- [[Deploy]] — Supabase Auth redirect URL config for production

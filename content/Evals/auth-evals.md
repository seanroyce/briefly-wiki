---
title: Auth Evals
tags:
  - evals
  - auth
  - supabase
---

# Auth Evals

Eval cases for Supabase Auth flows: email/password sign-up, Google OAuth, login, logout, password reset, route protection middleware, and account deletion.

**Related wiki:** [[Auth]] · [[Features/1.2 - Authentication]] · [[Features/1.9 - Account Settings]]

**Routes under test:** `/signup`, `/login`, `/forgot-password`, `/reset-password`, `/auth/callback`, `/settings`, `/dashboard`, `/brief/*`

**Server actions under test:** `signup`, `login`, `logout`, `forgotPassword`, `resetPassword`, `updateProfile`, `updatePassword`, `deleteAccount`

---

### EC-AUTH-1: Email/password signup happy path

**Given:** an unauthenticated user on `/signup` with a never-used email
**When:** they fill in email + password (>= 8 chars), submit the form, then click the verification link in their inbox
**Then:** `/auth/callback?code=...` resolves, a session cookie is set, the user lands on `/dashboard`, the navbar avatar dropdown reflects their identity, and a row exists in `public.users` (auto-populated by the `on_auth_user_created` trigger) with `auth_provider = 'email'`
**Priority:** P0
**Tags:** #auth #signup #supabase

---

### EC-AUTH-2: Signup with already-registered email

**Given:** an email that already has a `auth.users` row
**When:** the user submits `/signup` with that email
**Then:** the form surfaces a Sonner error toast (or inline error) with a message that the account already exists, no duplicate `public.users` row is created, and the user remains on `/signup`
**Priority:** P0
**Tags:** #auth #signup #edge

> Known gap per [[Features/1.2 - Authentication]]: the duplicate-email error path is listed as remaining work. Treat a generic error as PARTIAL, not FAIL.

---

### EC-AUTH-3: Signup with malformed inputs

**Given:** an unauthenticated user on `/signup`
**When:** they submit (a) an obviously-not-an-email string, (b) a password under 8 characters, or (c) an empty form
**Then:** Zod v4 validation rejects the request server-side, no Supabase call is made, the form shows a field-level error message that matches Zod v4 output format, and no session cookie is set
**Priority:** P0
**Tags:** #auth #signup #zod #validation

---

### EC-AUTH-4: Email/password login happy path

**Given:** a verified existing account
**When:** the user submits valid credentials at `/login`
**Then:** `signInWithPassword` succeeds, a session cookie is set, and the user is redirected to `/dashboard` (or to `redirectTo` if present in the query string)
**Priority:** P0
**Tags:** #auth #login

---

### EC-AUTH-5: Login with wrong password

**Given:** a verified existing account
**When:** the user submits the correct email but a wrong password at `/login`
**Then:** the action returns `{ error }`, the form surfaces a non-leaky error message ("Invalid credentials" — does not say whether email or password was wrong), no session cookie is set, and the user remains on `/login`
**Priority:** P0
**Tags:** #auth #login #security

---

### EC-AUTH-6: Google OAuth sign-in

**Given:** an unauthenticated user on `/login`
**When:** they click "Continue with Google" and complete the Google consent screen
**Then:** Google redirects to `/auth/callback?code=...`, the callback exchanges the code for a session, the user lands on `/dashboard`, and `public.users.auth_provider` is `'google'` (or fallback `'email'` if the row pre-existed). A subsequent reload of `/dashboard` shows the user remains authenticated
**Priority:** P0
**Tags:** #auth #oauth #google #supabase

---

### EC-AUTH-7: OAuth callback with invalid/expired code

**Given:** the user lands on `/auth/callback` with a stale or tampered `code` query param
**When:** the callback route runs the code-exchange
**Then:** no session is created, the user is redirected to `/login` with an error indication (toast or query param), and no `public.users` row is created from the bad attempt
**Priority:** P1
**Tags:** #auth #oauth #edge

---

### EC-AUTH-8: Password reset request

**Given:** an unauthenticated user on `/forgot-password`
**When:** they submit a known account email
**Then:** `forgotPassword` server action calls `supabase.auth.resetPasswordForEmail` with `redirectTo` pointing at `${NEXT_PUBLIC_SITE_URL}/reset-password`, a Sonner success toast confirms the email was sent, and the user is not signed in (still anonymous)
**Priority:** P0
**Tags:** #auth #password-reset

---

### EC-AUTH-9: Password reset request with unknown email

**Given:** an email address that does not match any account
**When:** the user submits it on `/forgot-password`
**Then:** the response is the same generic success message as EC-AUTH-8 (do not reveal whether the email exists), no email is actually sent
**Priority:** P0
**Tags:** #auth #password-reset #security

---

### EC-AUTH-10: Reset password completion

**Given:** the user has clicked a valid reset link and is on `/reset-password?code=...`
**When:** they enter a new password (>= 8 chars) twice and submit
**Then:** `resetPassword` server action calls `supabase.auth.updateUser({ password })`, the session is established, a Sonner success toast appears, and the user is redirected to `/dashboard`. A subsequent login with the *old* password fails (EC-AUTH-5 path)
**Priority:** P0
**Tags:** #auth #password-reset

---

### EC-AUTH-11: Middleware protects `/dashboard` from unauthenticated access

**Given:** no session cookie present
**When:** the user navigates directly to `/dashboard`
**Then:** middleware (`src/middleware.ts`) intercepts the request, redirects to `/login?redirectTo=%2Fdashboard`, and the dashboard markup is *never* sent to the browser. After the user logs in, they land back on `/dashboard`
**Priority:** P0
**Tags:** #auth #middleware #security

---

### EC-AUTH-12: Middleware protects `/brief/*` and `/settings`

**Given:** no session cookie
**When:** the user navigates to `/brief/new`, `/brief/<some-uuid>`, `/brief/<some-uuid>/edit`, or `/settings`
**Then:** each is intercepted by middleware (matcher: `/dashboard/:path*`, `/brief/:path*`, `/settings/:path*`) and redirects to `/login?redirectTo=<original>`. The original `searchParams` (e.g. `?step=3`) survive the round-trip after login
**Priority:** P0
**Tags:** #auth #middleware #security

---

### EC-AUTH-13: Logout

**Given:** an authenticated session
**When:** the user clicks Logout in the navbar dropdown
**Then:** the `logout` server action calls `supabase.auth.signOut()`, the session cookie is cleared, the user is redirected to `/` (public landing) or `/login`, and visiting `/dashboard` afterward triggers EC-AUTH-11 behavior
**Priority:** P0
**Tags:** #auth #logout

---

### EC-AUTH-14: Profile update from `/settings`

**Given:** an authenticated user on `/settings`
**When:** they change their full name and click Save
**Then:** `updateProfile` action validates input with Zod, dual-writes to `public.users` and Supabase Auth user metadata, a Sonner success toast appears, and the navbar avatar dropdown immediately reflects the new name (after revalidation)
**Priority:** P1
**Tags:** #auth #settings

---

### EC-AUTH-15: Password change with wrong current password

**Given:** an authenticated user on `/settings`
**When:** they fill the password change form with an incorrect current password
**Then:** `updatePassword` re-verifies the current password, returns `{ error: "Current password is incorrect" }` (or similar), no password change occurs, and a Sonner error toast surfaces
**Priority:** P1
**Tags:** #auth #settings #security

---

### EC-AUTH-16: Account deletion with confirmation

**Given:** an authenticated user with at least one brief on `/settings`
**When:** they open the Delete Account dialog, type "DELETE" exactly into the confirmation input, and click Delete
**Then:** `deleteAccount` action soft-deletes all of the user's briefs (sets `deleted_at`), removes the auth.users row (or marks the account deleted per Supabase admin API), signs the user out, and redirects to `/`. A subsequent login with the same credentials fails
**Priority:** P0
**Tags:** #auth #settings #destructive

---

### EC-AUTH-17: Account deletion blocked when confirmation text is wrong

**Given:** the Delete Account dialog is open
**When:** the user types anything other than the exact string "DELETE" and clicks Delete
**Then:** the Delete button is disabled or the action is rejected, no briefs are deleted, the session remains active, and an inline error explains the required confirmation text
**Priority:** P0
**Tags:** #auth #settings #destructive #safety

---

### EC-AUTH-18: Expired session redirect preserves the URL

**Given:** an authenticated user whose session cookie has expired between page loads
**When:** they click into `/brief/<id>/edit?step=4`
**Then:** middleware fails the `getUser()` refresh, redirects to `/login?redirectTo=%2Fbrief%2F<id>%2Fedit%3Fstep%3D4`, and after re-login the user lands back on the wizard at step 4 with state intact
**Priority:** P1
**Tags:** #auth #middleware #edge

> Listed as remaining work in [[Features/1.2 - Authentication]]. Treat as PARTIAL if redirect happens but `step` is dropped.

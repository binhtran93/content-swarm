# 00.01 — Owner Authentication

Status: Not started

## Outcome

The single owner can sign in with Firebase email/password, stay signed in,
access the backoffice, and sign out. Nobody else can open backoffice pages or
run backoffice commands.

This adapts the proven owner-only flow from
`/Users/binhtran/projects/seo-pipe/src/features/auth`. It uses Nexus/DaisyUI for
the new login presentation; it does not copy the old TailAdmin UI.

## Depends on

- [Platform Foundation](./00-platform-foundation.md)

## Scope

- One manually created Firebase Authentication owner account.
- Email and password login.
- One configured `FIREBASE_OWNER_UID`.
- A verified HttpOnly server session cookie.
- Protected `/admin` routes and server commands.
- Sign out from both Firebase client auth and the server session.

R1 has no signup, password-reset UI, profile, roles, invitations, teams, OAuth,
or Firestore user document.

Reuse the existing Firebase project settings, owner UID, and local development
configuration from `seo-pipe-lite` or `seo-pipe` when they belong to the target
Firebase environment. Credentials remain in ignored environment files or the
deployment secret store; do not place them in this plan or source code.

## Authentication flow

```text
Open /admin
→ No valid session: redirect to /login?next=/admin/...
→ Sign in with Firebase email/password
→ Browser sends the Firebase ID token to the session endpoint
→ Server verifies the token and exact owner UID
→ Server creates an HttpOnly session cookie
→ Return to the requested backoffice page
```

An authenticated Firebase user whose UID is not the configured owner is signed
out and receives the same generic login failure. Do not reveal whether an email
or UID exists.

## Owner identity

`requireOwner()` returns the verified Firebase identity for server pages and
services. The returned `uid` is the only value used as `ownerId`.

Never accept `ownerId` from a form, URL, request body, AI output, or client-side
state. The owner email and password are not stored in Firestore.

## Project ownership

The Project document stores the ownership boundary:

```ts
ownerId: string
```

Nested Project documents do not repeat `ownerId`. Keywords, discoveries,
Articles, Translations, and slug reservations inherit ownership through
`projects/{projectId}`.

Every backoffice query or command must:

1. Call `requireOwner()`.
2. Read or query only Projects whose `ownerId` equals the verified `uid`.
3. Reject a supplied `projectId` when its Project belongs to another owner.

This remains useful even with one R1 owner and avoids making all Projects
implicitly global.

## Session and security rules

- Verify Firebase ID tokens with revocation checking before session creation.
- Verify session cookies with revocation checking on protected requests.
- Session cookie is HttpOnly, Secure in production, SameSite=Lax, scoped to
  `/`, and has a bounded lifetime.
- Validate `next` as a local `/admin` path to prevent open redirects.
- Firestore browser reads are allowed only for the configured owner when a
  realtime backoffice read actually needs them.
- Firestore browser writes are denied; verified server commands perform writes.
- Public-site server services may use Firebase Admin but must return only
  published Articles and approved Translations.

The configured owner UID, deployed Firestore rules, and tests must agree. The
UID is not a secret; the password and Firebase service-account credentials are.
As in the old implementation, startup validation must reject a
`FIREBASE_OWNER_UID` that differs from the deployed owner constant used by the
client checks and rules tests.

## Backoffice behavior

Routes:

```text
/login
/admin/*
```

- Login contains only email, password, submit, loading, and generic error.
- A valid session visiting `/login` redirects to `/admin/projects`.
- An invalid, expired, or revoked session redirects to Login.
- The admin topbar exposes a real Sign out action.
- Auth initialization never flashes protected backoffice content.

## AI behavior and prompt

None. Authentication never invokes AI.

## Planned implementation links

- [Client Auth](../src/features/auth/client/get-client-auth.ts)
- [Deployed owner UID](../src/platform/firebase/deployed-owner.ts)
- [Server environment](../src/platform/env/server-env.ts)
- [Sign in](../src/features/auth/client/sign-in-owner.ts)
- [Sign out](../src/features/auth/client/sign-out-owner.ts)
- [Create session](../src/features/auth/server/create-owner-session.server.ts)
- [Require owner](../src/features/auth/server/require-owner.server.ts)
- [Session endpoint](../src/app/api/auth/session/route.ts)
- [Login form](../src/features/auth/backoffice/login-form.tsx)
- [Login page](../src/app/login/page.tsx)
- [Firestore rules](../firestore.rules)
- [Authentication tests](../src/features/auth/server/require-owner.server.test.ts)

Each client operation, server operation, main model, or component file has one
public export and one responsibility.

## Implementation order

1. Enable Firebase email/password and create the one owner account.
2. Configure and validate `FIREBASE_OWNER_UID`.
3. Implement Firebase client Auth initialization.
4. Implement sign in and verified server-session creation.
5. Implement `requireOwner()` and protect `/admin`.
6. Implement sign out and session deletion.
7. Adapt the minimal Nexus/DaisyUI login page and topbar action.
8. Add owner-only Firestore rules and emulator tests.
9. Test expired, revoked, tampered, non-owner, and unsafe-return-path cases.

## Tangible output

The real owner can sign in, refresh a protected backoffice page, and sign out.
Anonymous and non-owner users cannot open the backoffice or call a protected
command.

## Verification

- Valid owner credentials create a working server session.
- Invalid credentials and valid non-owner credentials show one generic error.
- Missing, expired, revoked, or tampered cookies fail closed.
- Refresh preserves a valid session.
- Sign out clears client and server authentication.
- Anonymous and non-owner browser access cannot read private Firestore data.
- Browser writes are denied.
- Formatting, lint, type checking, tests, and build pass.

## Done when

- There is no temporary development-only admin bypass.
- Every `/admin` route and backoffice service requires the verified owner.
- Project Management can safely assign `ownerId` from `requireOwner().uid`.

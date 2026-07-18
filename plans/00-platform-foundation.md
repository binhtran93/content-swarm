# 00 — Platform Foundation

Status: Not started

## Outcome

A clean target application can run, test, build, and connect through a typed
server-only Firebase boundary. Public and admin route groups exist, but no
product feature is copied yet.

## Decisions to record before implementation

- Target repository location and package manager.
- Supported Node.js version.
- Authentication choice for the single R1 owner.
- Local Firestore emulator versus isolated development Firebase project.
- Separate public/admin deployments from the same codebase or one initial
  deployment with strict route boundaries.

Record decisions in `docs/architecture/decisions/` only when implementation
needs the rationale. Avoid creating an architecture document for obvious code.

## Target source shape

```text
src/
  app/
    (public)/
    admin/
    api/
  features/
    projects/
    keywords/
    discoveries/
    articles/
    publishing/
  public-site/
    components/
    config/
    services/
  platform/
    audit/
    auth/
    env/
    firebase/
    result/
```

Routes compose feature code. Domain validation and Firestore access do not live
inside React pages or route handlers.

## Firestore foundation

This increment owns no product collection. It provides:

- Firebase Admin initialization from validated server environment variables.
- Emulator/development project selection.
- A test helper that uses isolated project/document prefixes or emulator reset.
- Firestore converters/readers that reject malformed product documents.
- Shared transaction and timestamp conventions.
- Shared append-only audit-event contract.

### Audit event document

Path: `projects/{projectId}/auditEvents/{eventId}`

```ts
type AuditEventDocument = {
  schemaVersion: 1
  projectId: string
  actorId: string
  action: string
  entityType: string
  entityId: string
  outcome: "succeeded" | "failed"
  correlationId: string
  details: Record<string, string | number | boolean | null>
  createdAt: Timestamp
}
```

Never store credentials, complete prompts, full provider payloads, or article
content in audit details.

## AI behavior

None. Do not add an AI abstraction until the first real AI feature in Keyword
Grouping. Foundation may provide only typed environment access.

## Planned implementation links

- [Environment schema](../src/platform/env/server-env.ts)
- [Firebase Admin app](../src/platform/firebase/admin-app.server.ts)
- [Firestore accessor](../src/platform/firebase/firestore.server.ts)
- [Audit event contract](../src/platform/audit/audit-event.ts)
- [Audit writer](../src/platform/audit/write-audit-event.server.ts)
- [Test setup](../src/test/setup.ts)

These targets may not exist yet. Create them only when implementing this plan.

## Implementation order

1. Select the target repository and create one clean Next.js application.
2. Align stable package versions from the two legacy applications.
3. Configure formatting, lint with no warnings, type checking, Vitest, React
   tests, and production build.
4. Add a dependency-boundary rule preventing public client code from importing
   server/editorial modules.
5. Implement typed server environment parsing.
6. Implement Firebase Admin and Firestore access.
7. Configure emulator or isolated development access.
8. Add the audit event schema/writer.
9. Create minimal public and protected-admin route placeholders.
10. Add CI or one local `check` command that runs all required verification.

## Tangible output

- The application opens a public placeholder.
- An authenticated or temporary development-only admin gate opens an admin
  placeholder without exposing Firebase credentials.
- An integration test writes and reads one audit event using the test Firestore
  environment.

Do not create fake Project, Keyword, or Article product data in this increment.

## Verification

- Missing Firebase settings fail with a clear server error.
- Client bundles cannot import the Firebase Admin module.
- Audit schema rejects sensitive/non-supported detail values.
- Test Firestore does not touch production.
- Formatting, lint, type checking, tests, and build pass from a clean checkout.

## Done when

- The target application is the agreed implementation home.
- Public/admin boundaries are demonstrable.
- Firestore integration tests run safely.
- The project has one successful all-check command.
- No legacy feature code has been bulk copied.


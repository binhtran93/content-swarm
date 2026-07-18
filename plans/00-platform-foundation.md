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

The backoffice UI foundation is decided: adapt selected Nexus/DaisyUI code from
the local `nexus/` directory. The implementation still needs to decide the exact
target Next.js version and reconcile Nexus 15 patterns with the chosen target
version before copying code.

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
      model/
      service/
      backoffice/
    keywords/
      model/
      service/
      backoffice/
    articles/
      model/
      service/
      backoffice/
  backoffice/
    components/
      layout/
      ui/
    config/
    styles/
  public-site/
    components/
    sites/
      subiq/
        theme.css
        site-layout.tsx
        landing-page.tsx
      jewelry-identifier/
      skylens/
      urge-zero/
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

Each folder under `features/` is a vertical domain slice. Its `model/` and
`service/` code stay surface-neutral; its `backoffice/` folder owns that
domain's authenticated Nexus/DaisyUI presentation.

The root `backoffice/` folder owns only shared admin layout, UI primitives,
configuration, and styles.
`public-site/` owns branded reader presentation and public read adapters.

Shared services accept an explicit `projectId`. They never import a single
SubIQ constant as their implicit project.

## Nexus backoffice adoption

Source template:
`/Users/binhtran/projects/AnmiSoft/nexus`

Local template facts:

- Nexus 2.3.0.
- Next.js 15, React 19, TypeScript, Tailwind CSS 4, and DaisyUI 5.
- Licensed template that permits using and modifying parts in an end product,
  subject to the purchased package restrictions in `nexus/LICENSE`.
- The directory is already ignored by the target repository and must remain a
  local reference rather than a production dependency.

### Adopt and adapt

Use these as starting points, not blind copies:

- Admin layout composition from `nexus/src/app/(admin)/layout.tsx`.
- Responsive Sidebar, menu item, and active-route patterns.
- Simplified Topbar and mobile menu toggle.
- `PageTitle`, `LoadingEffect`, theme tokens, DaisyUI/Tailwind setup, and useful
  form/table/modal/tab/toast patterns.
- Theme support only if it remains reliable and useful; start with one polished
  light theme if multiple themes slow feature delivery.
- Iconify Lucide integration if its production/runtime cost is acceptable.

Copy adapted production code into:

```text
src/backoffice/components/layout/admin-shell.tsx
src/backoffice/components/layout/admin-sidebar.tsx
src/backoffice/components/layout/admin-topbar.tsx
src/backoffice/components/layout/admin-menu-item.tsx
src/backoffice/components/ui/page-title.tsx
src/backoffice/components/ui/loading-state.tsx
src/backoffice/config/navigation.ts
src/backoffice/styles/backoffice.css
```

### Do not adopt

- Demo dashboards and charts.
- Ecommerce, chat, file manager, Gen-AI demo, and UI showcase routes.
- Static demo data and hard-coded Nexus user/avatar/menu content.
- Placeholder search, notifications, settings, account switching, and help
  controls without real product behavior.
- The Nexus landing page; public landing pages come from `tdbinh`.
- Nexus authentication forms as authentication logic. They may inform styling
  after the real authentication flow is selected.
- `Rightbar` theme playground, footer, FilePond, ApexCharts, Swiper, Cally, or
  SimpleBar unless a real accepted feature needs them. Prefer native scrolling
  before keeping SimpleBar.

### Adaptation requirements

- Replace the large demo menu with Projects globally and Keywords/Articles for
  the active Project.
- Replace Nexus logo/metadata/user identity with ANMISOFT and the authenticated
  owner.
- Remove direct DOM/time-delay behavior where a simpler React/CSS solution is
  reliable.
- Recheck every copied component against the chosen Next.js version and its
  bundled local documentation.
- Restore strict lint rules that Nexus disables unless a documented exception
  is genuinely required.
- Use accessible buttons/links, focus restoration, menu semantics, and mobile
  drawer behavior.
- Add component tests for active route, project navigation, mobile open/close,
  keyboard interaction, and sign-out.
- Add a provenance header or `THIRD_PARTY_NOTICES.md` entry identifying adapted
  Nexus/daisyUI template code and the local license.

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
- [Admin shell](../src/backoffice/components/layout/admin-shell.tsx)
- [Admin navigation](../src/backoffice/config/navigation.ts)
- [Backoffice styles](../src/backoffice/styles/backoffice.css)
- [Third-party notices](../THIRD_PARTY_NOTICES.md)

These targets may not exist yet. Create them only when implementing this plan.

## Implementation order

1. Select the target repository and create one clean Next.js application.
2. Align stable package versions from the two legacy applications.
3. Configure formatting, lint with no warnings, type checking, Vitest, React
   tests, and production build.
4. Add Tailwind CSS 4, DaisyUI 5, and only the Nexus dependencies retained by
   the approved adoption list.
5. Copy/adapt the minimal Nexus admin shell and styles into `src/backoffice`;
   remove all demo navigation, data, branding, and unused features.
6. Add a dependency-boundary rule preventing public client code from importing
   server/editorial modules.
7. Implement typed server environment parsing.
8. Implement Firebase Admin and Firestore access.
9. Configure emulator or isolated development access.
10. Add the audit event schema/writer.
11. Create a minimal public placeholder and protected Nexus-based admin shell.
12. Add CI or one local `check` command that runs all required verification.

## Tangible output

- The application opens a public placeholder.
- An authenticated or temporary development-only admin gate opens the adapted
  Nexus-based ANMISOFT shell without demo screens or exposing credentials.
- An integration test writes and reads one audit event using the test Firestore
  environment.

Do not create fake Project, Keyword, or Article product data in this increment.

## Verification

- Missing Firebase settings fail with a clear server error.
- Client bundles cannot import the Firebase Admin module.
- Production bundles do not import files from `/nexus`.
- No unused Nexus demo dependency remains in `package.json`.
- Sidebar works with keyboard and responsive mobile behavior.
- Nexus branding, fake account data, and demo menu items are absent.
- Audit schema rejects sensitive/non-supported detail values.
- Test Firestore does not touch production.
- Formatting, lint, type checking, tests, and build pass from a clean checkout.

## Done when

- The target application is the agreed implementation home.
- Public/admin boundaries are demonstrable.
- The owned backoffice shell visually follows Nexus/DaisyUI and is maintainable
  without the local template directory.
- Firestore integration tests run safely.
- The project has one successful all-check command.
- No legacy feature code has been bulk copied.

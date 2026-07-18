# 05.03 — Landing Pages and Cutover

Status: Not started

## Outcome

The new application preserves the useful landing/support/legal experience from
`tdbinh`, migrates required legacy data, and safely replaces both legacy
applications in production.

## Depends on

- [Localization and SEO](./02-search-localization-seo.md)
- All previous plans complete in staging.

## Firestore migration ownership

This feature does not introduce a product collection. It owns one-off,
idempotent migration tools that call feature-owned validation/write contracts.

Legacy mapping:

| Legacy data | New destination |
| --- | --- |
| Project | Project document including optional `canonicalBaseUrl` |
| Keywords/groups | Keyword-owned documents |
| Discoveries | Discovery request and ordered results |
| Unpublished Article | Article with `status: draft` |
| Published valid Article | Article with `status: published` |
| Draft translation | Translation with `status: draft` |
| Approved eligible translation | Translation with `status: approved` under its Article |
| Invalid published record | Quarantine report; do not mark it published |

Migration records legacy ID and migration version. Re-running creates no
duplicates or extra publication events.

## Public behavior

Adapt from `tdbinh`:

- Useful shared components such as article cards or a header, only where actual
  reuse exists.
- Independent landing pages, site layouts, theme files, headers, navigation,
  footers, and assets for each product.
- Support, Privacy, and Terms routes.
- Canonical domain behavior for dedicated deployments.
- Existing assets under stable paths.

Initial Project scope:

- `subiq`: preserve/adapt its complete landing, Blog, localization, and legal
  experience.
- `jewelry-identifier`: preserve legal/support routes, then implement its own
  landing, theme, assets, and shared Blog capability when supplied.
- `skylens`: preserve legal/support routes, then implement its own landing,
  theme, assets, and shared Blog capability when supplied.
- `urge-zero`: preserve legal/support routes, then implement its own landing,
  theme, assets, and shared Blog capability when supplied.

Each product may deploy from the same repository to its dedicated service/domain
using an explicit `PUBLIC_PROJECT_ID` and route-prefix configuration. The main
ANMISOFT deployment may continue serving `/{projectId}` legacy paths. A service
configured for one Project must fail clearly for an unknown Project ID; it must
never default to SubIQ.

Do not build a page editor, template registry, renderer switch, landing schema,
or database-driven header/navigation system. Each explicit route imports its
own site layout and landing page. A site may reuse shared components or write
its own component when its design differs.

## Minimal theme contract

Shared public components may use semantic CSS variables defined with safe
defaults in `src/public-site/styles/theme-contract.css`:

```css
:root {
  --site-background: #ffffff;
  --site-surface: #f8fafc;
  --site-text: #0f172a;
  --site-muted-text: #64748b;
  --site-primary: #2563eb;
  --site-primary-text: #ffffff;
  --site-border: #e2e8f0;
  --site-radius: 0.75rem;
}
```

Each site scopes overrides from its own theme file:

```css
.subiq-site {
  --site-primary: #6366f1;
  --site-primary-text: #ffffff;
  --site-radius: 1rem;
}
```

Its `site-layout.tsx` applies the scope class. A shared component consumes only
the variables it needs. Add a token only when a real shared component requires
it, and keep text/background pairs accessible.

This contract contains no TypeScript theme object, registry, runtime resolver,
Firestore data, logo, navigation, content, section ordering, or layout rules.
A site-specific component may ignore the contract or add local CSS variables.

## Backoffice behavior

- New admin becomes the only writable editorial UI after cutover.
- Legacy `seo-pipe-lite` becomes read-only during stabilization, then is
  decommissioned after approval.
- Migration exceptions are resolved before final delta migration.

## AI behavior and prompt

None. Migration and cutover must be deterministic. AI may help developers
analyze reports, but no production migration decision is delegated to an AI
command.

## Planned implementation links

- [Shared public components](../../src/public-site/components/index.ts)
- [Theme contract](../../src/public-site/styles/theme-contract.css)
- [SubIQ theme](../../src/public-site/sites/subiq/theme.css)
- [SubIQ site layout](../../src/public-site/sites/subiq/site-layout.tsx)
- [SubIQ landing page](../../src/public-site/sites/subiq/landing-page.tsx)
- [SubIQ route](../../src/app/(public)/subiq/page.tsx)
- [Urge Zero route](../../src/app/(public)/urge-zero/page.tsx)
- [Migration scanner](../../scripts/migration/scan-legacy-data.ts)
- [Migration runner](../../scripts/migration/migrate-legacy-data.ts)
- [Reconciliation](../../scripts/migration/reconcile-migration.ts)
- [Cutover runbook](../../docs/operations/cutover-runbook.md)

## Implementation order

1. Inventory current public URLs, assets, metadata, environment variables,
   Firestore indexes, and deployment route prefixes.
2. Adapt SubIQ's route, site layout, theme, landing, support, and legal pages;
   define only the theme tokens required by the first real shared components.
3. Extract a shared component only when another real site needs the same
   behavior; implement each remaining approved project route directly.
4. Implement read-only legacy migration scanner/classification report.
5. Resolve slug, locale, invalid content, and publication ambiguities.
6. Implement idempotent migration by calling owning feature contracts.
7. Rehearse against isolated/staging data and reconcile counts and URLs.
8. Compare representative old/new screenshots, HTML semantics, metadata,
   sitemap, robots, search, and status codes for every Project.
9. Deploy/verify production indexes, least-privilege credentials, monitoring,
   and alerts.
10. Write and rehearse freeze, final delta, routing switch, smoke, and rollback.
11. Execute cutover, monitor, then make legacy admin read-only.
12. Decommission legacy services/credentials only after the observation window.

## Tangible output

- New public product domains serve landing, legal/support, and real Blog data.
- New admin is the sole editorial writer.
- Reconciliation report explains every migrated/quarantined record.
- A tested rollback remains available during stabilization.

## Verification

- Existing canonical URLs work or have approved redirects.
- All four initial Project IDs resolve their truthful enabled surfaces; missing
  landing/blog inputs remain explicit readiness gaps rather than 404 surprises
  caused by hard-coded SubIQ architecture.
- Dedicated-domain deployments resolve only their selected Project while the
  multi-project deployment keeps `/{projectId}` isolation.
- No legacy published article disappears without an explicit quarantine reason.
- No invalid/unpublished Article becomes public during migration.
- Old/new metadata, sitemap, robots, locale routes, and representative visuals
  match or have approved differences.
- Production public credentials cannot read editorial collections.
- Production admin/provider credentials are absent from public deployment.
- Rollback rehearsal succeeds without deleting new data.
- Formatting, lint, type checking, tests, and production builds pass.

## Done when

- Production traffic uses the new public application.
- SubIQ, Jewelry Identifier, SkyLens, and Urge Zero have an approved per-surface
  cutover status and no Project silently inherits another brand/config/data.
- New admin publishes a verified production change successfully.
- Monitoring remains healthy through the agreed observation window.
- Legacy applications are read-only or decommissioned with recovery recorded.

# 04.03 — Landing Pages and Cutover

Status: In progress

## Outcome

The new application preserves the SubIQ landing/support/legal experience from
`tdbinh`, migrates only required SubIQ legacy data, and safely replaces the
SubIQ public application in production. All other products remain untouched.

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

- Shared presentation primitives where actual reuse exists: site shell, header,
  footer, content shell, hero, section, heading, feature showcase, phone frame,
  store badges, FAQ, download CTA, and Blog presentation.
- One code-owned SubIQ presentation configuration and SubIQ-scoped theme. There
  is no registry or placeholder configuration for deferred products.
- Support, Privacy, and Terms routes.
- Canonical domain behavior for dedicated deployments.
- Existing assets under stable paths.

Initial Project scope is only `subiq`: port its current landing exactly, then
deliver its Blog, localization, support, privacy, terms, sitemap, and robots.
Jewelry Identifier, SkyLens, and Urge Zero are explicitly deferred and are not
cutover acceptance criteria.

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

Shared public components use semantic CSS variables with safe fallbacks in
their CSS modules:

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

`SiteShell` applies the configured scope class. A shared component consumes
only the variables it needs. Add a token only when a real shared component
requires it, and keep text/background pairs accessible.

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

- [Shared site components](../../src/public-site/components/site/index.ts)
- [Shared landing components](../../src/public-site/components/landing/index.ts)
- [SubIQ theme](../../src/public-site/sites/subiq/theme.css)
- [SubIQ presentation configuration](../../src/public-site/sites/subiq/site-config.ts)
- [SubIQ landing page](../../src/public-site/sites/subiq/landing-page.tsx)
- [SubIQ route](../../src/app/(public)/subiq/page.tsx)
- [Cutover runbook](../../docs/operations/cutover-runbook.md)

## Implementation order

1. Inventory current public URLs, assets, metadata, environment variables,
   Firestore indexes, and deployment route prefixes.
2. Adapt SubIQ's route, site layout, theme, landing, support, and legal pages;
   define only the theme tokens required by the first real shared components.
3. Preserve the already-proven shared `tdbinh` site shell, header, footer,
   landing primitives, and Blog presentation. Keep SubIQ artwork local.
4. Implement read-only legacy migration scanner/classification report.
5. Resolve slug, locale, invalid content, and publication ambiguities.
6. Implement idempotent migration by calling owning feature contracts.
7. Rehearse against isolated/staging data and reconcile counts and URLs.
8. Compare old/new SubIQ screenshots, HTML semantics, metadata, sitemap,
   robots, locale behavior, and status codes.
9. Deploy/verify production indexes, least-privilege credentials, monitoring,
   and alerts.
10. Write and rehearse freeze, final delta, routing switch, smoke, and rollback.
11. Execute cutover, monitor, then make legacy admin read-only.
12. Decommission legacy services/credentials only after the observation window.

## Tangible output

- The SubIQ domain serves landing, legal/support, and real Blog data.
- New admin is the sole editorial writer.
- Reconciliation report explains every migrated/quarantined record.
- A tested rollback remains available during stabilization.

## Verification

- Existing canonical URLs work or have approved redirects.
- Only SubIQ resolves in this phase. Unknown Project IDs fail explicitly and no
  other product silently inherits SubIQ presentation or data.
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
- SubIQ has an approved per-surface cutover status; other products remain
  recorded as deferred and untouched.
- New admin publishes a verified production change successfully.
- Monitoring remains healthy through the agreed observation window.
- Legacy applications are read-only or decommissioned with recovery recorded.

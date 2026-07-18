# 05.03 — Landing Pages and Cutover

Status: Not started

## Outcome

The new application preserves the useful landing/support/legal experience from
`tdbinh`, migrates required legacy data, and safely replaces both legacy
applications in production.

## Depends on

- [Search, Localization, and SEO](./02-search-localization-seo.md)
- All previous plans complete in staging.

## Firestore migration ownership

This feature does not introduce a product collection. It owns one-off,
idempotent migration tools that call feature-owned validation/write contracts.

Legacy mapping:

| Legacy data | New destination |
| --- | --- |
| Project | Project document/public-site association |
| Keywords/groups | Keyword-owned documents |
| Discoveries | Discovery metadata/candidates |
| Working/unpublished Article | Article working document only |
| Published valid Article | Working Article plus matching public source/locale documents |
| Draft translation | Private translation Draft |
| Approved eligible translation | Approved private translation and public document only if confirmed live |
| Invalid published record | Quarantine report; never create invalid public data |

Migration records legacy ID and migration version. Re-running creates no
duplicates or extra publication events.

## Public behavior

Adapt from `tdbinh`:

- Shared project site shell, route-prefix behavior, theme tokens, navigation,
  footer, badges, and locale selector.
- SubIQ landing page and configured product landing pages in approved scope.
- Support, Privacy, and Terms routes.
- Canonical domain behavior for dedicated deployments.
- Existing assets under stable paths.

Initial Project scope:

- `subiq`: preserve/adapt its complete landing, Blog, localization, and legal
  experience.
- `jewelry-identifier`: preserve legal/support routes, then add its real typed
  configuration, landing module, assets, and shared Blog capability when
  supplied.
- `skylens`: preserve legal/support routes, then add its real typed
  configuration, landing module, assets, and shared Blog capability when
  supplied.
- `urge-zero`: preserve legal/support routes, then add its real typed
  configuration, landing module, assets, and shared Blog capability when
  supplied.

Each product may deploy from the same repository to its dedicated service/domain
using an explicit `PUBLIC_SITE_ID` and route-prefix configuration. The main
ANMISOFT deployment may continue serving `/{projectId}` legacy paths. A service
configured for one Project must fail startup/build on an unknown/incomplete
production config; it must never default to SubIQ.

Do not build a generic page editor. Landing configuration/content remains
version-controlled in R1.

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

- [Site shell](../../src/public-site/components/site/site-shell.tsx)
- [Site registry](../../src/public-site/config/site-registry.ts)
- [SubIQ landing page](../../src/public-site/sites/subiq/subiq-landing-page.tsx)
- [Migration scanner](../../scripts/migration/scan-legacy-data.ts)
- [Migration runner](../../scripts/migration/migrate-legacy-data.ts)
- [Reconciliation](../../scripts/migration/reconcile-migration.ts)
- [Cutover runbook](../../docs/operations/cutover-runbook.md)

## Implementation order

1. Inventory current public URLs, assets, metadata, environment variables,
   Firestore indexes, and deployment route prefixes.
2. Adapt shared site system and SubIQ landing/support/legal pages.
3. Add remaining approved project public routes without copying shared code.
4. Implement read-only legacy migration scanner/classification report.
5. Resolve slug, locale, invalid content, and publication ambiguities.
6. Implement idempotent migration by calling owning feature contracts.
7. Rehearse against isolated/staging data and reconcile counts/hashes/URLs.
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
- Dedicated-domain deployments resolve only their configured Project while the
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

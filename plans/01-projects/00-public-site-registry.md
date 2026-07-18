# 01.00 — Public Site Registry

Status: Not started

## Outcome

The application can resolve a complete, validated public-site configuration by
`projectId` for SubIQ, Jewelry Identifier, SkyLens, Urge Zero, and future
products. Shared code contains no implicit SubIQ default.

## Depends on

- [Platform Foundation](../00-platform-foundation.md)
- [Projects Overall Plan](./PLAN.md)

## Firestore ownership

No Firestore document. Public identity, domains, routes, assets, enabled
surfaces, and stable topic URLs are deployment/source configuration in R1.

The Project Firestore document references one config through `publicSiteId`.
This prevents public domain and security behavior from being changed by an
untrusted browser write.

## Configuration contract

```ts
type PublicSiteConfig = {
  id: string
  displayName: string
  internalBasePath: `/${string}`
  canonicalOrigin: `https://${string}`
  defaultLocale: string
  locales: string[]
  capabilities: {
    landing: boolean
    blog: boolean
    localization: boolean
    legal: boolean
  }
  brand: {
    name: string
    wordmarkLead: string
    wordmarkAccent?: string
    logoSrc: string
    logoAlt: string
  }
  theme: SiteTheme
  navigation: SiteNavigationItem[]
  headerCta: SiteAction
  footer: SiteFooter
  storeBadges: SiteStoreBadge[]
  landing: {
    componentKey: string
  } | null
  blog: {
    titleLead: string
    titleAccent: string
    description: string
    postsPerPage: number
    defaultOgImage?: string
    topicRoutes: Array<{
      upstreamName: string
      slug: string
      labels: Record<string, string>
    }>
    installCta: BlogInstallCta
  } | null
}
```

Validation rules:

- `id` matches the Firestore Project/public route key.
- `internalBasePath` is exactly `/${id}`.
- Enabled public capabilities require their complete configuration.
- Canonical origin must be a real dedicated HTTPS origin before production
  enablement; do not invent domains.
- Asset paths begin with `/${id}/` and assets live under `public/${id}/`.
- Default locale appears in locales; locales use full language-region keys.
- Blog topic slugs are stable and unique within a Project.
- Store links are real or intentionally absent; never invent destinations.

## Initial registry

| ID | Existing `tdbinh` baseline | Target capability |
| --- | --- | --- |
| `subiq` | Landing, localized Blog, legal/support, assets/config | Full landing + Blog + localization + legal |
| `jewelry-identifier` | Legal/support routes; full typed site config not present | Independent landing + Blog + configured localization + legal |
| `skylens` | Legal/support routes; full typed site config not present | Independent landing + Blog + configured localization + legal |
| `urge-zero` | Legal/support routes; full typed site config not present | Independent landing + Blog + configured localization + legal |

Do not enable an incomplete surface with placeholder domain, assets, store
links, or text. The registry can represent a capability as disabled until its
real configuration is supplied, while the architecture and routes still
support it.

## Registry API

```ts
getPublicSiteConfig(projectId): PublicSiteConfig
listPublicSiteConfigs(): PublicSiteConfig[]
hasPublicCapability(projectId, capability): boolean
getProjectRoutePrefix(config, deployment): string
buildProjectCanonicalUrl(config, pathname): string
```

Unknown/disabled Project surfaces fail clearly rather than falling back to
SubIQ.

## Backoffice behavior

Project creation selects from configurations not already associated with an
active editorial Project. The selector shows brand name, ID, configured domain,
locales, and enabled capabilities.

## Public behavior

Generic public route/service code receives `projectId`, resolves the registry,
checks the requested capability, and renders the matching project presentation.
Product-specific landing artwork lives in its registered landing module; shared
Blog behavior is not copied per project.

## AI behavior and prompt

None. Site identity/configuration is explicit owner/source-controlled data.

## Planned implementation links

- [Registry contract](../../src/public-site/config/public-site-config.ts)
- [Registry](../../src/public-site/config/site-registry.ts)
- [SubIQ config](../../src/public-site/config/sites/subiq.ts)
- [Jewelry Identifier config](../../src/public-site/config/sites/jewelry-identifier.ts)
- [SkyLens config](../../src/public-site/config/sites/skylens.ts)
- [Urge Zero config](../../src/public-site/config/sites/urge-zero.ts)
- [Registry tests](../../src/public-site/config/site-registry.test.ts)

## Implementation order

1. Adapt and generalize the `tdbinh` site/blog configuration contracts.
2. Remove SubIQ-specific dictionary types from shared Blog component contracts.
3. Implement strict registry validation and route/canonical helpers.
4. Adapt the complete SubIQ configuration as the reference.
5. Inventory real domains, locales, assets, store links, landing/legal content,
   and blog topics for Jewelry Identifier, SkyLens, and Urge Zero.
6. Add each real configuration; mark only genuinely incomplete capabilities
   disabled rather than filling placeholders.
7. Add configuration contract tests for every registered Project.
8. Add a guard test proving unknown Project IDs never resolve to SubIQ.

## Tangible output

`listPublicSiteConfigs()` returns four validated, independently identified
products. Each config truthfully states which public surfaces are ready.

## Verification

- All IDs, base paths, asset prefixes, domains, locale sets, and topic slugs are
  validated.
- Duplicate ID/domain/topic slug fails at build/test time.
- Unknown Project/capability returns an explicit unavailable result.
- Shared Blog/site services contain no hard-coded `subiq` import.
- Formatting, lint, type checking, tests, and build pass.

## Done when

- The four initial product configs are registered without fake values.
- At least SubIQ is fully enabled.
- Missing information for other products is an explicit capability gap, not an
  architectural limitation.
- Project Management can safely associate Firestore Projects with configs.


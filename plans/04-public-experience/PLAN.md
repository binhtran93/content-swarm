# Public Experience — Overall Plan

Status: In progress

## Goal

Port the current SubIQ public presentation from `tdbinh` without redesign,
render real published Articles directly, preserve SubIQ URLs/SEO, and cut over
without exposing drafts or the backoffice. Other products are deferred.

## Reader journey

```text
Open product domain
→ Understand product or browse Blog
→ Browse real published articles
→ Open source or exact translated article
→ Read safe MDX content
→ Follow install/support action
```

## Ownership

Public Experience owns:

- Public route composition, shared components, and styling.
- Server-only read adapters for published Articles and approved Translations.
- Blog archive, locale fallback, SEO, sitemap, and robots behavior.
- Landing/support/legal page adaptation and production routing.
- The explicit SubIQ routes, landing page, layout, theme, header, footer, and
  assets. Jewelry Identifier, SkyLens, and Urge Zero are outside this phase.

It owns no editorial Firestore document and performs no product-data write.

## Data flow

Inputs:

- Project-owned canonical base URL used by published metadata.
- Site-specific presentation and content implemented directly in code.
- Published Articles and their approved Translations.

Outputs:

- Public HTML, metadata, JSON-LD, sitemap, robots, and stable routes.
- No data or control path back into editorial features.

## Implementation sequence

1. Port the SubIQ landing foundation and static routes from
   [Landing Pages and Cutover](./03-landing-pages-and-cutover.md).
2. [Public Blog](./01-public-blog.md)
3. [Localization and SEO](./02-search-localization-seo.md)
4. Complete the SubIQ migration and production steps in
   [Landing Pages and Cutover](./03-landing-pages-and-cutover.md).

## Shared rules

- No fake fixture is used when real published test/staging data exists.
- Public code never imports backoffice components, prompts, or write services.
- Public Article services are server-only, read-only, and require
  `status == published`.
- A Translation also requires `status == approved` and a published parent.
- The page owns H1; MDX owns body only.
- Exact approved locale wins; otherwise show only the declared source with a
  clear noindex fallback.
- The Project document owns only the canonical base URL needed by publishing.
  Deployment routing controls whether and where each coded site is served.
- Existing canonical URLs are preserved or explicitly redirected.
- Project ID is explicit in each route; no route falls back to SubIQ.
- Shared public components are optional building blocks. They do not impose one
  landing structure or require database-driven header/page configuration.
- Shared components use only a small semantic CSS-variable theme contract.
  Every site owns scoped overrides in code and may use a site-specific component
  when the shared component does not fit.

## Final demonstration

Open the new SubIQ staging domain in shared-path and dedicated-root modes,
browse real published and translated Articles, verify metadata/sitemap/robots,
and run the cutover checklist against every existing SubIQ production route.

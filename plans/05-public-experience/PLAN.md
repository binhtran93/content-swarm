# Public Experience — Overall Plan

Status: Not started

## Goal

Adapt the best public presentation from `tdbinh` into one multi-project public
platform that reads only real sanitized published data, preserves each
product’s URLs/SEO, and cuts over without exposing the backoffice.

## Reader journey

```text
Open product domain
→ Understand product or browse Blog
→ Filter/search real published articles
→ Open source or exact translated article
→ Read safe MDX and related content
→ Follow install/support action
```

## Ownership

Public Experience owns:

- Public route composition, shared components, and styling.
- Read-only query adapters for `publicArticles` and `publicSlugs`.
- Blog archive, search, locale fallback, SEO, sitemap, and robots behavior.
- Landing/support/legal page adaptation and production routing.
- Explicit per-project routes, landing pages, layouts, themes, headers, footers,
  and assets for SubIQ, Jewelry Identifier, SkyLens, and Urge Zero.

It owns no editorial Firestore document and performs no product-data write.

## Data flow

Inputs:

- Project-owned canonical base URL used by published metadata.
- Site-specific presentation and content implemented directly in code.
- Sanitized `publicArticles` and `publicSlugs` written by Publishing.

Outputs:

- Public HTML, metadata, JSON-LD, sitemap, robots, and stable routes.
- No data or control path back into editorial features.

## Implementation sequence

1. [Public Blog](./01-public-blog.md)
2. [Search, Localization, and SEO](./02-search-localization-seo.md)
3. [Landing Pages and Cutover](./03-landing-pages-and-cutover.md)

## Shared rules

- No fake fixture is used when real published test/staging data exists.
- Public code never imports Article Authoring or admin modules.
- Public article queries are read-only and limited to public collections.
- Only `publication.state == published` documents are visible.
- The page owns H1; MDX owns body only.
- Exact approved locale wins; otherwise show only the declared source with a
  clear noindex fallback.
- The Project document owns only the canonical base URL needed by publishing.
  Deployment routing controls whether and where each coded site is served.
- Existing canonical URLs are preserved or explicitly redirected.
- Project ID is explicit in each route; no route falls back to SubIQ.
- Shared public components are optional building blocks. They do not impose one
  landing structure or require database-driven header/page configuration.

## Final demonstration

Open the new SubIQ staging domain and at least one additional implemented product
domain. Confirm each has independent presentation/data, browse the real
published articles, verify metadata/sitemaps, and run the cutover checklist
against every existing production route.

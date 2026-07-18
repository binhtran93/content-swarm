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

- Public route composition, components, site configuration, and styling.
- Read-only query adapters for `publicArticles` and `publicSlugs`.
- Blog archive, search, locale fallback, SEO, sitemap, and robots behavior.
- Landing/support/legal page adaptation and production routing.
- Generic project route wrappers and per-project landing modules/configuration
  for SubIQ, Jewelry Identifier, SkyLens, Urge Zero, and future products.

It owns no editorial Firestore document and performs no product-data write.

## Data flow

Inputs:

- Version-controlled public-site configuration.
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
- Public credentials are read-only and limited to public collections/config.
- Only `publication.state == published` documents are visible.
- The page owns H1; MDX owns body only.
- Exact approved locale wins; otherwise show only the declared source with a
  clear noindex fallback.
- Public configuration owns canonical domain and route prefix.
- Existing canonical URLs are preserved or explicitly redirected.
- Project ID is always explicit; missing/unknown configuration never falls back
  to SubIQ.
- Shared Blog components receive project config/dictionary contracts and must
  not use SubIQ-specific types.

## Final demonstration

Open the new SubIQ staging domain and at least one additional configured product
domain. Confirm each has independent presentation/data, browse the real
published articles, verify metadata/sitemaps, and run the cutover checklist
against every existing production route.

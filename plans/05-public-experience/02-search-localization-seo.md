# 05.02 — Search, Localization, and SEO

Status: Not started

## Outcome

Readers can search and browse exact-locale content with controlled source
fallback, while search engines receive consistent canonical, hreflang, sitemap,
robots, and structured data.

## Depends on

- [Public Blog](./01-public-blog.md)
- At least one real published translation is strongly recommended.

## Firestore access and indexes

Exact-locale archive/search reads `publicArticles` only.

All queries begin from the requested Project’s `publicArticles` subcollection;
global collection-group search is not used unless it still enforces an exact
validated `projectId` boundary.

Localized archive merges two ordered streams:

1. `contentLocale == requestedLocale` exact published documents.
2. `isSource == true` source documents used only for Article IDs without an
   exact locale document.

Localized search uses the same streams with
`searchTokens array-contains normalizedQuery` and suppresses a source match when
an exact visible translation exists but did not match.

Cursor encodes independent boundaries for both streams. Exact totals may be
`null` when deduplication would require reading every document.

Required composite indexes are declared alongside the implemented queries:

- State + content locale + publication order.
- State + content locale + topic + publication order.
- State + content locale + search token + publication order.
- State + isSource + equivalent topic/search/order fields.

## Slug resolution and fallback

1. Resolve exact `publicSlugs/{requestedLocale--slug}`.
2. If missing, resolve a unique published source slug record.
3. If a valid exact translation now exists for the Article, redirect a
   locale-prefixed source slug to its translated slug.
4. Otherwise show the source with a localized fallback notice.

Publishing validation must prevent an ambiguous source-slug fallback within a
Project. If necessary, enforce source slug uniqueness across source locales.

## Public behavior

Routes:

```text
/{projectId}/{locale}/blog
/{projectId}/{locale}/blog/{slug}
```

Default locale omits the locale segment.

- Exact approved/published translation uses translated metadata/body/slug.
- Missing translation uses only declared source language, never nearby locale.
- Fallback is noindex, canonicalizes to source, and is absent from hreflang and
  localized sitemap.
- Search query/topic/cursors live in URL state.
- Search normalizes Unicode consistently with Publishing token computation.

SEO output:

- Title, description, canonical, robots, Open Graph/social image.
- Article/BlogPosting JSON-LD and breadcrumb JSON-LD.
- Source and approved public locale hreflang alternatives.
- Project sitemap containing only indexable same-site public URLs.
- Noindex and cross-domain canonical URLs excluded from sitemap.
- Project robots output.
- Independent canonical origin, topic routes, locale alternatives, sitemap, and
  robots output for every enabled Project.

## Backoffice behavior

Publish Preview already shows locale URLs and indexability. No new editorial
write behavior.

## AI behavior and prompt

None. Search, fallback, and SEO are deterministic public behavior.

## Planned implementation links

- [Localized queries](../../src/public-site/services/localized-public-blog-service.server.ts)
- [Search normalization](../../src/public-site/services/normalize-public-search.ts)
- [Locale resolver](../../src/public-site/services/resolve-public-locale.ts)
- [SEO helpers](../../src/public-site/seo/public-article-seo.ts)
- [Sitemap](../../src/app/(public)/[projectId]/sitemap.ts)
- [Localized routes](../../src/app/(public)/[projectId]/[locale]/blog/page.tsx)
- [SEO/locale tests](../../src/public-site/seo/public-article-seo.test.ts)

## Implementation order

1. Implement exact-locale archive and article projection.
2. Implement source fallback merge/dedupe and two-stream cursors.
3. Implement exact/fallback/redirect slug resolution.
4. Implement localized routes and language notice.
5. Implement exact and localized search.
6. Implement canonical/hreflang/robots/JSON-LD.
7. Implement source/localized sitemap.
8. Add/deploy exact indexes and backfill public search tokens if required.
9. Test source, exact translation, fallback, redirect, noindex, and canonical
   combinations.

## Tangible output

- Real source and translation public routes.
- Search results backed by real public search tokens.
- Valid metadata, JSON-LD, sitemap, and robots for the real published article.

## Verification

- Exact locale always wins over fallback.
- No unapproved/private translation can appear.
- Fallback carries correct notice/noindex/canonical and no hreflang entry.
- Multi-stream results dedupe Article IDs and paginate deterministically.
- Visible translation must itself match localized search.
- Sitemap contains no archived/noindex/external-canonical/fallback URL.
- Structured data agrees with visible content and public dates.
- Sitemap/robots/canonical generation for one Project contains no URL from
  another Project.
- Formatting, lint, type checking, tests, and build pass.

## Done when

- Source and at least one real locale journey pass end to end.
- SEO isolation tests cover at least two Project configurations.
- Search and SEO use only public documents/configuration.
- Required Firestore indexes are versioned and deployed in staging.

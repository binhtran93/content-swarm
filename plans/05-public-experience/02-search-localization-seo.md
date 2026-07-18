# 05.02 — Localization and SEO

Status: Not started

## Outcome

Readers can open approved translations of published Articles, while search
engines receive consistent canonical, hreflang, sitemap, robots, and structured
data.

Full-text search is intentionally outside R1. Firestore is not a full-text
search engine, and we will not add tokens, copied documents, or complicated
queries before search is a real requirement.

## Depends on

- [Public Blog](./01-public-blog.md)
- At least one approved Translation is recommended.

## Firestore access

The public service reads:

```text
projects/{projectId}/articles/{articleId}
projects/{projectId}/articles/{articleId}/translations/{locale}
projects/{projectId}/articleSlugs/{locale--slug}
```

The slug reservation identifies the Article for a source or translated slug;
it is not a second content document. The resolver must then verify that the
Article is published and, for a translated route, that the Translation is
approved. A reservation alone never makes content public.

For the initial small content set, localized archive pages may read a page of
published Articles and fetch their requested-locale Translation documents.
Optimize only after measured usage shows this is necessary.

## Locale behavior

Routes:

```text
/{projectId}/{locale}/blog
/{projectId}/{locale}/blog/{slug}
```

The default locale omits the locale segment.

- An approved Translation under a published Article uses its translated title,
  slug, excerpt, Content, SEO title, and SEO description.
- A draft Translation is never public.
- If an exact approved Translation is missing, show the source Article with a
  clear fallback notice.
- Fallback pages are `noindex`, canonicalize to the source URL, and do not
  appear in hreflang or a localized sitemap.
- No nearby or guessed locale is used.

## SEO output

- Title and description from the visible source or Translation.
- Canonical URL from the Project canonical base URL and actual route.
- `BlogPosting` and breadcrumb JSON-LD.
- Hreflang entries for the source and approved Translations only.
- Project sitemap containing only published, indexable URLs.
- Project robots output.

Every URL remains scoped to its Project. Presentation, routing, and landing
pages remain code-owned by each site.

## Backoffice behavior

Publish Preview shows the source and approved translated URLs. No extra public
copy or locale publication action exists.

## AI behavior and prompt

None. Localization rendering and SEO are deterministic. Translation AI belongs
to Article Authoring and only proposes private editable content.

## Planned implementation links

- [Get localized Article](../../src/public-site/services/get-localized-article.server.ts)
- [List localized Articles](../../src/public-site/services/list-localized-articles.server.ts)
- [Resolve public locale](../../src/public-site/services/resolve-public-locale.ts)
- [Article SEO](../../src/public-site/seo/article-seo.ts)
- [Sitemap](../../src/app/(public)/[projectId]/sitemap.ts)
- [Localized routes](../../src/app/(public)/[projectId]/[locale]/blog/page.tsx)
- [SEO and locale tests](../../src/public-site/seo/article-seo.test.ts)

Each service or main model file has one public export.

## Implementation order

1. Resolve source and translated slugs through existing slug reservations.
2. Enforce published parent and approved Translation checks.
3. Implement localized archive and Article routes.
4. Implement explicit source fallback and notice.
5. Implement canonical, hreflang, robots, and JSON-LD.
6. Implement source and localized sitemap entries.
7. Test source, exact translation, fallback, noindex, and cross-project cases.

## Tangible output

A real published source Article and approved Translation render at their own
URLs with correct metadata, without any copied public content document.

## Verification

- Exact approved Translation wins over fallback.
- Draft Translation and Translation under a non-published parent never render.
- Fallback has the correct notice, noindex, and source canonical.
- Sitemap and hreflang contain only actually public URLs.
- Structured data agrees with visible content.
- No Project emits another Project's URL or content.
- Formatting, lint, type checking, tests, and build pass.

## Done when

- Source and one real translated journey pass end to end.
- SEO isolation tests cover two Projects.
- No search-token or public-copy schema has been introduced.

# 03.04 — SEO

Status: Not started

## Outcome

The owner can save the Article title, slug, topic, excerpt, SEO title, and SEO
description. The application can derive whether the Article is ready to
publish; readiness is not stored as another status.

## Depends on

- [Content and AI Assistance](./03-content-ai.md)

## Firestore ownership

No new product collection. This feature updates only:

```text
title
slug
topic
excerpt
seoTitle
seoDescription
updatedAt
```

Slug reservations remain Project-scoped at:
`projects/{projectId}/articleSlugs/{locale--slug}`.

There is no featured image, canonical override, robots override, configurable
schema type, related-article selection, computed word count, or reading-time
field in R1.

## Commands and queries

- `saveArticleSeo(projectId, articleId, input)`.
- `reserveArticleSlug(projectId, articleId, sourceLocale, slug)`.
- `evaluateArticleReadiness(article)`.

Save updates only the supplied editorial fields and `updatedAt`. Slug changes
claim the new reservation and release the old reservation atomically.

Readiness is derived and requires:

- Active Project with a non-null canonical base URL.
- Selected Keyword still exists and is assigned to the Article.
- Non-empty title, valid slug, topic, excerpt, Content, SEO title, and SEO
  description.
- Content passes the MDX validator.

## Backoffice behavior

- Edit title, slug, topic, excerpt, SEO title, and SEO description.
- Show exact URL preview using the Project canonical base URL.
- Show character guidance without blocking valid intentional text solely by
  arbitrary score.
- Show readiness blockers derived from current saved fields.
- Save does not publish.

## Public behavior

None. Metadata remains working data until Publishing copies it.

## SEO derivation

Publishing and the public SEO helper derive behavior instead of storing more
editorial configuration:

- Canonical URL: Project canonical base URL plus the Article route.
- Robots: published source and exact translations are indexable; fallback pages
  are noindex; archived pages do not resolve normally.
- Structured-data type: always `BlogPosting`.
- Public `searchTokens`: generated during Publishing from final title, excerpt,
  and Content.

## AI behavior and prompt

None. The owner edits SEO metadata directly.

## Planned implementation links

- [SEO input](../../src/features/articles/model/article-seo-input.ts)
- [Save SEO](../../src/features/articles/service/save-article-seo.server.ts)
- [Reserve slug](../../src/features/articles/service/reserve-article-slug.server.ts)
- [Readiness](../../src/features/articles/service/evaluate-article-readiness.ts)
- [SEO editor](../../src/features/articles/backoffice/article-seo-editor.tsx)
- [Readiness tests](../../src/features/articles/service/evaluate-article-readiness.test.ts)

Each model or service file has one public export.

## Implementation order

1. Implement SEO input validation.
2. Implement Project-scoped slug reservation.
3. Implement single-field-group SEO save.
4. Implement deterministic readiness evaluation.
5. Implement SEO editor, URL preview, and blocker list.
6. Test duplicate slugs, invalid MDX/metadata, and cross-project isolation.

## Tangible output

A real Article with complete editorial and SEO fields for which
`evaluateArticleReadiness` returns ready.

## Verification

- Duplicate same-locale slug in one Project is rejected.
- The same slug may exist in another Project.
- Invalid metadata cannot pass readiness.
- Saving an already-published Article does not change its public snapshot.
- Formatting, lint, type checking, tests, and build pass.

## Done when

- One real SubIQ Article passes derived readiness.
- URL preview uses SubIQ's real canonical base URL.
- No public document exists until Publish.

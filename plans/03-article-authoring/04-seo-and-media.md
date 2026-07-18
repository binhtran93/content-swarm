# 03.04 — SEO and Media

Status: Not started

## Outcome

The source Article has complete structured metadata, stable slug, optional valid
featured image, related articles, computed search data, and editorial status
Ready.

## Depends on

- [Draft and Review AI](./03-draft-and-review-ai.md)

## Firestore ownership

### Working slug reservation

Path: `projects/{projectId}/articleSlugs/{localeKey--slug}`

```ts
type ArticleSlugDocument = {
  schemaVersion: 1
  articleId: string
  locale: string
  slug: string
  kind: "source" | "translation"
  updatedAt: Timestamp
}
```

Reservation and Article metadata save occur in one transaction. A slug is
unique per Project and locale.

This feature updates Article:

```text
title, slug, topic, excerpt
seo
featuredImage
relatedArticleIds
computed
editorialStatus
currentStep
revision
updatedAt
```

Derived server values:

- Search tokens from title, excerpt, topic, keywords, and SEO title.
- Word count from Review MDX plain text.
- Reading minutes using one documented words-per-minute rule.

## Commands

- `deriveArticleSeoDefaults(article)`; no persistence.
- `saveArticleMetadata(projectId, articleId, input, expectedRevision)`.
- `evaluateArticleReadiness(article)`.
- `searchRelatedArticleCandidates(projectId, articleId, query)`.

## Backoffice behavior

- Topic selection/addition from Project topics.
- Slug with real public URL preview.
- Excerpt, SEO title/description, schema type, robots, canonical override.
- Featured image URL, required dimensions, meaningful alt text, preview.
- Ordered related-article selection, same Project only.
- Derived word count, reading time, and search-token summary.
- Explicit `Save and mark Ready`; it does not Publish.

## Public behavior

None. Metadata remains working data until Publishing copies it.

## AI behavior and prompt

No new AI call in R1. Deterministic defaults are derived from saved content.
The owner edits them. Do not add an SEO-generation call that duplicates Article
writing without a demonstrated need.

## Readiness rules

Source is Ready only when:

- Active Project/public-site configuration exists.
- Title, valid slug, topic, excerpt, and source locale exist.
- Review MDX exists and passes current validation.
- SEO title/description resolve to non-empty values.
- Canonical override is null or absolute HTTP(S).
- Featured image is absent or has safe URL, alt, width, and height.
- Related IDs are same-project and exclude self.
- Computed values are current for Review/title/metadata.

## Planned implementation links

- [SEO input](../../src/features/articles/model/article-seo-input.ts)
- [Slug reservation](../../src/features/articles/service/reserve-article-slug.server.ts)
- [Derived metadata](../../src/features/articles/service/derive-article-metadata.ts)
- [Readiness](../../src/features/articles/service/evaluate-article-readiness.ts)
- [Metadata service](../../src/features/articles/service/save-article-metadata.server.ts)
- [SEO editor](../../src/backoffice/features/articles/article-seo-editor.tsx)
- [Readiness tests](../../src/features/articles/service/evaluate-article-readiness.test.ts)

## Implementation order

1. Implement slug normalization/reservation with concurrency tests.
2. Implement deterministic defaults/computed data.
3. Implement readiness evaluator returning field-level blockers.
4. Implement transactional metadata save.
5. Implement SEO/media editor and public URL preview.
6. Implement related-article query/ordered selection.
7. Test canonical, image, topic, relation, and computed-data edge cases.

## Tangible output

A real source Article with `editorialStatus: "ready"` and a complete
`getPublicationCandidate` source result. It remains absent from
`publicArticles`.

## Verification

- Concurrent same-locale slug saves produce one winner.
- Invalid metadata cannot mark Ready.
- Valid deterministic defaults can be edited.
- Working save on an already-published Article does not touch public data.
- Related articles cannot cross Project or self-link.
- No public document is created.
- Formatting, lint, type checking, tests, and build pass.

## Done when

- One real SubIQ source Article is Ready.
- Readiness report has no blocker.
- Publishing can build a source candidate without querying UI state.

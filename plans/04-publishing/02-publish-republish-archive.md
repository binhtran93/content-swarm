# 04.02 — Publish, Republish, and Archive

Status: Not started

## Outcome

Explicit owner commands atomically publish, republish, add approved locales, or
archive sanitized public documents. Real public data is now available for the
frontend.

## Depends on

- [Public Snapshot](./01-public-snapshot.md)

## Firestore ownership

Writes:

- `publicArticles/{articleId--locale}`.
- `publicSlugs/{locale--slug}`.
- Article `status`.

The application-level publication transaction orchestrates these feature-owned
updates. No UI route writes Firestore directly.

Required indexes for public data are finalized with Public Experience queries,
not guessed here.

## Commands

- `publishArticle(projectId, articleId, locales)`.
- `republishArticle(...)` using the same authoritative candidate builder.
- `publishAdditionalLocales(...)` for an already-public source.
- `archiveArticle(projectId, articleId)`.

### First publish transaction

- Re-read and rebuild candidate.
- Verify/claim public slug documents.
- Write selected locale public documents.
- Set Article `status = published`.

### Republish transaction

- Preserve original `publishedAt`.
- Replace selected/current locale public documents.
- Archive/remove public locale documents no longer selected only after explicit
  owner understanding.
- Update public `updatedAt`.

### Archive transaction

- Set public documents `status = archived`.
- Remove active public slug mappings.
- Set Article `status = archived`.
- Retain sanitized documents for recovery/inspection.

If Firestore operation limits make one transaction impossible, redesign the
bounded aggregate or use a safe staged/idempotent protocol before implementation.
Do not accept partial public locale state casually.

## Backoffice behavior

- Publish/Republish confirmation names affected URLs/locales.
- Disable duplicate submission and show progress.
- Success shows public links.
- Failure preserves previous public version and working data.
- Archive requires confirmation and explains loss of public access.
- Article list shows Draft, Published, and Archived. R1 does not add a separate
  unpublished-changes indicator.

## Public behavior

Only the read service is added here for verification:

- `getPublicArticle(projectId, publicArticleId)`.
- `resolvePublicSlug(projectId, locale, slug)`.

Full routes/UI come next.

## AI behavior and prompt

None. AI cannot decide or trigger publication.

## Planned implementation links

- [Publish command](../../src/features/articles/publishing/service/publish-article.server.ts)
- [Republish command](../../src/features/articles/publishing/service/republish-article.server.ts)
- [Archive command](../../src/features/articles/publishing/service/archive-article.server.ts)
- [Get Public Article](../../src/features/articles/publishing/service/get-public-article.server.ts)
- [Resolve Public Slug](../../src/features/articles/publishing/service/resolve-public-slug.server.ts)
- [Publish controls](../../src/features/articles/backoffice/publishing/publish-controls.tsx)
- [Transaction tests](../../src/features/articles/publishing/service/publish-article.test.ts)

## Implementation order

1. Implement the two single-export public read services.
2. Implement first-publish transaction.
3. Implement the Article publication update contract.
4. Implement Republish and locale-add behavior.
5. Implement Archive.
6. Implement admin confirmations/results and list labels.
7. Add atomicity, conflict, retry, concurrency, and rollback tests.
8. Publish the real validated SubIQ Article in development/staging.

## Tangible output

Real sanitized Firestore records:

```text
projects/{projectId}/publicArticles/{articleId}--en-us
projects/{projectId}/publicArticles/{articleId}--vi-vn   (when selected)
projects/{projectId}/publicSlugs/en-us--{slug}
projects/{projectId}/publicSlugs/vi-vn--{slug}
```

The Public Experience must use these records instead of fake fixtures or
editorial Article documents.

## Verification

- First publish creates all expected source/locale public documents atomically.
- Working Content edit after publish leaves public Content unchanged.
- Republish updates Content and `updatedAt` but preserves original
  `publishedAt`.
- Publishing does not modify Keyword documents.
- Archive removes slug resolution and active public queries.
- Failed commands keep previous public version complete.
- Public read credential/service cannot read editorial collections.
- Cross-project Article IDs, slugs, and locale selections are
  rejected; the same locale slug may publish independently in two Projects.
- Formatting, lint, type checking, tests, and build pass.

## Done when

- Real public data exists without fake fixtures.
- At least two Projects are covered by publication isolation tests.
- Snapshot isolation is proven in an integration test and manual demonstration.
- Public Experience can begin entirely from the public read contract.

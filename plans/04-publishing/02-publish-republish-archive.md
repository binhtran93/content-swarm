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
- Article `publication` summary fields through the Article-owned publication
  update contract.
- Keyword Used fields through the Keyword-owned first-publish contract.
- One append-only audit event.

The application-level publication transaction orchestrates these feature-owned
updates. No UI route writes Firestore directly.

Required indexes for public data are finalized with Public Experience queries,
not guessed here.

## Commands

- `publishArticle(projectId, articleId, expectedRevision, locales)`.
- `republishArticle(...)` using the same authoritative candidate builder.
- `publishAdditionalLocales(...)` for an already-public source.
- `archiveArticle(projectId, articleId, expectedPublicRevision)`.

### First publish transaction

- Re-read and rebuild candidate.
- Verify no stale revision.
- Verify/claim public slug documents.
- Write selected locale public documents.
- Set Article `publication.state = published`, original `publishedAt`, current
  published revision, and content update time.
- Mark snapshotted keywords Used once.
- Write success audit event.

### Republish transaction

- Preserve original `publishedAt`.
- Replace selected/current locale public documents.
- Archive/remove public locale documents no longer selected only after explicit
  owner understanding.
- Increment public revision and update `contentUpdatedAt`.
- Do not repeat first-publish Keyword Used effects.

### Archive transaction

- Set public documents `publication.state = archived`.
- Remove active public slug mappings.
- Set Article publication summary Archived.
- Retain sanitized documents and audit history for recovery/inspection.

If Firestore operation limits make one transaction impossible, redesign the
bounded aggregate or use a safe staged/idempotent protocol before implementation.
Do not accept partial public locale state casually.

## Backoffice behavior

- Publish/Republish confirmation names affected URLs/locales.
- Disable duplicate submission and show progress.
- Success shows public links and public revision.
- Stale preview redirects back to refreshed preview.
- Failure preserves previous public version and working data.
- Archive requires confirmation and explains loss of public access.
- Article list shows Published, Published with unpublished changes, and Archived.

## Public behavior

Only the read service is added here for verification:

- `getPublicArticleById(projectId, publicArticleId)`.
- `resolvePublicSlug(projectId, locale, slug)`.

Full routes/UI come next.

## AI behavior and prompt

None. AI cannot decide or trigger publication.

## Planned implementation links

- [Publish command](../../src/features/articles/publishing/service/publish-article.server.ts)
- [Republish command](../../src/features/articles/publishing/service/republish-article.server.ts)
- [Archive command](../../src/features/articles/publishing/service/archive-article.server.ts)
- [Public read service](../../src/features/articles/publishing/service/public-article-reader.server.ts)
- [Publish controls](../../src/features/articles/backoffice/publishing/publish-controls.tsx)
- [Transaction tests](../../src/features/articles/publishing/service/publish-article.test.ts)

## Implementation order

1. Implement read-only public article/slug service.
2. Implement first-publish transaction with optimistic revision.
3. Implement Keyword Used and Article publication update contracts.
4. Implement Republish and locale-add behavior.
5. Implement Archive.
6. Implement admin confirmations/results and list labels.
7. Add atomicity, conflict, retry, stale, concurrency, and rollback tests.
8. Publish the real Ready SubIQ Article in development/staging.

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
- Working Review edit after publish leaves public body/hash unchanged.
- Stale confirmation writes nothing.
- Republish updates body/hash/update time but preserves original publish time.
- First publish marks keyword snapshots Used exactly once.
- Archive removes slug resolution and active public queries.
- Failed commands keep previous public version complete.
- Public read credential/service cannot read editorial collections.
- Cross-project Article IDs, slugs, related IDs, and locale selections are
  rejected; the same locale slug may publish independently in two Projects.
- Formatting, lint, type checking, tests, and build pass.

## Done when

- Real public data exists without fake fixtures.
- At least two configured Projects are covered by publication isolation tests.
- Snapshot isolation is proven in an integration test and manual demonstration.
- Public Experience can begin entirely from the public read contract.

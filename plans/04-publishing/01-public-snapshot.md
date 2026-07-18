# 04.01 — Public Snapshot

Status: Not started

## Outcome

Publishing can validate the current Article and selected approved Translations,
then build exact sanitized public documents for preview. No public write occurs
in this increment.

## Depends on

- [Article Authoring](../03-article-authoring/PLAN.md)
- [Publishing Overall Plan](./PLAN.md)

## Firestore ownership

This file defines the public contract that the next increment persists.

Path:
`projects/{projectId}/publicArticles/{articleId}--{normalizedLocale}`

```ts
type PublicArticleDocument = {
  schemaVersion: 1
  articleId: string
  sourceLocale: string
  contentLocale: string
  isSource: boolean
  slug: string
  title: string
  excerpt: string
  topic: string
  content: string
  seoTitle: string
  seoDescription: string
  searchTokens: string[]
  status: "published" | "archived"
  publishedAt: Timestamp
  updatedAt: Timestamp
}
```

There is one public document per published locale. `searchTokens` are generated
during Publishing from final title, excerpt, and Content for the simple
Firestore-backed public search. They are not stored in the working Article or
Translation.

Canonical URL, robots behavior, and `BlogPosting` structured data are derived
by public SEO code. The public document has no featured image, Brief, Outline,
prompt data, keyword provider data, revision, hash, configurable schema type,
canonical override, robots override, related IDs, reading time, or word count.

### Public slug

Path: `projects/{projectId}/publicSlugs/{localeKey--slug}`

```ts
type PublicSlugDocument = {
  schemaVersion: 1
  publicArticleId: string
  updatedAt: Timestamp
}
```

The document ID already contains locale and slug. `publicArticleId` points to
the exact public source/translation snapshot.

## Candidate builder

`buildPublicationCandidate(projectId, articleId, locales)`:

1. Loads the active Project and requires `canonicalBaseUrl`.
2. Loads the Article and validates its current required fields and MDX.
3. Resolves the assigned Keyword/Group for validation only.
4. Loads only explicitly selected approved Translation documents.
5. Confirms source and translated slug reservations.
6. Generates public search tokens.
7. Produces exact public documents, slug documents, and URLs without writing.

Preview and Confirm both rebuild from current Firestore data. There is no
expected revision or content hash in R1.

## Backoffice behavior

Publish Preview displays:

- First Publish or Republish.
- Exact source and selected locale URLs.
- Title, excerpt, topic, SEO title, and SEO description.
- Derived canonical URL, robots behavior, and structured-data type.
- Blocking validation errors.

Preview performs no public Firestore write.

## Public behavior

None yet. This increment only proves the public data contract.

## AI behavior and prompt

None. Publishing is deterministic.

## Planned implementation links

- [Public Article document](../../src/features/articles/publishing/model/public-article-document.ts)
- [Public Slug document](../../src/features/articles/publishing/model/public-slug-document.ts)
- [Publication candidate](../../src/features/articles/publishing/model/publication-candidate.ts)
- [Build candidate](../../src/features/articles/publishing/service/build-publication-candidate.server.ts)
- [Publish preview](../../src/features/articles/backoffice/publishing/publish-preview.tsx)
- [Candidate tests](../../src/features/articles/publishing/service/build-publication-candidate.test.ts)

Each model or service file has one public export.

## Implementation order

1. Implement Public Article and Slug schemas.
2. Implement deterministic search-token generation.
3. Implement Article and Translation validation for Publishing.
4. Implement candidate construction and exact URL derivation.
5. Implement Publish Preview.
6. Test source-only, selected approved locales, invalid MDX, and duplicate slugs.

## Tangible output

A previewable candidate for one real Article and its selected approved
Translations, with no public Firestore write.

## Verification

- Incomplete working data is rejected with clear blockers.
- Unapproved Translations are rejected.
- The same current Firestore data produces the same content fields.
- Search tokens are deterministic.
- Preview writes nothing publicly.
- Formatting, lint, type checking, tests, and build pass.

## Done when

- The owner can preview the exact source public document.
- At least one approved Translation can be included optionally.
- No private authoring fields appear in the candidate.

# 04.01 — Public Snapshot

Status: Not started

## Outcome

Publishing can build and preview deterministic sanitized public documents from
one exact Ready Article revision. No Firestore public write occurs yet.

## Depends on

- [Article Authoring](../03-article-authoring/PLAN.md)
- [Publishing Overall Plan](./PLAN.md)

## Firestore ownership

This file defines the public document contract that the next file persists.

Path pattern:
`projects/{projectId}/publicArticles/{articleId}--{normalizedLocale}`

```ts
type PublicArticleDocument = {
  schemaVersion: 1
  projectId: string
  articleId: string
  sourceLocale: string
  contentLocale: string
  isSource: boolean
  slug: string
  title: string
  excerpt: string
  topic: string
  bodyMdx: string
  featuredImage: {
    url: string
    alt: string
    width: number
    height: number
  } | null
  seo: {
    title: string
    description: string
    canonicalUrlOverride: string | null
    robotsOverride: "index" | "noindex" | null
    schemaType: "Article" | "BlogPosting"
  }
  keywordTerms: string[]
  searchTokens: string[]
  relatedArticleIds: string[]
  localeSlugs: Record<string, string>
  publication: {
    state: "published" | "archived"
    publishedAt: Timestamp
    contentUpdatedAt: Timestamp
    publicRevision: number
    sourceRevision: number
    contentHash: string
  }
}
```

There is one public document per published locale. This keeps archive/search
queries simple and avoids putting every translated MDX body into one Firestore
document.

### Public slug

Path: `projects/{projectId}/publicSlugs/{localeKey--slug}`

```ts
type PublicSlugDocument = {
  schemaVersion: 1
  projectId: string
  articleId: string
  publicArticleId: string
  locale: string
  slug: string
  updatedAt: Timestamp
}
```

The public document contains no Brief, Outline, Draft, prompt versions, owner
description, provider payload, workflow state, or private translation data.

## Candidate builder

`buildPublicationCandidate(projectId, articleId, expectedRevision, locales)`:

1. Loads the active Project and requires its `canonicalBaseUrl`.
2. Loads Article and requested Translation documents through Article contracts.
3. Confirms expected revision and current readiness.
4. Revalidates Review/translation MDX and metadata.
5. Confirms source/translation working slug reservations.
6. Includes only approved translations tied to the current source hash.
7. Derives public dates/revision inputs without writing them.
8. Produces source/locale `PublicArticleDocument` candidates and exact URLs.

Candidate output is serializable and safe to show in admin preview.

The canonical URL comes from the Project document. Article and translation data
provide locale and topic information. Candidate construction must not import
SubIQ presentation code directly.

## Backoffice behavior

Publish Preview displays:

- First Publish or Republish.
- Exact source and selected locale URLs.
- Source revision and content hashes.
- Title, excerpt, topic, image, metadata, canonical/robots, related IDs.
- Blocking readiness errors and non-blocking warnings.
- Difference summary against existing public documents when republishing.

No Confirm button is enabled with blockers or stale expected revision.

## Public behavior

None. This increment proves the data contract but writes no public documents.

## AI behavior and prompt

None. Publishing is deterministic and must never ask AI to repair candidate
content silently.

## Planned implementation links

- [Public article schema](../../src/features/articles/publishing/model/public-article-document.ts)
- [Public slug schema](../../src/features/articles/publishing/model/public-slug-document.ts)
- [Candidate builder](../../src/features/articles/publishing/service/build-publication-candidate.server.ts)
- [Candidate result](../../src/features/articles/publishing/model/publication-candidate.ts)
- [Publish preview](../../src/features/articles/backoffice/publishing/publish-preview.tsx)
- [Candidate tests](../../src/features/articles/publishing/service/build-publication-candidate.test.ts)

## Implementation order

1. Implement strict public schemas and serialization.
2. Implement Article publication-candidate read contract.
3. Implement deterministic locale public-document projection.
4. Implement blockers/warnings and exact URL construction.
5. Implement republish comparison summary.
6. Implement Publish Preview UI.
7. Add public-data leakage and hostile-MDX candidate tests.

## Tangible output

A previewable in-memory/serialized candidate for the real Ready Article and its
selected translation, matching the exact documents Publishing will write.

## Verification

- Candidate contains no editorial-only fields.
- Stale Article revision/hash is rejected.
- Draft/Stale translation cannot enter candidate.
- Invalid current MDX/slug/image/canonical blocks candidate.
- Same inputs produce the same content fields/hashes.
- Two Projects using the same slug build independent URLs/documents.
- Candidate config/branding belongs to its requested Project only.
- Candidate preview performs no public Firestore write.
- Formatting, lint, type checking, tests, and build pass.

## Done when

- The owner can preview the exact real candidate.
- Candidate passes strict public schema validation.
- The next command can persist it without rebuilding data in the browser.

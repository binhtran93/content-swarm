# 03.01 — Article Creation

Status: Not started

## Outcome

The owner can list articles and create one real working Article from exactly one
unused Backlog topic. The next step receives an immutable keyword snapshot.

## Depends on

- [Keyword Research](../02-keyword-research/PLAN.md)
- [Article Authoring Overall Plan](./PLAN.md)

## Firestore ownership

Path: `projects/{projectId}/articles/{articleId}`

```ts
type ArticleDocument = {
  schemaVersion: 1
  projectId: string
  sourceLocale: string
  keywordSnapshot: {
    topicRowId: string
    capturedAt: Timestamp
    primary: ArticleKeywordSnapshot
    supporting: ArticleKeywordSnapshot[]
  }
  title: string | null
  slug: string | null
  topic: string | null
  excerpt: string | null
  brief: { source: string; hash: string } | null
  outline: { source: string; hash: string } | null
  draft: { mdx: string; hash: string } | null
  review: { mdx: string; hash: string } | null
  seo: {
    title: string | null
    description: string | null
    canonicalUrlOverride: string | null
    robotsOverride: "index" | "noindex" | null
    schemaType: "Article" | "BlogPosting"
  }
  featuredImage: {
    assetId: string | null
    url: string
    alt: string
    width: number
    height: number
  } | null
  relatedArticleIds: string[]
  computed: {
    searchTokens: string[]
    readingMinutes: number | null
    wordCount: number | null
  }
  editorialStatus: "writing" | "ready" | "needs_update"
  currentStep:
    | "topic"
    | "brief"
    | "outline"
    | "draft"
    | "review"
    | "seo"
    | "translations"
    | "publish"
  revision: number
  publication: {
    state: "unpublished" | "published" | "archived"
    publishedRevision: number | null
    publishedAt: Timestamp | null
    contentUpdatedAt: Timestamp | null
  }
  createdBy: string
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

### Keyword snapshot

Snapshot every value needed for future prompts and audit:

```ts
type ArticleKeywordSnapshot = {
  keywordId: string
  keyword: string
  normalizedKeyword: string
  surface: KeywordSurface
  target: KeywordTarget
  metrics: KeywordMetrics
  provenance: KeywordProvenance
}
```

Do not copy `groupId` as the only membership source. Store exact primary and
supporting members in deterministic order.

Indexes: article list by `updatedAt desc`; optional status filters should be
added only with their real queries.

## Commands and queries

- `listArticles(projectId, filters)`.
- `getArticle(projectId, articleId)`.
- `createArticleFromTopic(projectId, topicRowId)`.
- `visitArticleStep(projectId, articleId, step)` without changing completion.

Creation transaction re-reads the Project and current available topic. It does
not mark keywords Used.

## Backoffice behavior

Routes:

```text
/admin/projects/{projectId}/articles
/admin/projects/{projectId}/articles/new
/admin/projects/{projectId}/articles/{articleId}
```

- Article list: title/Untitled, topic, editorial state, publication state,
  locales, updated time, Continue/Open.
- New: searchable available topic rows, group expansion, exactly one selection.
- Create only after `Save topic and continue` succeeds.
- Empty state links to Keywords when no eligible topic exists.
- Refreshing/leaving New before save creates nothing.

## Public behavior

None. Creating/editing an Article creates no `publicArticles` document.

## AI behavior and prompt

None. Topic selection is an owner decision.

## Planned implementation links

- [Article document](../../src/features/articles/model/article-document.ts)
- [Keyword snapshot](../../src/features/articles/model/article-keyword-snapshot.ts)
- [Article service](../../src/features/articles/service/article-service.server.ts)
- [Article list](../../src/features/articles/components/article-list.tsx)
- [Topic picker](../../src/features/articles/components/article-topic-picker.tsx)
- [Creation tests](../../src/features/articles/service/create-article-from-topic.test.ts)

## Implementation order

1. Implement Article/keyword snapshot schemas and Firestore reader.
2. Implement article list/get queries.
3. Implement available topic read contract from Keywords.
4. Implement transactional creation.
5. Implement Article list and New topic picker.
6. Implement empty/error/responsive states and route protection.
7. Test concurrency, used/group changes, cross-project IDs, and no-save exit.

## Tangible output

A real Article Firestore document whose `keywordSnapshot` matches the selected
real Backlog topic and remains unchanged after editing the Backlog.

## Verification

- One click/double submission cannot create two Articles from one command.
- Ineligible/stale topic fails without creating an Article.
- Backlog edit after creation does not change the Article snapshot.
- No keyword becomes Used.
- No public document is created.
- Formatting, lint, type checking, tests, and build pass.

## Done when

- The owner can create and reopen a real Untitled Article.
- Its immutable keyword snapshot is visible in the workspace.
- Brief can consume it without direct Keyword document reads.


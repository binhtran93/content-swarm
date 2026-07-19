# 03.01 — Article Creation

Status: Not started

## Outcome

The owner can list Articles and create one real working Article from one
available Keyword or Keyword Group.

## Depends on

- [Keyword Research](../02-keyword-research/PLAN.md)
- [Article Authoring Overall Plan](./PLAN.md)

## Firestore ownership

Path: `projects/{projectId}/articles/{articleId}`

```ts
type ArticleDocument = {
  schemaVersion: 1
  locale: string
  keywordId: string
  title: string | null
  slug: string | null
  topic: string | null
  excerpt: string | null
  plan: string | null
  planReferences: { title: string; url: string }[]
  content: string | null
  contentReferences: { title: string; url: string }[]
  seoTitle: string | null
  seoDescription: string | null
  status: "draft" | "published" | "archived"
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

`keywordId` is the selected primary Keyword. If it has a `groupId`, the Keyword
Group remains the source of truth for its supporting members. Do not copy
keyword text, market data, group membership, or a synthetic topic-row ID into
the Article.

Once assigned to an Article, a Keyword Group cannot be changed, dissolved, or
deleted. An assigned individual Keyword cannot be deleted. Article Creation
sets `articleId` on the primary and every group member in the same transaction
that creates the Article.

There is no stored workflow step, revision, content hash, featured image,
computed metadata, or separate writing/readiness status. The URL identifies the
open editor section, and field validation determines whether the Article can be
published.

## Commands and queries

- `createArticle(projectId, keywordId, sourceLocale)`.
- `listArticles(projectId)`.
- `getArticle(projectId, articleId)`.

Creation re-reads the active Project, selected Keyword, and optional Keyword
Group. It verifies that every member is unassigned, creates the Article, and
assigns every member atomically.

## Backoffice behavior

Routes:

```text
/admin/projects/{projectId}/articles
/admin/projects/{projectId}/articles/new
/admin/projects/{projectId}/articles/{articleId}?step=plan
```

- Article list shows title or Untitled, topic, status, locale, and updated time.
- New shows available individual/grouped Keyword choices and exactly one
  selection.
- Create occurs only after the owner confirms the selected Keyword topic.
- Empty state links to Keywords when no topic is available.
- Leaving New before confirmation creates nothing.
- Navigation uses URL state; opening an Article without `step` chooses the first
  incomplete section. Navigation alone never writes Firestore.

## Public behavior

A draft is private. A published Article is read directly by the public site, so
saving a published Article changes its public result immediately.

## AI behavior and prompt

None. Keyword selection is an owner decision.

## Planned implementation links

- [Article document](../../src/features/articles/model/article-document.ts)
- [Create Article](../../src/features/articles/service/create-article.server.ts)
- [List Articles](../../src/features/articles/service/list-articles.server.ts)
- [Get Article](../../src/features/articles/service/get-article.server.ts)
- [Article list](../../src/features/articles/backoffice/article-list.tsx)
- [Keyword picker](../../src/features/articles/backoffice/article-keyword-picker.tsx)
- [Creation tests](../../src/features/articles/service/create-article.test.ts)

Each model or service file has one public export. Supporting helpers remain
private or move to their own single-export file.

## Implementation order

1. Implement the Article schema and Firestore reader.
2. Implement list/get queries.
3. Consume the available Keyword topic query.
4. Implement transactional Article creation and Keyword assignment.
5. Implement Article list and New Keyword picker.
6. Implement URL-based section navigation and empty/error states.
7. Test double submission, stale grouping, cross-project IDs, and no-save exit.

## Tangible output

A real draft Article containing one `keywordId`, with the selected Keyword or
Group members pointing back to that Article.

## Verification

- Double submission cannot create two Articles for one Keyword topic.
- Stale or already-assigned Keyword selection creates nothing.
- Group membership is not duplicated into the Article.
- Assigned Keyword/Group changes are rejected.
- The Article remains the only content document.
- Formatting, lint, type checking, tests, and build pass.

## Done when

- The owner can create and reopen a real Untitled Article.
- Its Keyword topic resolves through `keywordId`.
- Article plan generation can consume that Keyword context.

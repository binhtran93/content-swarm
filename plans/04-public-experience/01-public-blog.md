# 04.01 — Public Blog

Status: Implemented; production index deployment pending cutover

## Outcome

Readers can browse and open real published source Articles. The public site
uses the Article as its source of truth and has no fake or copied content path.

## Depends on

- [Publishing](../03-article-authoring/06-publishing.md)
- [Public Experience Overall Plan](./PLAN.md)

## Firestore access

Source Article path:

```text
projects/{projectId}/articles/{articleId}
```

Initial blog query:

```text
status == published
order by updatedAt desc
order by document ID desc
limit pageSize + 1
```

Topic browsing adds `topics array-contains selectedTopic`. Add only the Firestore indexes
required by these implemented queries. Use an opaque cursor containing
`updatedAt` and document ID; do not use offsets.

Slug resolution queries the same Project's Articles by `slug` and
`status == published`. Project-scoped slug reservations prevent duplicates,
but the public page renders the Article itself.

## Public service contract

- `listPublishedArticles(input)`.
- `getPublishedArticleBySlug(input)`.
- `listPublishedTopics(projectId)`.

Every function is server-only, requires `projectId`, returns only the fields
needed by the public UI, and never has a default Project.

## Public behavior

Routes:

```text
/{projectId}/blog
/{projectId}/blog/{slug}
```

Blog index:

- Published source Articles only.
- All/topic controls and cursor pagination.
- Title, excerpt, topic, and updated time.
- Loading, empty, error, and Not Found states.

Article page:

- Resolve a published Article by Project and slug.
- Render one H1 title, metadata, safe MDX, and an optional heading-derived TOC.
- Validate MDX before compiling it.
- Render only the Nextra and future custom components in the explicit shared
  MDX component map.
- Use the requested Project's own layout, theme, header, footer, navigation,
  assets, and CTA.

## Backoffice behavior

Publish success links to the public route. Saving a published Article changes
that route immediately.

## AI behavior and prompt

None. Public requests never invoke AI.

## Planned implementation links

- [List published Articles](../../src/features/articles/public/list-public-article-page.server.ts)
- [Get published Article](../../src/features/articles/public/get-public-article-by-slug.server.ts)
- [List published topics](../../src/features/articles/public/list-public-topics.server.ts)
- [Blog index](../../src/public-site/components/blog/blog-index.tsx)
- [Article view](../../src/public-site/components/blog/blog-article.tsx)
- [MDX component map](../../src/public-site/components/mdx/article-mdx-components.tsx)
- [MDX renderer](../../src/public-site/components/mdx/render-article-mdx.server.tsx)
- [SubIQ Blog routes](../../src/app/(public)/subiq/blog/page.tsx)
- [Composition tests](../../src/public-site/blog/load-blog-page.test.ts)

Each service or main component file has one public export.

## Implementation order

1. Adapt the Project site layout needed by Blog.
2. Implement the published Article list query.
3. Implement published slug resolution and topic reads.
4. Adapt the Blog index and Article components.
5. Adapt the safe Nextra MDX renderer.
6. Implement routes and loading/error/not-found states.
7. Add the exact required indexes.
8. Remove the fake provider from production configuration.

## Tangible output

The real Article published in Article Authoring step 03.06 appears on the Blog
index and Article route directly from its Article document.

## Verification

- Draft and archived Articles cannot list, resolve, or be read directly.
- Project A cannot return Project B content, including identical slugs.
- Cursor pages have no duplicates or skips under deterministic test data.
- Invalid MDX does not execute or render.
- The page contains exactly one H1.
- Saving a published Article updates the route without a Republish action.
- Formatting, lint, type checking, tests, and build pass.

## Done when

- Source Blog works with real published SubIQ Articles.
- Shared Blog code does not impose one landing-page layout.
- No production public route uses fake fixture data.

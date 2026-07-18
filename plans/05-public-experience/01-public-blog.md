# 05.01 — Public Blog

Status: Not started

## Outcome

Readers can browse and open real source-locale published articles through the
new public application. No fake provider or editorial read remains in the
production path.

## Depends on

- [Publish, Republish, and Archive](../04-publishing/02-publish-republish-archive.md)
- [Public Experience Overall Plan](./PLAN.md)

## Firestore access

Read-only paths:

- `projects/{projectId}/publicArticles/{publicArticleId}`.
- `projects/{projectId}/publicSlugs/{locale--slug}`.

Initial source archive query:

```text
status == published
isSource == true
order by publishedAt desc
order by document ID desc
limit pageSize + 1
```

Topic query adds `topic == selectedTopic`.

Required indexes are added to the version-controlled Firestore index file only
after implementing these exact queries.

Use opaque cursor values containing `publishedAt` and document ID. Do not
emulate pages with Firestore offsets.

## Public service contract

Single-responsibility read functions:

- `listPublicArticles(input)`.
- `resolvePublicArticle(input)`.
- `listPublicTopics(projectId)`.

Public models are derived from strict Publishing schemas. They do not reuse the
editable Article model.

Every service call requires `projectId`; no service has a default Project.

## Public behavior

Routes for a Project:

```text
/{projectId}/blog
/{projectId}/blog/{slug}
```

Blog index:

- Real published source articles only for the first pass.
- Publication order, All/topic controls, opaque next/previous pagination.
- Title, excerpt, topic, and publication date.
- Loading, empty, error, and Not Found states.

Article page:

- Resolve locale/source slug through `publicSlugs`.
- One H1 title, metadata, safe MDX, and optional TOC derived from headings.
- Revalidate MDX defensively before compile; render only the approved Nextra and
  custom component map shared with the backoffice preview. Invalid public data
  is unavailable, not executed.
- Site layout, header, footer, navigation, assets, and CTA come from that
  Project's public-site code.

## Backoffice behavior

No new behavior. Publish success already shows links to these routes.

## AI behavior and prompt

None. Public requests never invoke AI.

## Planned implementation links

- [List public Articles](../../src/public-site/services/list-public-articles.server.ts)
- [Resolve public Article](../../src/public-site/services/resolve-public-article.server.ts)
- [List public topics](../../src/public-site/services/list-public-topics.server.ts)
- [Blog index](../../src/public-site/components/blog/blog-index.tsx)
- [Article view](../../src/public-site/components/blog/blog-article.tsx)
- [MDX component map](../../src/public-site/components/mdx/article-mdx-components.tsx)
- [MDX renderer](../../src/public-site/components/mdx/render-article-mdx.server.tsx)
- [Blog routes](../../src/app/(public)/[projectId]/blog/page.tsx)
- [Contract tests](../../src/public-site/services/public-blog-service.test.ts)

## Implementation order

1. Adapt each real Project site layout needed by Blog.
2. Remove SubIQ-specific dictionary/component props from shared Blog UI and
   replace them with generic project Blog contracts.
3. Implement strict public service models and source archive query.
4. Implement slug resolution and topic reads.
5. Adapt shared Blog index/article components without Firestore types in UI.
6. Adapt safe MDX renderer using the shared MDX contract.
7. Implement generic project source routes, loading/error/not-found, and
   pagination.
8. Add exact query indexes and deploy them in development/staging.
9. Remove/disable fake provider from the production configuration.

## Tangible output

The real article published in Plan 04 is visible on the new Blog index and
article route. Its working Article document can change without changing this
page until Republish.

## Verification

- Public service cannot read `articles` or translations subcollection.
- Requesting Project A never returns a document or topic from Project
  B, including when slugs and article IDs are similar.
- Unpublished/archived document cannot list or resolve.
- Cursor pages have no duplicates/skips under deterministic fixture data.
- Invalid MDX does not execute or render.
- Article contains exactly one H1.
- Working edit does not change public route; Republish does.
- Formatting, lint, type checking, tests, and build pass.

## Done when

- Source Blog works with real Firestore public data.
- The same shared Blog routes/components work for a second Project
  without copying them into another project folder.
- No production public route uses fake fixture data.
- Snapshot isolation is visible end to end.

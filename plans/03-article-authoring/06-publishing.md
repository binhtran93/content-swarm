# 03.06 — Publishing

Status: Not started

## Depends on

- [SEO](./04-seo.md)
- [Translations and AI Assistance](./05-translations-ai.md) for optional locales

## Outcome

The owner can preview a ready Article, publish it, and archive it. The Article
itself remains the single source of truth; Publishing does not create a second
public copy.

## Code ownership

Publishing is part of the `articles` feature. Its services live under
`src/features/articles/publishing`, and its backoffice controls live under
`src/features/articles/backoffice/publishing`.

Do not create `publicArticles`, `publicSlugs`, publication snapshots, revisions,
or synchronization services. The existing Article `status` controls whether
the public site may read it:

```text
draft      private
published  public
archived   private
```

An approved Translation is public only while its parent Article is published.
A draft Translation is always private.

## User journey

```text
Ready draft Article
→ Open Publish Preview
→ Review content, metadata, translations, and URLs
→ Confirm Publish
→ Article status becomes published
→ Public site reads the Article directly
→ Later edits are visible immediately after Save
→ Archive hides the Article and its translations
```

There is no Republish action. Because there is no separate public copy, saving
a published Article updates the public result immediately. The backoffice must
make this behavior clear before the owner edits a published Article.

## Firestore data

Publishing adds no collection and no publishing-specific document. It updates:

```text
projects/{projectId}/articles/{articleId}.status
```

The Article and Translation shapes remain owned by Article Authoring. Existing
Project-scoped slug reservations prevent duplicate source or translated URLs;
they are not public content copies.

## Publish

`publishArticle(projectId, articleId)` performs one server operation:

1. Read the active Project and Article.
2. Re-evaluate Article readiness from saved fields.
3. Validate the source slug and MDX.
4. Revalidate every approved Translation so an invalid translation cannot
   become public with the parent.
5. Change the Article `status` from `draft` to `published` and update
   `updatedAt`.

Failure changes nothing. AI cannot publish or choose what becomes public.

## Archive

`archiveArticle(projectId, articleId)` changes the Article `status` to
`archived` and updates `updatedAt`. The public site stops listing or resolving
the Article and all its Translations.

R1 has no restore action. Add one later only when it is actually needed.

## Backoffice behavior

- Publish Preview renders the exact saved source Article and approved
  Translations with their public URLs.
- Readiness blockers are shown before confirmation.
- Publish requires explicit owner confirmation.
- A published Article displays a clear notice that saved edits become public
  immediately.
- Archive requires explicit confirmation and explains that all locales will be
  hidden.
- Draft Translations are shown as private and are never rendered publicly.

## Public access and security

The public site reads Article Authoring data directly through small read-only
services. Firestore rules and server queries must enforce:

- Public Article reads require `status == "published"`.
- Public Translation reads require `status == "approved"` and a published
  parent Article.
- Draft and archived Articles are unavailable by list, slug, and direct ID.
- Every read is scoped to the requested `projectId`.
- Public code cannot write Article or Translation data.

## AI behavior and prompt

None. Publishing is an owner-controlled deterministic operation.

## Planned implementation links

- [Publish Article](../../src/features/articles/publishing/publish-article.server.ts)
- [Archive Article](../../src/features/articles/publishing/archive-article.server.ts)
- [Publish Preview](../../src/features/articles/backoffice/publishing/article-publish-preview.tsx)
- [Publishing tests](../../src/features/articles/publishing/publish-article.test.ts)
- [Firestore rules](../../firestore.rules)

Each service or main component file has one public export and one
responsibility.

## Implementation order

1. Implement and test public read rules for Article and Translation documents.
2. Implement Publish with server-side readiness validation.
3. Implement Archive.
4. Implement Publish Preview and confirmation.
5. Add the published-edit warning to the Article workspace.
6. Test draft, published, archived, translated, invalid, and cross-project
   access.

## Tangible output

One real Article changes from draft to published and appears on its public
route without creating another content document. Archiving it makes the route
unavailable.

## Verification

- Publish creates no public copy or slug document.
- An incomplete Article cannot be published.
- Saving a published Article changes the public result immediately.
- Draft and archived Articles cannot be read publicly.
- Draft Translations remain private.
- Approved Translations disappear when their parent is archived.
- Identical slugs in different Projects do not cross-resolve.
- Formatting, lint, type checking, tests, and build pass.

## Done when

- The full draft → published → archived journey works with real Firestore data.
- Public visibility is controlled entirely by existing statuses and security
  rules.
- No public content-copy collection or synchronization code exists.

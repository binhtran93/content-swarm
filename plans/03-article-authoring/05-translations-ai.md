# 03.05 — Translations AI

Status: Not started

## Outcome

The owner can manually or assistively create, validate, save, and approve an
exact-locale translation tied to a specific source revision and hash.

## Depends on

- [SEO and Media](./04-seo-and-media.md)

Translations are optional for first source publication unless product policy
explicitly requires one.

## Firestore ownership

Path: `projects/{projectId}/articles/{articleId}/translations/{locale}`

```ts
type ArticleTranslationDocument = {
  schemaVersion: 1
  locale: string
  sourceRevision: number
  sourceReviewHash: string
  revision: number
  status: "draft" | "approved" | "stale"
  title: string
  slug: string
  excerpt: string
  bodyMdx: string
  bodyHash: string
  featuredImageAlt: string | null
  seo: { title: string; description: string }
  computed: { searchTokens: string[] }
  approvedBy: string | null
  approvedAt: Timestamp | null
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

Locale slug uses `articleSlugs/{localeKey--slug}` and is reserved in the same
transaction as translation save.

When source Review changes materially, approved translations become `stale`.
Preserve their content. They require explicit review/save/approve again.

## Commands

- `listSupportedTranslationLocales(projectId, articleId)`.
- `generateTranslation(projectId, articleId, locale)`.
- `saveTranslation(..., expectedArticleRevision, expectedTranslationRevision)`.
- `approveTranslation(projectId, articleId, locale, expectedRevision)`.

Approval revalidates MDX, required metadata, URL preservation, source
revision/hash, and slug ownership.

## Backoffice behavior

- Locale selector contains only supported non-source locales.
- Translation workspace edits title, slug, excerpt, body MDX, image alt, and
  SEO fields.
- Safe preview uses the same public component contract.
- Draft/Approved/Stale states are unmistakable.
- Approve is separate from Save and from Publish.
- Show source revision/hash relationship and source-change warning.

## AI behavior

Version: `article-translation-v1`

Canonical source:
[Translation prompt](../../src/features/articles/prompts/article-translation-prompt.ts)

Server inputs:

- Source locale and exact target locale.
- Saved source title, excerpt, Review MDX, featured image alt, and SEO metadata.
- Protected URLs extracted from source.
- MDX component contract and translation rules.

Structured output:

```ts
{
  title: string
  slugSuggestion: string
  excerpt: string
  bodyMdx: string
  featuredImageAlt: string | null
  seoTitle: string
  seoDescription: string
}
```

Required system prompt:

```text
Translate the complete approved source article into the exact requested locale.
Preserve meaning, factual uncertainty, MDX structure, component names, code,
and every protected link destination. Translate reader-facing text naturally
for the locale rather than word-for-word. Do not add, remove, verify, or invent
claims. Do not add imports, frontmatter, H1, raw HTML, scripts, expressions, or
new URLs. Return only the requested structured object.
```

Generated output is validated before editor prefill and remains unsaved.

## Public behavior

None. Approved translation is still private until Publishing explicitly copies
it into a locale public document.

## Planned implementation links

- [Translation document](../../src/features/articles/model/article-translation-document.ts)
- [Translation prompt](../../src/features/articles/prompts/article-translation-prompt.ts)
- [Translation service](../../src/features/articles/service/translation-service.server.ts)
- [Approval command](../../src/features/articles/service/approve-translation.server.ts)
- [Translation workspace](../../src/backoffice/features/articles/article-translation-workspace.tsx)
- [Translation tests](../../src/features/articles/service/article-translation.test.ts)

## Implementation order

1. Implement supported locale and translation schemas.
2. Implement manual translation save with slug transaction and MDX validation.
3. Implement translation prompt and generated-output validation.
4. Implement workspace and preview.
5. Implement explicit approval with actor/hash capture.
6. Implement source-change staleness.
7. Test protected URLs, exact locales, stale approval, concurrency, and AI
   provider-disabled path.

## Tangible output

At least one real approved translation document, for example `vi-VN`, tied to
the current source Review hash. No public locale document exists yet.

## Verification

- Manual translation works with AI disabled.
- Generated proposal never saves/approves.
- Unsupported/source locale is rejected.
- Translation slug is unique within Project/locale.
- Links/components/code remain protected.
- Source Review change marks approval Stale without deleting content.
- Approved translation remains private.
- Formatting, lint, type checking, tests, and build pass.

## Done when

- Source Article remains Ready.
- At least one approved translation is available to the publication candidate.
- Publishing can select source-only or source-plus-approved-locales explicitly.

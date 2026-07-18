# 03.05 — Translations and AI Assistance

Status: Not started

## Outcome

The owner can manually write or generate, review, save, and approve an optional
translation. Source Article publication never requires a translation.

## Depends on

- [SEO](./04-seo.md)

## Firestore ownership

Path: `projects/{projectId}/articles/{articleId}/translations/{locale}`

Examples:

```text
projects/subiq/articles/article-123/translations/vi-VN
projects/subiq/articles/article-123/translations/de-DE
```

```ts
type TranslationDocument = {
  schemaVersion: 1
  title: string
  slug: string
  excerpt: string
  content: string
  seoTitle: string
  seoDescription: string
  status: "draft" | "approved"
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

The locale is the document ID and is not duplicated as a field. Translation
content is not embedded in the Article, and the Article does not store a list
of translation locales.

There is no translation revision, hash, source hash, stale status, featured
image alt, computed search token, or publication state in this working
document. Publishing creates independent public locale snapshots.

## Commands and queries

- `listTranslations(projectId, articleId)`.
- `getTranslation(projectId, articleId, locale)`.
- `saveTranslation(projectId, articleId, locale, input)`.
- `generateTranslation(projectId, articleId, locale)`.
- `approveTranslation(projectId, articleId, locale)`.

Save writes only the selected Translation. Generate returns an unsaved proposal.
Approve revalidates required fields, MDX, locale, and Project-scoped slug.

## Backoffice behavior

- Translations is an optional Article route/section and is never an automatic
  required step.
- List existing locale documents from the Translation subcollection.
- Add locale, edit fields and MDX, preview safely, Save, Generate, and Approve.
- Generated output remains unsaved until owner confirmation.
- Source Article may proceed directly to Publish with zero translations.

## AI behavior and prompt

Version: `article-translation-v1`

Canonical source:
[Translation prompt](../../src/features/articles/prompts/article-translation-prompt.ts)

Server inputs:

- Source title, excerpt, Content, SEO title, and SEO description.
- Source and target locales.
- Project name and product context.
- Approved MDX component descriptions.

Required system prompt:

```text
Translate and localize the supplied article for the exact target locale.

The result must read as though it was originally written and edited by a fluent
native professional, not translated word for word. Use natural, idiomatic
phrasing that native readers would normally use. Rewrite idioms, sentence
structure, transitions, and expressions when a literal translation would sound
awkward, robotic, overly formal, or unnatural.

Preserve the source meaning, factual claims, intent, tone, section hierarchy,
lists, emphasis, links, and complete MDX structure. Do not add, remove, merge,
or invent facts, examples, statistics, quotes, product behavior, or sections.

Respect the reader's time. Keep the translation clear, concise, and useful.
Avoid filler, generic introductions, empty conclusions, unnecessary summaries,
repeated ideas, and repetitive keyword use. Every paragraph must retain a clear
purpose and distinct value.

Localize titles, headings, descriptions, calls to action, and visible prose so
they feel appropriate for the target audience. Preserve product names,
trademarks, technical identifiers, and terminology that should not be
translated. Format dates, numbers, and punctuation naturally for the target
locale without changing their underlying values.

Preserve MDX component names, HTML/MDX tag names, prop names, code, commands,
file paths, identifiers, and URLs exactly. Translate human-readable text inside
components only when doing so does not change component syntax or behavior.

Create a concise, URL-safe slug suggestion using natural target-language search
phrasing. Write an idiomatic SEO title and SEO description for the target
locale. Use relevant keywords naturally; never force, repeat, or mechanically
translate a keyword when native readers would use a different expression.

Return exactly one structured object containing `title`, `slug`, `excerpt`,
`content`, `seoTitle`, and `seoDescription`. Return no commentary, explanation,
translation notes, alternatives, or Markdown code fence outside the requested
structured object.
```

Output schema:

```ts
{
  title: string
  slug: string
  excerpt: string
  content: string
  seoTitle: string
  seoDescription: string
}
```

## Public behavior

None until Publish. Approved working Translations are private.

When published, each locale receives its own snapshot:

```text
projects/{projectId}/publicArticles/{articleId}--{normalizedLocale}
```

## Planned implementation links

- [Translation document](../../src/features/articles/model/translation-document.ts)
- [List Translations](../../src/features/articles/service/list-translations.server.ts)
- [Get Translation](../../src/features/articles/service/get-translation.server.ts)
- [Save Translation](../../src/features/articles/service/save-translation.server.ts)
- [Generate Translation](../../src/features/articles/service/generate-translation.server.ts)
- [Approve Translation](../../src/features/articles/service/approve-translation.server.ts)
- [Translation prompt](../../src/features/articles/prompts/article-translation-prompt.ts)
- [Prompt tests](../../src/features/articles/prompts/article-translation-prompt.test.ts)
- [Translation workspace](../../src/features/articles/backoffice/article-translation-workspace.tsx)

Each model, prompt, or service file has one public export.

## Implementation order

1. Implement Translation schema and per-locale reads.
2. Implement manual save and safe preview.
3. Implement the translation prompt and generation command.
4. Implement Project-scoped translated slug reservation.
5. Implement explicit approval validation.
6. Test manual-only, disabled AI, invalid MDX, duplicate slugs, and isolation.

## Tangible output

At least one real locale document saved under an Article and explicitly
approved, while the source Article remains independently publishable.

## Verification

- Source Article publishes with no Translation documents.
- Generate never saves automatically.
- Prompt contract requires native localization rather than literal translation,
  preserves MDX syntax, and prohibits filler, repetition, and invented facts.
- Unapproved Translation cannot be selected for Publish.
- Invalid MDX or duplicate locale slug cannot be approved.
- Translation content is never embedded in the source Article document.
- Formatting, lint, type checking, tests, and build pass.

## Done when

- A real approved Translation can be reopened after refresh.
- Publish Preview can select it without reading any fake data.

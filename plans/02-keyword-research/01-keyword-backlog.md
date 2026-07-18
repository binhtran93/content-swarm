# 02.01 — Keyword Backlog

Status: Not started

## Outcome

The owner can store, find, edit, and organize real accepted keywords. The
feature outputs eligible topic rows for Article Creation.

## Depends on

- [Projects](../01-projects/PLAN.md)
- [Keyword Research Overall Plan](./PLAN.md)

## Firestore ownership

### Keyword

Path: `projects/{projectId}/keywords/{keywordId}`

```ts
type KeywordDocument = {
  schemaVersion: 1
  keyword: string
  normalizedKeyword: string
  identityKey: string
  surface: "web" | "google_play" | "app_store"
  target: {
    locationCode: number
    locationName: string
    locationType: string
    countryIsoCode: string
    languageCode: string
    languageName: string
    catalogVersion: string
  }
  metrics: {
    searchVolume: number | null
    difficulty: number | null
    rank: number | null
    costPerClick: number | null
  }
  provenance: {
    kind: "manual" | "discovery"
    discoveryId: string | null
    candidateId: string | null
    method: string | null
    origin: string | null
  }
  groupId: string | null
  used: {
    value: boolean
    firstPublishedArticleId: string | null
    firstPublishedAt: Timestamp | null
    overriddenAt: Timestamp | null
    overrideReason: string | null
  }
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

`identityKey` is a deterministic hash/string from normalized keyword, surface,
and complete market identity. Enforce uniqueness transactionally using a
reservation document or deterministic keyword ID; choose and test one method.

### Keyword group

Path: `projects/{projectId}/keywordGroups/{groupId}`

```ts
type KeywordGroupDocument = {
  schemaVersion: 1
  name: string | null
  primaryKeywordId: string
  memberKeywordIds: string[]
  surface: KeywordDocument["surface"]
  targetKey: string
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

Keep a group reasonably bounded. R1 can cap it at 25 members.

## Commands

- `addKeyword(projectId, input)`
- `addKeywords(projectId, inputs)`
- `updateKeyword(projectId, keywordId, input)`
- `setKeywordUsedOverride(projectId, keywordId, value, reason)`
- `createKeywordGroup(projectId, memberIds, primaryId)`
- `updateKeywordGroup(projectId, groupId, memberIds, primaryId)`
- `dissolveKeywordGroup(projectId, groupId)`

Publication later uses a dedicated `markKeywordSnapshotsUsed` application
contract. It must not update Keyword documents from a route directly.

## Queries

- `listKeywords(projectId, filters)`.
- `listKeywordGroups(projectId)`.
- `listAvailableArticleTopics(projectId)` excluding Used keywords and returning
  deterministic group member order.

## Backoffice behavior

Route: `/admin/projects/{projectId}/keywords?view=backlog`

- Responsive table/cards with search and Used/surface/market filters.
- Add one and Paste many.
- Edit owner-managed fields.
- Select compatible rows and group them; choose primary keyword.
- Expand groups to inspect supporting keywords.
- Used overrides require a reason.
- Every failure preserves current input/selection.

## Public behavior

None.

## AI behavior and prompt

None in this file. Grouping assistance is implemented by
[Keyword Grouping AI](./02-keyword-grouping-ai.md).

## Planned implementation links

- [Keyword document](../../src/features/keywords/model/keyword-document.ts)
- [Keyword group](../../src/features/keywords/model/keyword-group-document.ts)
- [Target catalogue](../../src/features/keywords/config/search-market-catalog.ts)
- [Keyword service](../../src/features/keywords/service/keyword-service.server.ts)
- [Topic query](../../src/features/keywords/service/list-available-article-topics.server.ts)
- [Backlog UI](../../src/features/keywords/backoffice/keyword-backlog.tsx)
- [Service tests](../../src/features/keywords/service/keyword-service.test.ts)

## Implementation order

1. Adapt and version the supported market catalogue.
2. Implement keyword/group schemas and identity calculation.
3. Implement manual create/list/edit commands.
4. Implement the Backlog UI and filters.
5. Implement transactional group commands and UI.
6. Implement Used override and audit.
7. Implement available article-topic query.
8. Test identity concurrency, group compatibility, cross-project isolation, and
   mobile/desktop behavior.

## Tangible output

Real Firestore keyword and group documents created through the UI, plus an
available-topic result such as:

```ts
{
  id: "group:cancel-subscriptions",
  primary: { keywordId: "...", keyword: "cancel subscriptions" },
  supporting: [/* real keyword summaries */]
}
```

## Verification

- Mixed duplicate/blank Paste many saves only valid new values.
- Same phrase may exist for a different surface or market.
- Incompatible grouping fails without partial writes.
- One keyword cannot enter two active groups concurrently.
- Used topics are excluded from article choices.
- Formatting, lint, type checking, tests, and build pass.

## Done when

- The SubIQ project contains real manual Backlog data.
- At least one real group is visible and expandable.
- Available topic query returns correct individual/grouped topics.
- No DataForSEO or AI call is required for completion.

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
  countryCode: string
  languageCode: string
  searchVolume: number | null
  difficulty: number | null
  sourceDiscoveryId: string | null
  groupId: string | null
  articleId: string | null
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

`normalizedKeyword` is the trimmed, whitespace-collapsed, lowercase keyword.
Use a deterministic Firestore document ID derived internally from
`normalizedKeyword`, `countryCode`, and `languageCode` to prevent duplicates.
Do not persist a second `identityKey` field.

Keywords are web-search keywords in R1. DataForSEO-specific numeric location
codes and catalogue metadata stay inside the provider/discovery adapter. The
Backlog stores only standard country and language codes.

- `countryCode`: uppercase ISO country code such as `US` or `VN`.
- `languageCode`: lowercase language code such as `en` or `vi`.

`sourceDiscoveryId == null` means manual entry. Discovery method, input, and
provider details remain on the Discovery document instead of being copied into
every accepted keyword.

`articleId == null` means the keyword is available. Article Creation assigns
all selected individual/group members to its new Article transactionally.

### Keyword group

Path: `projects/{projectId}/keywordGroups/{groupId}`

```ts
type KeywordGroupDocument = {
  schemaVersion: 1
  name: string | null
  primaryKeywordId: string
  memberKeywordIds: string[]
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

Keep a group reasonably bounded. R1 can cap it at 25 members.

## Commands

- `addKeyword(projectId, input)`
- `addKeywords(projectId, inputs)`
- `updateKeyword(projectId, keywordId, input)`
- `createKeywordGroup(projectId, memberIds, primaryId)`
- `updateKeywordGroup(projectId, groupId, memberIds, primaryId)`
- `dissolveKeywordGroup(projectId, groupId)`

Article Creation uses a Keyword-owned transaction helper to verify availability
and assign the selected keyword/group members to the new `articleId`. There is
no publication-time Used transition or manual override workflow in R1.

## Queries

- `listKeywords(projectId, filters)`.
- `listKeywordGroups(projectId)`.
- `listAvailableArticleTopics(projectId)` excluding assigned keywords and
  returning deterministic group member order.

## Backoffice behavior

Route: `/admin/projects/{projectId}/keywords?view=backlog`

- Responsive table/cards with search, assignment, country, and language filters.
- Add one and Paste many.
- Edit owner-managed fields.
- Select compatible rows and group them; choose primary keyword.
- Expand groups to inspect supporting keywords.
- Every failure preserves current input/selection.

## Public behavior

None.

## AI behavior and prompt

None. Keyword grouping is a manual owner action.

## Planned implementation links

- [Keyword document](../../src/features/keywords/model/keyword-document.ts)
- [Keyword group](../../src/features/keywords/model/keyword-group-document.ts)
- [Keyword service](../../src/features/keywords/service/keyword-service.server.ts)
- [Topic query](../../src/features/keywords/service/list-available-article-topics.server.ts)
- [Backlog UI](../../src/features/keywords/backoffice/keyword-backlog.tsx)
- [Service tests](../../src/features/keywords/service/keyword-service.test.ts)

## Implementation order

1. Implement keyword/group schemas and deterministic keyword document IDs.
2. Implement manual create/list/edit commands.
3. Implement the Backlog UI and filters.
4. Implement transactional group commands and UI.
5. Implement available article-topic query and Article assignment helper.
6. Test duplicate concurrency, group compatibility, cross-project isolation, and
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
- The same phrase may exist for a different country or language.
- Incompatible grouping fails without partial writes.
- One keyword cannot enter two active groups concurrently.
- Assigned topics are excluded from article choices.
- Formatting, lint, type checking, tests, and build pass.

## Done when

- The SubIQ project contains real manual Backlog data.
- At least one real group is visible and expandable.
- Available topic query returns correct individual/grouped topics.
- No DataForSEO or AI call is required for completion.

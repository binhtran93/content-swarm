# 02.02 — Keyword Discovery

Status: Not started

## Outcome

The owner can deliberately request or reuse keyword research, inspect real
results, and add selected results to Backlog without duplicates.

## Depends on

- [Keyword Backlog](./01-keyword-backlog.md)

## Firestore ownership

Path: `projects/{projectId}/keywordDiscoveries/{discoveryId}`

```ts
type KeywordDiscoveryDocument = {
  schemaVersion: 1
  requestKey: string
  method: "keyword_ideas" | "related_keywords" | "competitor_website"
  input: string
  countryCode: string
  languageCode: string
  limit: 50 | 100 | 250 | 500
  minimumVolume: number | null
  maximumDifficulty: number | null
  orderBy: string[]
  results: Array<{
    keyword: string
    searchVolume: number | null
    difficulty: number | null
    rank: number | null
  }>
  createdAt: Timestamp
}
```

Successful Discovery documents are immutable. R1 caps results at 500 small
projected records, so keep them in the Discovery document instead of creating a
result subcollection. Do not save the raw provider response.

`requestKey` is calculated internally from the normalized method, input,
country, language, limit, filters, and ordered `orderBy` array. It exists only
to reopen an identical paid result instead of calling DataForSEO again.

`orderBy` is the exact ordered array sent to DataForSEO. The first entry is the
primary order and the next entry, when present, is its tie-breaker:

```ts
keyword_ideas: ["relevance,desc", "keyword_info.search_volume,desc"]
related_keywords: ["keyword_data.keyword_info.search_volume,desc"]
competitor_website: [
  "ranked_serp_element.serp_item.rank_group,asc",
  "keyword_data.keyword_info.search_volume,desc",
]
```

Firestore preserves the `results` array order returned by DataForSEO, so do not
store another result-position field. `rank` is the competitor's actual search
rank and is null for methods where it does not apply; it is not the array index.

The DataForSEO adapter resolves `countryCode` and `languageCode` to the
provider's numeric `location_code` when making the request. Provider catalogue
details do not enter Backlog documents. Discovery accepts uppercase country
codes such as `US` or `VN` and lowercase language codes such as `en` or `vi`.

Indexes:

- Discovery request-key lookup and list by `createdAt desc`.

## Provider methods

- Web Keyword Ideas.
- Web Related Keywords.
- Competitor Website Ranked Keywords.

Google Play and App Store discovery are out of scope. All keywords are web
search keywords, so there is no `surface` field.

## Commands

- `getOrReuseDiscovery(projectId, request)`.
- `runDiscoveryAgain(projectId, request)`.
- `addResultsToBacklog(projectId, discoveryId, keywords)`.

`getOrReuse` computes the normalized request key before any provider
call. `runAgain` is the only intentional bypass and creates a new Discovery.

## Backoffice behavior

Route: `/admin/projects/{projectId}/keywords?view=discover`

- Method, one input value, country, language, limit, and simple metric filters.
- `Get keywords` first reuses identical saved data.
- `Run again` clearly communicates a new paid call.
- Saved discoveries list and reopen through URL state.
- Available results exclude keywords already in Backlog for the same country
  and language.
- Select/filter and Add to Backlog.
- Empty successful result remains reopenable and reusable.

## AI behavior and prompt

None. DataForSEO is a structured provider, not an AI generation feature. Do not
use AI to rewrite, score, or silently filter provider results in R1.

## Planned implementation links

- [Discovery document](../../src/features/keywords/model/keyword-discovery-document.ts)
- [Request key](../../src/features/keywords/service/discovery-request-key.ts)
- [DataForSEO request](../../src/features/keywords/provider/fetch-keyword-discovery.server.ts)
- [Get or reuse](../../src/features/keywords/service/get-or-reuse-discovery.server.ts)
- [Run again](../../src/features/keywords/service/run-discovery-again.server.ts)
- [Add results to Backlog](../../src/features/keywords/service/add-results-to-backlog.server.ts)
- [Discover UI](../../src/features/keywords/backoffice/keyword-discover.tsx)
- [Provider fixtures](../../src/features/keywords/provider/data-for-seo-fixtures.test.ts)

## Implementation order

1. Implement the small web-only request schema and request key.
2. Implement Discovery persistence and saved lookup with one export per file.
3. Adapt the DataForSEO request with credentials and safe errors.
4. Implement methods one at a time with fixture contract tests.
5. Implement get-or-reuse and explicit rerun orchestration.
6. Implement query, results, saved discovery, and empty states.
7. Implement transactional result acceptance through Keyword ownership.
8. Add a test network guard so normal tests cannot make paid calls.

## Tangible output

- One real successful saved Discovery, or an intentionally approved provider
  fixture in non-paid development.
- Its ordered result array.
- Selected results persisted as real Backlog keywords with
  `sourceDiscoveryId`.

## Verification

- Identical Get makes no second provider call.
- Empty results are stored and reused.
- Run again creates a new immutable Discovery.
- Adding results never mutates the Discovery document.
- Backlog duplicates are not created under concurrent acceptance.
- No provider call happens on page load, field change, tab change, or refresh.
- Formatting, lint, type checking, tests, and build pass.

## Done when

- Saved discovery can be reopened after refresh.
- Result acceptance produces real Backlog records.
- Backlog now contains enough real topic data to begin Article Authoring.

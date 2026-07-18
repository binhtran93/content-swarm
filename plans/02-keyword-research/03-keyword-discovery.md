# 02.03 — Keyword Discovery

Status: Not started

## Outcome

The owner can deliberately request or reuse keyword research, inspect real
candidates, and add selected candidates to Backlog without duplicates.

## Depends on

- [Keyword Backlog](./01-keyword-backlog.md)

Grouping AI is not required.

## Firestore ownership

### Discovery metadata

Path: `projects/{projectId}/keywordDiscoveries/{discoveryId}`

```ts
type KeywordDiscoveryDocument = {
  schemaVersion: 1
  fingerprint: string
  requestVersion: string
  surface: "web" | "google_play" | "app_store"
  method:
    | "keyword_ideas"
    | "related_keywords"
    | "competitor_website"
    | "app_keywords"
  origin: { kind: string; normalizedValue: string; displayValue: string }
  target: KeywordTarget
  filters: Record<string, string | number | boolean | null>
  ordering: string
  provider: {
    name: "dataforseo"
    taskId: string | null
    costUsd: number | null
    completedAt: Timestamp
  }
  candidateCount: number
  createdBy: string
  createdAt: Timestamp
}
```

Successful Discovery documents are immutable.

### Candidate

Path:
`projects/{projectId}/keywordDiscoveries/{discoveryId}/candidates/{candidateId}`

```ts
type KeywordCandidateDocument = {
  schemaVersion: 1
  keyword: string
  normalizedKeyword: string
  identityKey: string
  metrics: KeywordMetrics
  providerOrder: number
  rawReference: string | null
  createdAt: Timestamp
}
```

Use a subcollection to avoid Firestore’s document-size limit and preserve large
paid result sets. Do not copy entire raw provider responses unless required for
diagnostics and sized safely.

Indexes:

- Discovery fingerprint lookup.
- Discovery list by `createdAt desc`.
- Candidate order by `providerOrder` if document IDs do not encode it.

## Provider methods

- Web Keyword Ideas.
- Web Related Keywords.
- Competitor Website Ranked Keywords.
- Google Play Keywords for App.
- App Store Keywords for App.

App methods lock market settings where required by current provider capability.

## Commands

- `getOrReuseDiscovery(projectId, request)`.
- `runDiscoveryAgain(projectId, request)`.
- `addCandidatesToBacklog(projectId, discoveryId, candidateIds)`.

`getOrReuse` computes the normalized versioned fingerprint before any provider
call. `runAgain` is the only intentional bypass and creates a new Discovery.

## Backoffice behavior

Route: `/admin/projects/{projectId}/keywords?view=discover`

- Method-specific origin and market controls.
- `Get keywords` first reuses identical saved data.
- `Run again` clearly communicates a new paid call.
- Saved discoveries list and reopen through URL state.
- Available candidates exclude identities already in Backlog.
- Select/filter and Add to Backlog.
- Empty successful result remains reopenable and reusable.

## AI behavior and prompt

None. DataForSEO is a structured provider, not an AI generation feature. Do not
use AI to rewrite, score, or silently filter provider candidates in R1.

## Planned implementation links

- [Discovery document](../../src/features/keywords/model/keyword-discovery-document.ts)
- [Candidate document](../../src/features/keywords/model/keyword-candidate-document.ts)
- [Fingerprint](../../src/features/keywords/service/discovery-fingerprint.ts)
- [DataForSEO client](../../src/features/keywords/provider/data-for-seo-client.server.ts)
- [Discovery service](../../src/features/keywords/service/discovery-service.server.ts)
- [Discover UI](../../src/features/keywords/backoffice/keyword-discover.tsx)
- [Provider fixtures](../../src/features/keywords/provider/data-for-seo-fixtures.test.ts)

## Implementation order

1. Implement request/method/target schemas and fingerprint.
2. Implement metadata/candidate persistence and saved lookup.
3. Adapt DataForSEO client with credentials and safe errors.
4. Implement methods one at a time with fixture contract tests.
5. Implement get-or-reuse and explicit rerun orchestration.
6. Implement query, results, saved discovery, and empty states.
7. Implement transactional candidate acceptance through Keyword ownership.
8. Add a test network guard so normal tests cannot make paid calls.

## Tangible output

- One real successful saved Discovery, or an intentionally approved provider
  fixture in non-paid development.
- Its Candidate subcollection.
- Selected candidates persisted as real Backlog keywords with discovery
  provenance.

## Verification

- Identical Get makes no second provider call.
- Empty results are stored and reused.
- Run again creates a new immutable Discovery.
- Adding candidates never mutates Discovery/Candidate documents.
- Backlog duplicates are not created under concurrent acceptance.
- No provider call happens on page load, field change, tab change, or refresh.
- Formatting, lint, type checking, tests, and build pass.

## Done when

- Saved discovery can be reopened after refresh.
- Candidate acceptance produces real Backlog records.
- Backlog now contains enough real topic data to begin Article Authoring.

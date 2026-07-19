# SubIQ public cutover runbook

Scope: SubIQ only. Do not migrate, freeze, route, or modify Jewelry Identifier,
SkyLens, Urge Zero, or any unknown Project ID.

## Release gates

- [ ] Confirm `PUBLIC_PROJECT_ID=subiq` in the dedicated deployment.
- [ ] Confirm `PUBLIC_ROUTE_MODE=root` in the dedicated deployment and
      `PUBLIC_ROUTE_MODE=project` (or unset) in the shared deployment.
- [ ] Supply `NEXT_PUBLIC_LOGO_DEV_PUBLISHABLE_KEY` without exposing it to logs.
- [ ] Replace missing App Store and Google Play URLs in the SubIQ presentation
      configuration. A badge without a real destination is a release blocker.
- [ ] Deploy the two `articles` composite indexes in
      `firestore.indexes.json`, wait until both report `READY`, and verify the
      topic and non-topic Blog queries against production-shaped staging data.
- [ ] Record current DNS, hosting revision, Firestore export location, and
      rollback owner.
- [ ] Pass `npm run check` and both build modes:

```sh
npm run build
PUBLIC_ROUTE_MODE=root PUBLIC_PROJECT_ID=subiq npm run build
```

## Rehearsal

1. Export the legacy Firestore database to a timestamped, access-restricted
   location. Never use production as the first migration target.
2. Inventory only `projects/subiq` and its descendants. Fail the rehearsal if
   another project appears in the proposed write set.
3. Classify every legacy SubIQ Article as draft, valid published, or quarantine.
   A published record must have a stable slug and valid title, excerpt, topic,
   publication timestamp, and final MDX content.
4. Map embedded translations only when their locale is in
   `src/config/supported-locales.ts`. Approved translations require a published
   parent; unsupported or invalid translations go to the reconciliation report.
5. Run migration through feature-owned validation/write contracts. Record the
   legacy document ID and migration version so reruns are idempotent.
6. Reconcile source/target counts, statuses, source slugs, translated slugs,
   topics, and canonical URLs. Every mismatch must be resolved or quarantined
   with a reason.
7. Exercise the shared paths (`/subiq/...`) and dedicated paths (`/...`) at
   1600, 980, 700, and 390 pixels. Include keyboard navigation, reduced motion,
   all 21 locale labels, metadata, sitemap, robots, and fallback `noindex`.
8. Rehearse rollback by returning traffic to the recorded legacy revision. Do
   not delete migrated data during rollback.

## Production cutover

1. Announce and start the SubIQ-only editorial freeze. Other projects remain
   untouched.
2. Capture a final legacy export and run the final SubIQ delta migration.
3. Reconcile again; stop on missing public Articles, newly invalid content,
   duplicate slug reservations, or any non-SubIQ write.
4. Deploy the verified application revision without switching traffic.
5. Smoke test landing, Blog archive/article, one approved translation, one
   source fallback, support, privacy, terms, sitemap, and robots.
6. Switch SubIQ routing/DNS. Preserve legacy canonical URLs or install reviewed
   permanent redirects before traffic moves.
7. Verify status codes, canonicals, `hreflang`, `noindex`, logs, latency, and
   error rate immediately, at 15 minutes, and at 60 minutes.
8. Make the legacy SubIQ editor read-only after the new admin publishes and the
   public page reflects one verified production change.

## Rollback

Rollback when public routes fail, published content is missing, canonical URLs
change unexpectedly, cross-project data is visible, or error/latency thresholds
are exceeded.

1. Route SubIQ traffic back to the recorded legacy revision/DNS target.
2. Keep the editorial freeze in place and preserve both Firestore exports.
3. Disable only the failed SubIQ deployment; do not delete new documents or
   touch other Project data.
4. Capture logs and the failed revision, reconcile the delta, fix in staging,
   and repeat the rehearsal before another attempt.

## Observation and closure

- Monitor for the agreed observation window before removing credentials or
  decommissioning legacy services.
- Record the final revision, migration report, Firestore export, DNS state,
  index state, smoke results, rollback result, and approval owner.
- Phase 04 is complete only after this runbook has been executed successfully;
  code completion alone is not production cutover.

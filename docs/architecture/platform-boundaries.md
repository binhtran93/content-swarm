# Platform boundaries

These invariants apply across all Projects. Concrete schemas, prompts, and
behavior belong in production code and tests.

## Project identity and data isolation

- Every Project has one permanent lowercase `projectId`.
- Firestore data is isolated under `projects/{projectId}` and its owned
  subcollections.
- Routes, public queries, cache keys, sitemap generation, acquisition writes,
  and publishing operations must use an explicit `projectId`.
- A request for one Project must never read, render, mutate, or cache another
  Project's data.
- Historical route or brand aliases must be documented and implemented as
  explicit redirects; they are not alternate Project IDs.

## Firebase and secrets

- The central ANMISOFT Firebase project is the website's Auth, Firestore, Admin,
  waitlist, and editorial backend.
- A mobile app's Firebase project does not replace or configure the central
  website backend.
- Browser Firebase configuration and GA4 measurement IDs may be public. Firebase
  Admin credentials, service-account keys, AI/provider secrets, and waitlist
  secrets must remain server-only.
- Automated tests use emulators or isolated test credentials, never production
  credentials.

## Public and private surfaces

- Backoffice commands and queries require the verified owner and enforce Project
  ownership.
- Public services are server-side and read-only. They expose published Articles
  and approved Translations only; drafts, archived content, prompts, discoveries,
  and private Project descriptions remain private.
- Unknown or mismatched dedicated deployment IDs fail closed and never default
  to an existing Project.

## Site ownership

- The Firestore Project stores editorial and acquisition configuration.
- Every Project has a minimum public surface under its ANMISOFT subpath:
  Support, Privacy, and Terms. A landing page is optional and belongs to a
  separate launch phase.
- A full public site has one hosting mode at a time: ANMISOFT subpath or
  dedicated domain.
- Canonical domains, presentation, layout, navigation, content, localization,
  assets, theme, metadata, and optional GA4 measurement ID are code-owned by the
  public site.
- Project website analytics runs only on a dedicated canonical domain, never on
  an ANMISOFT subpath.
- Shared public components are optional building blocks. A Project may use its
  own presentation while preserving the shared isolation and routing contracts.

## AI behavior

- Interactive AI actions produce an unsaved proposal.
- AI never automatically saves, approves, advances workflow state, publishes,
  archives, or performs a paid provider call without explicit owner authority.
  Enabling a bounded Project automation is explicit continuing authority for
  that automation; disabling it revokes authority for future scheduled runs.
- Scheduled automation uses a dedicated authenticated identity, remains scoped
  to enabled Projects owned by the deployed owner, and preserves the same
  content and publication validation as interactive commands.
- Production prompt definitions and their tests are authoritative; do not copy
  prompt bodies into documentation.

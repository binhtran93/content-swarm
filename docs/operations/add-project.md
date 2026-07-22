# Add a Project

This is the canonical procedure for adding a Project. Project delivery has two
separate phases:

1. **Project foundation:** required for every Project. Create the central
   ANMISOFT Firestore workspace and publish Support, Privacy, and Terms on the
   Project's ANMISOFT subpath.
2. **Full public site:** optional. Add a landing page and related public features
   either on the ANMISOFT subpath or on a dedicated domain.

Complete Phase 1 without waiting for a landing page, dedicated domain, marketing
assets, SEO plan, or website Analytics. Start Phase 2 only when the Project needs
a full public site. A Project may remain at Phase 1 permanently.

Use the same permanent `projectId` throughout both phases. Document historical
aliases separately; never use an alias as a second Project ID.

## Phase 1: Project foundation

### 1. Define the Project manifest

Record these inputs before editing code:

| Field            | Requirement                                                                                                          |
| ---------------- | -------------------------------------------------------------------------------------------------------------------- |
| `projectId`      | Permanent, unique, lowercase letters/numbers separated by single hyphens; maximum 63 characters                      |
| Name             | Public and backoffice display name; maximum 100 characters                                                           |
| Description      | Audience, purpose, and editorial/AI context; maximum 5,000 characters                                                |
| Internal path    | `/{projectId}` unless a reviewed historical redirect is required                                                     |
| Acquisition      | `waitlist` or `stores`; include reviewed App Store and Google Play URLs when applicable                              |
| Editorial inputs | Initial topics and normalized competitor domains                                                                     |
| Support          | Support email, expected response guidance, account deletion, subscription, cancellation, and refund behavior         |
| Privacy          | Actual app data practices, processors, AI providers, Analytics/diagnostics, advertising, retention, and user choices |
| Terms            | Legal entity, eligibility, acceptable use, subscriptions, refunds, disclaimers, governing terms, and effective date  |

Phase 1 does **not** require a dedicated domain, landing page, Project-specific
marketing assets, SEO work, localization, Blog, or website Analytics. If a
historical app or URL uses another name, record one mapping such as
`jewelry-identifier -> jlens` and implement only reviewed redirects.

Do not invent legal facts, provider names, store URLs, or data practices. Record
missing legal inputs as blockers for the affected page.

### 2. Create the central workspace

1. Sign in at `/admin` with the configured owner account.
2. Open `/admin/projects/new`.
3. Create the Project with its permanent ID, name, and description.
4. Open `/admin/projects/{projectId}/settings`.
5. Configure acquisition mode and reviewed store URLs when applicable.
6. Add initial topics and competitor domains.
7. Verify `projects/{projectId}` exists in the central ANMISOFT Firestore,
   belongs to the authenticated owner, and has `status: "active"`.

Do not store a public domain in the Project document. Public URL and presentation
configuration is code-owned.

### 3. Add the required public pages

1. Add `projectId: "/{projectId}"` to
   `src/public-site/config/public-projects.ts`.
2. Create `src/public-site/sites/{projectId}/`.
3. Add a typed `site-config.ts` using `LegalSiteConfig`.
4. Use `LegalSiteShell` for the Phase 1 public surface. Do not create a landing
   page or copy `SiteShell` merely to provide legal pages.
5. Add reviewed `support-page.tsx`, `privacy-page.tsx`, and `terms-page.tsx`
   implementations.
6. Add explicit App Router routes under `src/app/(public)/{projectId}` for:
   - `/{projectId}/support`
   - `/{projectId}/privacy`
   - `/{projectId}/terms`
7. Add basic page titles and descriptions, cross-links, responsive styling, and
   accessible navigation.

Phase 1 must not wait for a Project logo or favicon. When Project assets are not
available, use the approved shared, text-only fallback supported by the legal
site components. If the component does not yet support an assetless Project,
add that shared capability instead of inventing or copying temporary assets.

Do not add GA4, a cookie, a landing page, a sitemap entry, Blog routes, or a
dedicated deployment in Phase 1. Legal text may disclose Analytics used by the
mobile app, but it must not claim the Phase 1 website uses Analytics when it
does not.

### 4. Verify Phase 1

Add tests for the Project configuration, legal route rendering, navigation,
asset fallback, and isolation from other Projects. Run:

```sh
npm run check
```

Smoke-test all three URLs on the main deployment. Confirm:

- Support, Privacy, and Terms are accurate, readable, linked to each other, and
  safe to use in app-store listings.
- The routes stay under `anmisoft.com/{projectId}` and do not impersonate
  another Project.
- No landing page, Project website Analytics, or dedicated-domain canonical URL
  is emitted accidentally.
- The central workspace is active and owned by the authenticated owner.

Phase 1 is complete only when the workspace and all three required public pages
are live and verified.

## Phase 2: Optional full public site

### 5. Define the public-site manifest

Do not reuse the Phase 1 manifest as an implicit marketing specification. Record
the Phase 2 decisions separately:

| Field           | Requirement                                                                                           |
| --------------- | ----------------------------------------------------------------------------------------------------- |
| Hosting mode    | Exactly one of `subpath` or `dedicated`                                                               |
| Canonical URL   | `https://anmisoft.com/{projectId}` for subpath mode, or the dedicated HTTPS origin for dedicated mode |
| Landing         | Audience, positioning, sections, calls to action, and approved copy                                   |
| Locales         | Default locale, supported locales, reviewed translations, fallback, and `noindex` behavior            |
| Acquisition     | Waitlist or stores, presentation, and final destination URLs                                          |
| Public features | Landing, Blog, localization, redirects, sitemap, robots, and structured-data requirements             |
| Assets          | Logo, favicon, screenshots, store badges, social images, and final Project-owned paths                |
| Analytics       | Dedicated mode: matching GA4 `G-...` ID or explicit opt-out; subpath mode: disabled                   |

The Project may launch directly in either hosting mode. Subpath mode is not a
temporary preview, and a dedicated domain is not mandatory. A subpath site may
be promoted later through the dedicated-domain transition below.

### 6. Upgrade the public-site implementation

1. Replace the Phase 1 `LegalSiteConfig` with a typed `PublicSiteConfig` defined
   through `definePublicSiteConfig`.
2. Use `SiteShell` for the full site. Preserve and integrate the existing
   reviewed Support, Privacy, and Terms content rather than maintaining two
   implementations.
3. Add identity, hosting/canonical configuration, locales, brand, navigation,
   footer, acquisition presentation, assets, and theme settings from the
   manifest.
4. Add the landing page, metadata, scoped theme, and required assets.
   Build standard heroes with `LandingHero`, or use `ViewportHero` when the
   visual composition needs custom markup. Both keep the first section within
   the available desktop viewport. Render app screens with `PhoneScreenshot`,
   or combine `ResponsivePhoneComposition` with `PhoneFrame` for custom phone
   UI, so phone size and shell geometry scale consistently across viewport
   heights. Phone-size overrides are intentionally unsupported; do not copy
   sizing rules into a Project stylesheet.
5. Add localization and Blog files only when the manifest enables them.
6. Update Privacy and Terms for website Analytics, waitlist collection,
   Turnstile, cookies, and other third parties actually enabled in Phase 2.

Never import backoffice components or write services into the public site.

### 7. Wire routes and Project isolation

1. Add the landing route and every enabled feature to the explicit App Router
   tree under `src/app/(public)/{projectId}`.
2. Add the Project to public routing and acquisition-read allowlists.
3. Update localized dispatch, robots, sitemap, and admin Article preview and
   canonical selection when those features are enabled.
4. Add only reviewed permanent redirects for historical paths or identifiers.
5. Verify unknown or mismatched `PUBLIC_PROJECT_ID` values fail clearly; no
   Project may fall back to SubIQ or another existing site.

The runtime still contains explicit SubIQ dispatch points. Review them before
declaring any full site wired:

```sh
rg -n 'subiq|Subiq|PUBLIC_PROJECT_ID|publicProject|robots|sitemap' \
  src next.config.ts .env.example
```

Do not blindly rename SubIQ-owned presentation or localization code. Extract
shared behavior only when it is genuinely shared.

### 8. Configure the selected hosting mode

#### Subpath mode

- Serve the landing site at `https://anmisoft.com/{projectId}` from the main
  deployment.
- Keep `PUBLIC_ROUTE_MODE=project` and do not add the Project to
  `PUBLIC_DISABLED_PROJECTS`.
- Do not configure a dedicated deployment, DNS, or Project website Analytics.
- Emit canonical URLs including `/{projectId}`. The current full-site canonical
  helper assumes a dedicated origin; extend and test that helper before using
  subpath mode. Never emit `https://anmisoft.com/` as the Project canonical and
  never configure a fake dedicated origin.

#### Dedicated mode

- Configure the code-owned canonical HTTPS origin and the Project's root-domain
  routes.
- Use the Project's GA4 `G-...` measurement ID directly; do not initialize its
  mobile Firebase project in the website.
- Keep website Auth, Firestore, Firebase Admin, waitlist records, and editorial
  content on the central ANMISOFT Firebase project.
- Configure hostname-restricted Turnstile and waitlist secrets when waitlist
  mode is enabled.
- Deploy with:

```env
PUBLIC_PROJECT_ID={projectId}
PUBLIC_ROUTE_MODE=root
```

Configure DNS, HTTPS, environment secrets, and a known-good rollback revision.
Analytics must remain production-, root-deployment-, Project-, and
canonical-host-gated.

If Phase 1 or a previous subpath launch exposed URLs externally, preserve them
with reviewed permanent redirects to the equivalent dedicated URLs. This is
especially important for Support, Privacy, and Terms URLs registered with app
stores. Do not add the Project to `PUBLIC_DISABLED_PROJECTS` while those URLs
would become unexplained 404 responses.

After redirects and the dedicated deployment are verified, the main deployment
may stop rendering the Project content. Preserve all existing disabled IDs when
updating `PUBLIC_DISABLED_PROJECTS`.

### 9. Verify and launch Phase 2

Add coverage for the enabled behavior:

- Site configuration and asset paths.
- Shared routing and, for dedicated mode, root routing and proxy isolation.
- Canonical URLs, locale alternates, metadata, sitemap, robots, and redirects.
- Public-content isolation and draft/translation visibility.
- Analytics disabled in subpath mode and correctly gated in dedicated mode.
- Waitlist or store acquisition behavior.

Run the complete repository verification. Also run the dedicated build when
using dedicated mode:

```sh
npm run check
PUBLIC_ROUTE_MODE=root PUBLIC_PROJECT_ID={projectId} npm run build
```

Smoke-test the landing page, every supported locale, optional Blog, Support,
Privacy, Terms, acquisition actions, favicon, metadata, sitemap, robots, and
redirects. Confirm another Project's content cannot appear.

For dedicated mode, deploy before switching DNS, verify GA4 Realtime receives
only canonical-domain traffic, then switch traffic and monitor errors and
canonical URLs. Retain the previous revision for rollback.

Phase 2 is complete only when the selected hosting mode, landing site, SEO,
acquisition flow, Analytics decision, isolation, monitoring, and rollback path
are verified. Phase 2 completion does not change the permanent `projectId` or
central Firestore workspace created in Phase 1.

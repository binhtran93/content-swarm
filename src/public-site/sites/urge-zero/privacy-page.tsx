import Link from "next/link";

import type { Metadata } from "next";
import {
  defaultLocale,
  type SupportedLocaleCode,
} from "@/config/supported-locales";
import { withPublicRoute } from "@/public-site/config/public-url";
import { urgeZeroSiteConfig } from "@/public-site/sites/urge-zero/site-config";
import { createUrgeZeroStaticPageMetadata } from "@/public-site/sites/urge-zero/static-page-seo";

export const metadata: Metadata = createUrgeZeroStaticPageMetadata(
  "privacy",
  defaultLocale,
);

const sectionClassName = "mb-8";
const headingClassName = "mb-3 text-2xl font-semibold";
const copyClassName = "leading-8 text-zinc-700";
const listClassName = "list-disc space-y-2 pl-6 leading-8 text-zinc-700";

export default function UrgeZeroPrivacyPage({
  locale = defaultLocale,
}: {
  locale?: SupportedLocaleCode;
}) {
  const supportHref = withPublicRoute(urgeZeroSiteConfig, locale, "/support");

  return (
    <main className="legal-document flex flex-1 justify-center bg-zinc-50 px-4 py-12 text-zinc-900">
      <article className="legal-document__article w-full max-w-3xl rounded-xl bg-white p-6 shadow-sm sm:p-10">
        <h1 className="mb-3 text-3xl font-semibold tracking-tight">
          Privacy Policy
        </h1>
        <p className="mb-8 text-sm text-zinc-600">Last updated: 22 July 2026</p>

        <p className={`mb-6 ${copyClassName}`}>
          This Privacy Policy explains how UrgeZero handles information when you
          use the UrgeZero mobile app, visit urgezero.com, or contact support.
          UrgeZero is designed to work without asking you to create a public
          profile or provide an email address during onboarding.
        </p>

        <section className={sectionClassName}>
          <h2 className={headingClassName}>Information the app handles</h2>
          <ul className={listClassName}>
            <li>
              <strong>Anonymous account data:</strong> the app uses an anonymous
              account identifier so it can associate your app data with your
              installation and session.
            </li>
            <li>
              <strong>Your progress and choices:</strong> this can include your
              onboarding answers, personal reasons and promise, streak and
              battle records, relapse check-ins, app-protection selections,
              activity history, and focus-game scores.
            </li>
            <li>
              <strong>Coach and generated content:</strong> prompts you send to
              Coach and the recent conversation needed to answer them are
              processed to generate a response. Requests for facts, stories, or
              Bible verses are also processed to provide the selected content.
            </li>
            <li>
              <strong>Community content:</strong> if you choose to post, the
              message and information displayed with it, such as a streak, can
              be visible to other UrgeZero users. Likes and moderation-related
              information may also be recorded.
            </li>
            <li>
              <strong>Purchases and app operation:</strong> subscription
              entitlement information, app version, device or platform details,
              diagnostics, and similar technical events may be processed to
              deliver purchases, troubleshoot issues, and improve reliability.
            </li>
            <li>
              <strong>Support messages:</strong> if you email us, we receive the
              email address and any information you choose to include.
            </li>
          </ul>
        </section>

        <section className={sectionClassName}>
          <h2 className={headingClassName}>Camera and app protection</h2>
          <p className={copyClassName}>
            Urge Emergency can show a live front-camera preview while a battle
            is active. UrgeZero does not capture, store, or upload a photo from
            that preview. If you enable app protection, your device&apos;s
            operating-system controls are used to select and shield supported
            apps or activity categories. The available controls differ by
            platform and require the permissions you choose to grant.
          </p>
        </section>

        <section className={sectionClassName}>
          <h2 className={headingClassName}>How information is used</h2>
          <p className="mb-3 leading-8 text-zinc-700">
            We use the information described above to:
          </p>
          <ul className={listClassName}>
            <li>provide streaks, Urge Emergency, activities, and community;</li>
            <li>personalize reminders with the reasons you chose to save;</li>
            <li>generate Coach and other requested content;</li>
            <li>manage subscription access and restore purchases;</li>
            <li>protect the service, moderate content, and prevent misuse;</li>
            <li>
              diagnose problems and improve app and website performance; and
            </li>
            <li>respond when you contact support.</li>
          </ul>
        </section>

        <section className={sectionClassName}>
          <h2 className={headingClassName}>Service providers</h2>
          <p className={`mb-3 ${copyClassName}`}>
            UrgeZero relies on service providers to operate specific features.
            Information is shared only as needed for those services, including:
          </p>
          <ul className={listClassName}>
            <li>
              Google Firebase for anonymous authentication, cloud data storage,
              backend functions, and app diagnostics;
            </li>
            <li>
              Google Gemini for Coach and other content you ask the app to
              generate;
            </li>
            <li>RevenueCat for subscription status and entitlements; and</li>
            <li>
              Apple and Google for app distribution, purchases, device
              permissions, and platform services.
            </li>
          </ul>
          <p className={`mt-4 ${copyClassName}`}>
            These providers process information under their own terms and
            privacy practices. We do not sell personal information and the app
            does not use advertising SDKs to show targeted ads.
          </p>
        </section>

        <section className={sectionClassName}>
          <h2 className={headingClassName}>Website analytics and cookies</h2>
          <p className={copyClassName}>
            The production website at urgezero.com uses Google Analytics 4 to
            understand visits and improve the site. Google Analytics can use
            cookies or similar browser storage and can process information such
            as pages viewed, approximate location, device and browser details,
            and referral information. UrgeZero website analytics is configured
            only for the production dedicated domain; it is not enabled on the
            UrgeZero pages hosted under anmisoft.com, previews, or local
            development. You can limit cookies through your browser settings.
          </p>
        </section>

        <section className={sectionClassName}>
          <h2 className={headingClassName}>Retention and deletion</h2>
          <p className={copyClassName}>
            Information is kept for as long as needed to provide the relevant
            feature, maintain security and records, resolve disputes, and meet
            legal obligations. Community content can remain visible until it is
            removed or the associated data is deleted. You can use deletion
            controls available in the app or contact support to request deletion
            of data connected to your anonymous account. We may need information
            from the app to identify the correct record.
          </p>
        </section>

        <section className={sectionClassName}>
          <h2 className={headingClassName}>Security</h2>
          <p className={copyClassName}>
            We use reasonable administrative and technical measures to protect
            information. No internet transmission or storage system is
            completely secure, so absolute security cannot be guaranteed.
          </p>
        </section>

        <section className={sectionClassName}>
          <h2 className={headingClassName}>Children</h2>
          <p className={copyClassName}>
            UrgeZero is not directed to children under 13, and we do not
            knowingly collect personal information from children under 13. If
            you believe a child has provided information, contact us so we can
            review and remove it as appropriate.
          </p>
        </section>

        <section className={sectionClassName}>
          <h2 className={headingClassName}>Changes to this policy</h2>
          <p className={copyClassName}>
            We may update this policy when the service or applicable
            requirements change. The date at the top identifies the latest
            published version.
          </p>
        </section>

        <section>
          <h2 className={headingClassName}>Contact</h2>
          <p className={copyClassName}>
            For privacy questions or requests, email support@anmisoft.com or
            visit the{" "}
            <Link
              className="font-medium text-zinc-900 underline-offset-4 hover:underline"
              href={supportHref}
            >
              UrgeZero support page
            </Link>
            .
          </p>
        </section>
      </article>
    </main>
  );
}

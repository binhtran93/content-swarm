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
  "terms",
  defaultLocale,
);

const sectionClassName = "mb-8";
const headingClassName = "mb-3 text-2xl font-semibold";
const copyClassName = "leading-8 text-zinc-700";
const listClassName = "list-disc space-y-2 pl-6 leading-8 text-zinc-700";

export default function UrgeZeroTermsPage({
  locale = defaultLocale,
}: {
  locale?: SupportedLocaleCode;
}) {
  const privacyHref = withPublicRoute(urgeZeroSiteConfig, locale, "/privacy");
  const supportHref = withPublicRoute(urgeZeroSiteConfig, locale, "/support");

  return (
    <main className="legal-document flex flex-1 justify-center bg-zinc-50 px-4 py-12 text-zinc-900">
      <article className="legal-document__article w-full max-w-3xl rounded-xl bg-white p-6 shadow-sm sm:p-10">
        <h1 className="mb-3 text-3xl font-semibold tracking-tight">
          Terms and Conditions
        </h1>
        <p className="mb-8 text-sm text-zinc-600">Last updated: 22 July 2026</p>

        <p className={`mb-6 ${copyClassName}`}>
          These Terms and Conditions apply when you use the UrgeZero mobile app
          or website. By using UrgeZero, you agree to these terms and the{" "}
          <Link
            className="font-medium text-zinc-900 underline-offset-4 hover:underline"
            href={privacyHref}
          >
            Privacy Policy
          </Link>
          . If you do not agree, do not use the service.
        </p>

        <section className={sectionClassName}>
          <h2 className={headingClassName}>Eligibility and acceptable use</h2>
          <p className={`mb-3 ${copyClassName}`}>
            You must be at least 13 years old to use UrgeZero. The app may
            create an anonymous account identifier for you without requiring a
            public profile. You agree not to:
          </p>
          <ul className={listClassName}>
            <li>break the law or violate another person&apos;s rights;</li>
            <li>
              access the service or another user&apos;s data without permission;
            </li>
            <li>upload malicious code or disrupt the service;</li>
            <li>
              harass others or post sexual, hateful, violent, or abusive
              content;
            </li>
            <li>impersonate another person or misrepresent your content; or</li>
            <li>
              copy, scrape, reverse engineer, or exploit the service unlawfully.
            </li>
          </ul>
        </section>

        <section className={sectionClassName}>
          <h2 className={headingClassName}>Self-improvement, not treatment</h2>
          <p className={copyClassName}>
            UrgeZero provides self-improvement and educational tools. It does
            not provide medical or mental-health advice, diagnosis, treatment,
            therapy, or emergency services. It is not a substitute for a
            qualified professional. If you may harm yourself or someone else,
            contact local emergency services or a crisis service available in
            your location immediately.
          </p>
        </section>

        <section className={sectionClassName}>
          <h2 className={headingClassName}>Coach and generated content</h2>
          <p className={copyClassName}>
            Coach, facts, stories, and verses can be generated or selected using
            automated systems. Results can be incomplete, inaccurate, or
            unsuitable for your situation. You are responsible for deciding how
            to use them and should not rely on them for medical, legal,
            financial, safety-critical, or emergency decisions.
          </p>
        </section>

        <section className={sectionClassName}>
          <h2 className={headingClassName}>Community content</h2>
          <p className={`mb-3 ${copyClassName}`}>
            You keep ownership of content you submit. By posting content, you
            grant us a worldwide, non-exclusive, royalty-free license to host,
            reproduce, display, and distribute it only as needed to operate,
            secure, moderate, and improve the UrgeZero community.
          </p>
          <p className={copyClassName}>
            You are responsible for your posts. Do not share information you do
            not want other users to see. We may review, limit, or remove content
            and restrict access when reasonably necessary to enforce these
            terms, protect users, or comply with law. Community availability
            does not mean we endorse a post or can prevent every harmful post.
          </p>
        </section>

        <section className={sectionClassName}>
          <h2 className={headingClassName}>App protection and permissions</h2>
          <p className={copyClassName}>
            App-protection features depend on device permissions and operating
            system capabilities. You control which permissions and supported
            apps or categories to select. Platform restrictions, configuration,
            or technical limits may prevent protection from working in every
            situation, so you should not treat it as a guaranteed block.
          </p>
        </section>

        <section className={sectionClassName}>
          <h2 className={headingClassName}>Subscriptions and purchases</h2>
          <p className={`mb-3 ${copyClassName}`}>
            Some features may require a paid subscription or in-app purchase.
            Prices, trial terms, billing intervals, and renewal information are
            shown before purchase. Purchases are processed by Apple or Google
            and subscription status is managed with RevenueCat.
          </p>
          <ul className={listClassName}>
            <li>
              Subscriptions renew automatically unless cancelled through the
              relevant store before renewal.
            </li>
            <li>
              Manage or cancel a subscription in your Apple App Store or Google
              Play account settings.
            </li>
            <li>
              Refund requests are handled by the store and are subject to that
              store&apos;s current rules and decision.
            </li>
          </ul>
        </section>

        <section className={sectionClassName}>
          <h2 className={headingClassName}>Ownership</h2>
          <p className={copyClassName}>
            Except for user content and third-party materials, the UrgeZero
            software, design, text, graphics, branding, and related service
            content are protected by intellectual-property laws. These terms
            give you a limited, personal, non-transferable right to use the
            service; they do not transfer ownership to you.
          </p>
        </section>

        <section className={sectionClassName}>
          <h2 className={headingClassName}>Service changes and termination</h2>
          <p className={copyClassName}>
            We may update, suspend, or discontinue features and may restrict or
            terminate access for misuse, security risk, legal requirements, or a
            material violation of these terms. You may stop using UrgeZero at
            any time and can use available in-app controls or contact support
            regarding deletion of associated data.
          </p>
        </section>

        <section className={sectionClassName}>
          <h2 className={headingClassName}>Disclaimers and liability</h2>
          <p className={copyClassName}>
            To the extent permitted by applicable law, UrgeZero is provided
            &quot;as is&quot; and &quot;as available&quot; without warranties
            that it will be uninterrupted, error-free, or achieve a particular
            outcome. To the extent permitted by law, we are not liable for
            indirect, incidental, special, consequential, or punitive damages
            arising from use of the service. Nothing in these terms excludes
            rights or liability that cannot legally be excluded.
          </p>
        </section>

        <section className={sectionClassName}>
          <h2 className={headingClassName}>Changes to these terms</h2>
          <p className={copyClassName}>
            We may update these terms when the service or applicable
            requirements change. The date at the top identifies the latest
            published version. If a change is material, we may also provide
            notice in the app or through another reasonable channel.
          </p>
        </section>

        <section>
          <h2 className={headingClassName}>Contact</h2>
          <p className={copyClassName}>
            Questions about these terms can be sent to support@anmisoft.com or
            through the{" "}
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

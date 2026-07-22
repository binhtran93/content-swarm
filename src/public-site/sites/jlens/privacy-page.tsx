import type { Metadata } from "next";
import Link from "next/link";

import {
  defaultLocale,
  type SupportedLocaleCode,
} from "@/config/supported-locales";
import { withPublicRoute } from "@/public-site/config/public-url";
import { jlensSiteConfig } from "@/public-site/sites/jlens/site-config";
import { createJlensStaticPageMetadata } from "@/public-site/sites/jlens/static-page-seo";

export const metadata: Metadata = createJlensStaticPageMetadata(
  "privacy",
  defaultLocale,
);

export default function JewelryIdentifierPrivacyPage({
  locale = defaultLocale,
}: {
  locale?: SupportedLocaleCode;
}) {
  const supportHref = withPublicRoute(jlensSiteConfig, locale, "/support");

  return (
    <main className="legal-document flex flex-1 justify-center bg-zinc-50 px-4 py-12 text-zinc-900">
      <article className="legal-document__article w-full max-w-3xl rounded-xl bg-white p-6 shadow-sm sm:p-10">
        <h1 className="mb-3 text-3xl font-semibold tracking-tight">
          Privacy Policy
        </h1>
        <p className="mb-8 text-sm text-zinc-600">Effective Date: 02.07.2026</p>

        <p className="mb-6 leading-8 text-zinc-700">
          At Jewelry Identifier / JLens (&quot;we,&quot; &quot;our,&quot; or
          &quot;us&quot;), we prioritize your privacy and are committed to
          safeguarding your personal information. This privacy policy explains
          what information we collect, how we collect it, how we use it, when we
          share it, how long we keep it, and how you can manage your choices.
          Where required, JLens asks for your permission before sending your
          personal data to third-party AI services.
        </p>

        <section className="mb-8">
          <h2 className="mb-3 text-2xl font-semibold">Data We Collect</h2>
          <p className="mb-3 leading-8 text-zinc-700">
            Depending on how you use JLens, we may collect the following
            information:
          </p>
          <ul className="list-disc space-y-2 pl-6 leading-8 text-zinc-700">
            <li>
              Photos and images you choose to capture with your device camera or
              upload from your photo library. These images may contain jewelry,
              objects, locations, documents, faces, certificates, hallmarks,
              receipts, or other personal visual information.
            </li>
            <li>
              Questions, prompts, follow-up messages, analysis requests, topic
              requests, and other text you submit in the app.
            </li>
            <li>
              AI-generated responses, jewelry analysis results, saved results,
              and conversation or history records created from your app
              activity.
            </li>
            <li>
              Account or contact information, such as your email address, when
              you provide it for account setup, support, or communication.
            </li>
            <li>
              App usage, diagnostics, analytics, subscription status, purchase
              entitlement, device, and app metadata where collected to operate,
              secure, and improve JLens.
            </li>
            <li>
              Website cookies and similar technologies that help us remember
              preferences, improve browsing, and understand website traffic.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-2xl font-semibold">How We Collect Data</h2>
          <ul className="list-disc space-y-2 pl-6 leading-8 text-zinc-700">
            <li>
              Directly from you when you capture or upload photos, type
              questions, send follow-up messages, select analysis topics, create
              an account, contact support, or manage app settings.
            </li>
            <li>
              Automatically from your use of JLens, including app usage,
              diagnostics, analytics, subscription status, purchase entitlement,
              security logs, and device or app metadata.
            </li>
            <li>
              From generated app activity, such as AI results, saved scans,
              history records, and conversation messages created when you use
              JLens features.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-2xl font-semibold">How We Use Data</h2>
          <p className="mb-3 leading-8 text-zinc-700">
            We use the information we collect to:
          </p>
          <ul className="list-disc space-y-2 pl-6 leading-8 text-zinc-700">
            <li>
              Identify jewelry and provide AI-powered answers based on content
              you submit.
            </li>
            <li>
              Generate jewelry analysis, estimated value ranges, hallmark and
              certificate observations, care guidance, topic responses,
              summaries, and follow-up replies that you request.
            </li>
            <li>
              Save results, history, and conversations when needed for app
              features.
            </li>
            <li>
              Maintain accounts, subscriptions, purchase entitlements, app
              settings, customer support, and user communications.
            </li>
            <li>
              Operate, secure, troubleshoot, and improve JLens, including
              reliability, diagnostics, analytics, abuse prevention, and legal
              compliance.
            </li>
            <li>
              Improve website and app performance, functionality, and user
              experience where analytics or diagnostics are collected.
            </li>
          </ul>
          <p className="mt-4 leading-8 text-zinc-700">
            We do not sell your personal information. We do not use your photos,
            questions, or AI results for third-party advertising.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-2xl font-semibold">
            AI Processing and Google Gemini AI
          </h2>
          <p className="mb-4 leading-8 text-zinc-700">
            JLens uses Google Gemini AI, operated by Google LLC, to identify
            jewelry, analyze photos, estimate value ranges, and answer
            questions. Before JLens sends your photos or questions to Google
            Gemini AI, the app asks for your in-app permission through the AI
            Processing Consent prompt.
          </p>
          <p className="mb-3 leading-8 text-zinc-700">
            When you choose AI processing, JLens may securely send the following
            data to Google Gemini AI:
          </p>
          <ul className="mb-4 list-disc space-y-2 pl-6 leading-8 text-zinc-700">
            <li>Photos and images you select, capture, or upload.</li>
            <li>
              Questions, prompts, follow-up messages, analysis requests, and
              topic requests you submit.
            </li>
            <li>
              Request context needed to generate the result, such as language
              preference, selected analysis mode, display currency, and similar
              app settings for that request.
            </li>
          </ul>
          <p className="leading-8 text-zinc-700">
            This data is shared with Google Gemini AI only to generate the
            jewelry identification, answer, analysis, topic response, or
            follow-up response you request. Google may process this data under
            Google&apos;s Gemini API terms for service operation, safety,
            security, abuse prevention, and legal compliance.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-2xl font-semibold">
            Third Parties We Share Data With
          </h2>
          <p className="mb-3 leading-8 text-zinc-700">
            We share data only as needed to provide, operate, secure, and
            improve JLens. The third parties that may receive user data include:
          </p>
          <ul className="list-disc space-y-2 pl-6 leading-8 text-zinc-700">
            <li>
              Google LLC / Google Gemini AI: receives the photos, images,
              questions, prompts, follow-up messages, analysis requests, topic
              requests, and request context described above to generate AI
              results.
            </li>
            <li>
              Google Analytics: receives website usage, device, and performance
              data on the dedicated JLens website to help us understand traffic
              and improve the website experience.
            </li>
            <li>
              Firebase services: receive app usage, performance, authentication,
              database, storage, server, diagnostics, and crash data needed to
              operate and improve JLens app features.
            </li>
            <li>
              Cloud hosting, authentication, database, storage, and server
              providers: process data needed to run JLens features, store user
              history, secure accounts, and deliver app functionality.
            </li>
            <li>
              App store, subscription, and payment providers: process purchase,
              subscription, and entitlement data needed to manage access to paid
              features.
            </li>
            <li>
              Diagnostics, crash reporting, security, and support providers:
              process technical and support data needed to troubleshoot, prevent
              abuse, secure the service, and respond to user requests.
            </li>
          </ul>
          <p className="mt-4 leading-8 text-zinc-700">
            We require third-party providers that receive user data to protect
            that data with the same or equal level of protection described in
            this privacy policy and required by applicable App Store privacy
            requirements. These providers may also process data under their own
            privacy policies and data processing terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-2xl font-semibold">
            AI Consent and Revocation
          </h2>
          <p className="mb-3 leading-8 text-zinc-700">
            JLens asks for your permission before sending photos, images,
            questions, prompts, or follow-up messages to Google Gemini AI. You
            can choose:
          </p>
          <ul className="list-disc space-y-2 pl-6 leading-8 text-zinc-700">
            <li>
              Agree &amp; Continue: JLens saves your AI Processing Consent on
              your device and sends the selected request for AI processing.
            </li>
            <li>
              Not now: JLens does not send that request to Google Gemini AI, and
              you will be asked again before a future AI processing request.
            </li>
          </ul>
          <p className="mt-4 leading-8 text-zinc-700">
            You can revoke AI Processing Consent in the app at Settings &gt;
            Legal &gt; AI Processing Consent. After revocation, JLens will ask
            again before sending your photos, images, questions, prompts, or
            follow-up messages to Google Gemini AI. Revoking consent does not
            automatically delete AI results, saved scans, history, or
            conversation records that were already created. You can delete saved
            content where the app provides deletion controls or request deletion
            as described below.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-2xl font-semibold">
            Data Retention and Deletion
          </h2>
          <p className="mb-4 leading-8 text-zinc-700">
            We keep personal information only as long as needed to provide JLens
            features, maintain your account, comply with legal obligations,
            resolve disputes, enforce our terms, prevent abuse, and maintain
            security.
          </p>
          <ul className="list-disc space-y-2 pl-6 leading-8 text-zinc-700">
            <li>
              Photos, images, questions, prompts, follow-up messages, AI
              results, saved history, and account-related data may be retained
              while needed to provide history, conversation, support, account,
              or subscription features.
            </li>
            <li>
              You can delete saved content in the app where deletion controls
              are available.
            </li>
            <li>
              You can request deletion of your account or personal data by
              emailing support@anmisoft.com. We will process deletion requests
              promptly.
            </li>
            <li>
              Some information may remain temporarily in backups, logs, security
              records, or legal/compliance records where needed for legitimate
              business, security, or legal reasons.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-2xl font-semibold">
            Your Rights and Choices
          </h2>
          <p className="mb-3 leading-8 text-zinc-700">
            We are committed to giving you control over your information.
            Depending on your location and applicable law, you may have rights
            to access, correct, delete, or receive a copy of your personal
            information. You can manage your data in these ways:
          </p>
          <ul className="list-disc space-y-2 pl-6 leading-8 text-zinc-700">
            <li>
              Edit Your Information: You can update available account details
              directly within JLens.
            </li>
            <li>
              Revoke AI Processing Consent: You can revoke consent in Settings
              &gt; Legal &gt; AI Processing Consent.
            </li>
            <li>
              Delete Saved Content: You can delete saved content where the app
              provides deletion controls.
            </li>
            <li>
              Delete Your Account or Request Data Deletion: You can request
              account or personal data deletion by emailing
              support@anmisoft.com.
            </li>
            <li>
              Opt Out of Targeted Ads: If targeted ads are shown, you can adjust
              your device settings, reset your advertising ID, or change ad
              personalization preferences.
            </li>
          </ul>
          <p className="mt-4 leading-8 text-zinc-700">
            If you need assistance with any of these options, please contact us
            using the details provided below.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-2xl font-semibold">Data Security</h2>
          <p className="leading-8 text-zinc-700">
            We take reasonable precautions to protect your information from
            unauthorized access, loss, or misuse. However, no method of
            electronic storage or transmission is 100% secure, and we cannot
            guarantee absolute security. We encourage users to take precautions
            to protect their accounts, such as using strong passwords and
            keeping login credentials confidential.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-2xl font-semibold">
            Children&apos;s Privacy
          </h2>
          <p className="leading-8 text-zinc-700">
            Our services are intended for general audiences and are not directed
            toward children under 13 years of age. We do not knowingly collect
            personal information from children. If we become aware that a child
            under 13 has provided us with personal data, we will take steps to
            delete such information promptly. Parents or guardians who believe
            their child has provided us with data may contact us to request its
            removal.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-2xl font-semibold">
            Changes to This Policy
          </h2>
          <p className="leading-8 text-zinc-700">
            We may update this privacy policy to reflect changes in our
            services, legal requirements, or industry standards. Updates will be
            posted on this page with an updated &quot;Effective Date.&quot; We
            encourage you to review this policy periodically to stay informed
            about how we are protecting your data.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-2xl font-semibold">Contact Us</h2>
          <p className="mb-3 leading-8 text-zinc-700">
            If you have any questions, concerns, consent revocation issues, or
            data deletion requests related to this privacy policy, please
            contact us:
          </p>
          <ul className="mb-4 list-disc space-y-2 pl-6 leading-8 text-zinc-700">
            <li>Email: support@anmisoft.com</li>
          </ul>
          <p className="leading-8 text-zinc-700">
            We are committed to addressing your concerns and providing
            transparency about how we handle your information.
          </p>
          <p className="mt-4 leading-8 text-zinc-700">
            Need help with the app? Visit our{" "}
            <Link
              href={supportHref}
              className="font-medium text-zinc-900 underline-offset-4 hover:underline"
            >
              support page
            </Link>
            .
          </p>
        </section>
      </article>
    </main>
  );
}

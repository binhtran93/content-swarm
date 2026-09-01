import type { Metadata } from "next";
import Link from "next/link";

import { worldClockSiteConfig } from "@/public-site/sites/world-clock/site-config";

export const metadata: Metadata = {
  title: "Terms and Conditions | World Clock Plus",
  description: "Terms and conditions for the World Clock Plus mobile app.",
};

const sectionClassName = "mb-8";
const headingClassName = "mb-3 text-2xl font-semibold";
const copyClassName = "leading-8 text-zinc-700";
const listClassName = "list-disc space-y-2 pl-6 leading-8 text-zinc-700";

export default function WorldClockTermsPage() {
  return (
    <main className="legal-document flex flex-1 justify-center bg-zinc-50 px-4 py-12 text-zinc-900">
      <article className="legal-document__article w-full max-w-3xl rounded-xl bg-white p-6 shadow-sm sm:p-10">
        <h1 className="mb-3 text-3xl font-semibold tracking-tight">
          Terms and Conditions
        </h1>
        <p className="mb-8 text-sm text-zinc-600">
          Effective date: 1 September 2026
        </p>

        <p className={`mb-6 ${copyClassName}`}>
          These Terms and Conditions (&quot;Terms&quot;) govern your use of
          World Clock Plus, provided by ANMISOFT. By downloading, accessing, or
          using the app, you agree to these Terms and our{" "}
          <Link
            className="font-medium text-zinc-900 underline-offset-4 hover:underline"
            href={`${worldClockSiteConfig.basePath}/privacy`}
          >
            Privacy Policy
          </Link>
          . If you do not agree, do not use the app.
        </p>

        <section className={sectionClassName}>
          <h2 className={headingClassName}>Eligibility</h2>
          <p className={copyClassName}>
            You must be at least 13 years old to use World Clock Plus. If you
            are not old enough to agree to these Terms where you live, a parent
            or legal guardian must agree on your behalf.
          </p>
        </section>

        <section className={sectionClassName}>
          <h2 className={headingClassName}>The service</h2>
          <p className={`mb-3 ${copyClassName}`}>
            World Clock Plus provides tools for viewing and comparing city
            times, scheduling alarms, displaying widgets, estimating sunrise and
            sunset times, sharing clock information, and preparing calendar
            events. Features can vary by device, operating-system version,
            permissions, region, and subscription status.
          </p>
          <p className={copyClassName}>
            Time-zone rules, daylight-saving changes, solar calculations, device
            clocks, notification delivery, and platform services can be delayed,
            unavailable, or inaccurate. You are responsible for confirming
            important times through an appropriate authoritative source. Do not
            rely on World Clock Plus as the sole alert or timing system for
            emergencies, travel connections, medical care, safety-critical work,
            legal deadlines, or other high-risk uses.
          </p>
        </section>

        <section className={sectionClassName}>
          <h2 className={headingClassName}>Accounts</h2>
          <p className={copyClassName}>
            The app may create an anonymous account and may let you link or sign
            in with Google. You are responsible for maintaining the security of
            any credentials and for activity associated with your account. You
            must provide accurate information when you choose an account-based
            feature and notify us if you believe your account has been misused.
          </p>
        </section>

        <section className={sectionClassName}>
          <h2 className={headingClassName}>Acceptable use</h2>
          <p className="mb-3 leading-8 text-zinc-700">You may not:</p>
          <ul className={listClassName}>
            <li>use the app in violation of applicable law;</li>
            <li>
              interfere with, disrupt, probe, or attempt unauthorized access to
              the app, related systems, or another user&apos;s account;
            </li>
            <li>
              distribute malware, automate abusive traffic, or bypass security,
              access, purchase, or feature restrictions;
            </li>
            <li>
              reverse engineer or copy the app except where applicable law
              expressly permits it; or
            </li>
            <li>
              use World Clock Plus in a way that infringes another person&apos;s
              rights or harms ANMISOFT, service providers, or other users.
            </li>
          </ul>
        </section>

        <section className={sectionClassName}>
          <h2 className={headingClassName}>Subscriptions and purchases</h2>
          <ul className={listClassName}>
            <li>
              Premium features may be offered through monthly, annual, lifetime,
              or other in-app purchase options shown in the app.
            </li>
            <li>
              Prices, trial terms, billing periods, and included features are
              displayed before you confirm a purchase and can vary by platform
              or region.
            </li>
            <li>
              Recurring subscriptions renew automatically unless canceled at
              least as required by the applicable app store. You can manage or
              cancel them in your Apple App Store or Google Play account.
            </li>
            <li>
              Deleting the app or requesting account deletion does not cancel a
              subscription. You must cancel it through the store that processed
              the purchase.
            </li>
            <li>
              Purchases and refunds are processed by Apple or Google and are
              subject to that store&apos;s terms, refund rules, and decisions.
              ANMISOFT does not receive or control your full payment-card
              information.
            </li>
          </ul>
        </section>

        <section className={sectionClassName}>
          <h2 className={headingClassName}>Third-party services</h2>
          <p className={copyClassName}>
            World Clock Plus relies on platform and service providers such as
            Apple, Google, Firebase, and RevenueCat. Their services and your use
            of them may be governed by separate terms and privacy policies.
            ANMISOFT is not responsible for third-party services, store
            decisions, network availability, or changes outside our control.
          </p>
        </section>

        <section className={sectionClassName}>
          <h2 className={headingClassName}>Intellectual property</h2>
          <p className={copyClassName}>
            World Clock Plus, including its software, design, branding, and
            original content, is owned by ANMISOFT or its licensors and is
            protected by applicable intellectual-property laws. Subject to these
            Terms, ANMISOFT gives you a limited, personal, non-exclusive,
            non-transferable, revocable license to use the app on devices you
            own or control for personal use.
          </p>
        </section>

        <section className={sectionClassName}>
          <h2 className={headingClassName}>Feedback</h2>
          <p className={copyClassName}>
            If you send ideas or feedback, you give ANMISOFT permission to use
            them without restriction or compensation, provided we do not claim
            ownership of personal information included in your message.
          </p>
        </section>

        <section className={sectionClassName}>
          <h2 className={headingClassName}>Availability and changes</h2>
          <p className={copyClassName}>
            We may update, add, limit, suspend, or discontinue features when
            reasonably necessary for operation, security, legal compliance, or
            product development. We do not guarantee that every feature will
            always be available or compatible with every device.
          </p>
        </section>

        <section className={sectionClassName}>
          <h2 className={headingClassName}>Disclaimer</h2>
          <p className={copyClassName}>
            To the extent permitted by law, World Clock Plus is provided
            &quot;as is&quot; and &quot;as available.&quot; ANMISOFT disclaims
            warranties of merchantability, fitness for a particular purpose,
            non-infringement, accuracy, uninterrupted availability, and
            error-free operation. Nothing in these Terms excludes warranties or
            rights that cannot legally be excluded.
          </p>
        </section>

        <section className={sectionClassName}>
          <h2 className={headingClassName}>Limitation of liability</h2>
          <p className={copyClassName}>
            To the extent permitted by law, ANMISOFT and its suppliers will not
            be liable for indirect, incidental, special, consequential,
            exemplary, or punitive damages, or for lost data, profits,
            opportunities, or business, arising from your use of or inability to
            use World Clock Plus. This limitation does not apply where liability
            cannot legally be limited or excluded.
          </p>
        </section>

        <section className={sectionClassName}>
          <h2 className={headingClassName}>Suspension and termination</h2>
          <p className={copyClassName}>
            You may stop using the app at any time. We may suspend or terminate
            access when reasonably necessary to address a material violation of
            these Terms, protect users or services, comply with law, or end the
            service. Provisions that by their nature should continue after
            termination will remain in effect.
          </p>
        </section>

        <section className={sectionClassName}>
          <h2 className={headingClassName}>Applicable law and local rights</h2>
          <p className={copyClassName}>
            Applicable law governs these Terms. Mandatory consumer protections
            and rights available in your place of residence remain unaffected.
            Before starting formal proceedings, you agree to contact us and
            allow a reasonable opportunity to resolve the issue informally.
          </p>
        </section>

        <section className={sectionClassName}>
          <h2 className={headingClassName}>Changes to these Terms</h2>
          <p className={copyClassName}>
            We may update these Terms when the app, our practices, or applicable
            requirements change. We will post the revised version here and
            update the effective date. Your continued use after revised Terms
            take effect means you accept them.
          </p>
        </section>

        <section>
          <h2 className={headingClassName}>Contact</h2>
          <p className={copyClassName}>
            Questions about these Terms can be sent to support@anmisoft.com or
            through the{" "}
            <Link
              className="font-medium text-zinc-900 underline-offset-4 hover:underline"
              href={`${worldClockSiteConfig.basePath}/support`}
            >
              World Clock Plus support page
            </Link>
            .
          </p>
        </section>
      </article>
    </main>
  );
}

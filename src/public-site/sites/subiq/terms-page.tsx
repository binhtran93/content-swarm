import Link from "next/link";

export function SubiqTermsPage() {
  return (
    <main className="legal-document flex flex-1 justify-center bg-zinc-50 px-4 py-12 text-zinc-900">
      <article
        lang="en"
        className="legal-document__article w-full max-w-3xl rounded-xl bg-white p-6 shadow-sm sm:p-10"
      >
        <h1 className="mb-3 text-3xl font-semibold tracking-tight">
          Terms and Conditions
        </h1>
        <p className="mb-8 text-sm text-zinc-600">Effective Date: 13.07.2026</p>

        <p className="mb-6 leading-8 text-zinc-700">
          Welcome to SubIQ, operated by ANMISOFT (&quot;we,&quot;
          &quot;our,&quot; or &quot;us&quot;). These Terms and Conditions
          (&quot;Terms&quot;) govern your use of the SubIQ mobile app, website
          pages, and related services. By accessing or using SubIQ, you agree to
          these Terms and our Privacy Policy. If you do not agree, do not use
          SubIQ.
        </p>

        <section className="mb-8">
          <h2 className="mb-3 text-2xl font-semibold">Eligibility</h2>
          <p className="leading-8 text-zinc-700">
            You must be at least 13 years old to use SubIQ. If the law where you
            live requires a higher age for you to agree to online terms, you may
            use SubIQ only with the involvement of a parent or legal guardian
            who accepts these Terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-2xl font-semibold">What SubIQ Provides</h2>
          <p className="mb-3 leading-8 text-zinc-700">
            SubIQ is a subscription organization and information tool. Features
            may include:
          </p>
          <ul className="list-disc space-y-2 pl-6 leading-8 text-zinc-700">
            <li>
              Recording and organizing subscription details that you enter.
            </li>
            <li>
              Estimating renewal dates, upcoming charges, and totals across
              currencies.
            </li>
            <li>
              Showing subscription timelines, calendars, categories, and status
              information.
            </li>
            <li>
              Scheduling optional trial-expiration and upcoming-charge
              reminders.
            </li>
            <li>
              Linking to subscription management pages operated by third
              parties.
            </li>
            <li>
              Generating informational cancellation and refund steps for
              selected companies using AI and web sources.
            </li>
          </ul>
          <p className="mt-4 leading-8 text-zinc-700">
            Features may differ by platform, region, app version, or service
            availability.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-2xl font-semibold">
            Accounts and Your Data
          </h2>
          <p className="mb-4 leading-8 text-zinc-700">
            SubIQ may create an anonymous Firebase account to store and
            synchronize your subscription records and preferences. You may
            optionally use Continue with Google to create a persistent,
            Google-linked SubIQ account and access those records across
            supported devices. You are responsible for the accuracy of the
            information you enter and for keeping your devices and account
            access secure.
          </p>
          <p className="leading-8 text-zinc-700">
            You may edit or delete individual subscription records using
            available in-app controls. You may delete a Google-linked account
            from Settings &gt; Account &gt; Delete Account or request deletion
            through the external process described in the{" "}
            <Link
              href="./privacy#account-deletion"
              className="font-medium text-zinc-900 underline-offset-4 hover:underline"
            >
              SubIQ Privacy Policy
            </Link>
            .
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-2xl font-semibold">
            Estimates and User-Entered Information
          </h2>
          <p className="mb-4 leading-8 text-zinc-700">
            Renewal dates, upcoming charges, monthly totals, trial periods, and
            other calculations are estimates based on the information you
            provide and SubIQ&apos;s calculation rules. Currency conversions use
            general exchange-rate data that may be delayed or differ from the
            rate used by your bank, card issuer, app store, or subscription
            provider.
          </p>
          <p className="leading-8 text-zinc-700">
            SubIQ is not a bank, payment processor, accounting service, or
            financial adviser. You must verify prices, taxes, fees, billing
            dates, exchange rates, and subscription status with the relevant
            provider before making a financial decision.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-2xl font-semibold">Notifications</h2>
          <p className="leading-8 text-zinc-700">
            Reminders are offered for convenience and are not guaranteed. They
            may be delayed or prevented by device settings, permissions,
            operating-system behavior, battery controls, app removal, incorrect
            subscription data, or technical failures. You remain responsible for
            monitoring subscriptions and payment dates directly with each
            provider.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-2xl font-semibold">
            Cancellation and Refund Guidance
          </h2>
          <p className="mb-4 leading-8 text-zinc-700">
            SubIQ may use Google Gemini, Google Search, and website sources to
            generate cancellation or refund instructions for a company you
            select. This content is informational and may be incomplete,
            inaccurate, outdated, or inapplicable to your account, location,
            billing channel, or purchase.
          </p>
          <p className="mb-4 leading-8 text-zinc-700">
            SubIQ does not log in to your provider account, cancel a
            subscription, submit a refund request, negotiate with a provider, or
            guarantee any outcome. Opening instructions or a provider link does
            not complete a cancellation or refund. You must follow the
            provider&apos;s process and verify that the provider has confirmed
            your request.
          </p>
          <p className="leading-8 text-zinc-700">
            SubIQ is not a substitute for legal, financial, tax, or other
            professional advice. Seek qualified advice when your situation
            requires it.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-2xl font-semibold">
            Third-Party Services and Links
          </h2>
          <p className="mb-3 leading-8 text-zinc-700">
            SubIQ relies on or links to third-party services, which may include
            Firebase, Google Gemini, Google Search, Logo.dev, ExchangeRate-API,
            Apple, Google Play, subscription providers, and their websites or
            account portals.
          </p>
          <p className="leading-8 text-zinc-700">
            We do not control third-party services, content, policies,
            availability, security, or billing decisions. Your use of those
            services is governed by their own terms and privacy policies. A
            link, logo, company listing, or reference in SubIQ does not imply
            that the third party sponsors or endorses SubIQ.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-2xl font-semibold">
            Paid Features and Store Purchases
          </h2>
          <p className="mb-4 leading-8 text-zinc-700">
            If SubIQ offers premium features, subscriptions, or in-app purchases
            in the future, the price, billing period, renewal terms, and
            included features will be shown before purchase. Purchases made
            through Apple&apos;s App Store or Google Play are billed and managed
            by that store under the terms associated with your store account.
          </p>
          <p className="leading-8 text-zinc-700">
            You must manage cancellation or refund requests for an in-app
            purchase through the store that processed it, subject to that
            store&apos;s rules and applicable consumer law. Cancelling a paid
            plan does not necessarily result in a refund for a completed billing
            period.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-2xl font-semibold">Acceptable Use</h2>
          <p className="mb-3 leading-8 text-zinc-700">You agree not to:</p>
          <ul className="list-disc space-y-2 pl-6 leading-8 text-zinc-700">
            <li>
              Use SubIQ for unlawful, fraudulent, abusive, or harmful activity.
            </li>
            <li>
              Attempt to access another user&apos;s data or bypass security or
              usage controls.
            </li>
            <li>
              Disrupt, overload, damage, reverse engineer, or interfere with the
              service.
            </li>
            <li>
              Use automated means to scrape or make excessive requests to SubIQ
              or its providers.
            </li>
            <li>
              Submit malicious code or information you do not have the right to
              use.
            </li>
            <li>
              Misrepresent AI-generated guidance as verified professional
              advice.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-2xl font-semibold">Intellectual Property</h2>
          <p className="mb-4 leading-8 text-zinc-700">
            SubIQ&apos;s software, original design, text, graphics, and branding
            are owned by or licensed to ANMISOFT and are protected by applicable
            intellectual property laws. We grant you a limited, personal,
            non-exclusive, non-transferable, revocable license to use SubIQ for
            its intended purpose under these Terms.
          </p>
          <p className="leading-8 text-zinc-700">
            Third-party company names, logos, product names, and trademarks
            belong to their respective owners. Their appearance in SubIQ is for
            identification and informational purposes only.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-2xl font-semibold">Privacy</h2>
          <p className="leading-8 text-zinc-700">
            Our{" "}
            <Link
              href="./privacy"
              className="font-medium text-zinc-900 underline-offset-4 hover:underline"
            >
              Privacy Policy
            </Link>{" "}
            explains what information SubIQ collects, how it is used, when it is
            shared, and the choices available to you. By using SubIQ, you
            acknowledge that processing described in the Privacy Policy.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-2xl font-semibold">
            Service Availability and Changes
          </h2>
          <p className="leading-8 text-zinc-700">
            We may add, change, suspend, or discontinue features to maintain
            security, comply with law, respond to provider changes, or improve
            SubIQ. We do not guarantee uninterrupted or error-free availability.
            We may restrict access when reasonably necessary to protect the
            service, users, or third parties from misuse or security risks.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-2xl font-semibold">
            Disclaimer of Warranties
          </h2>
          <p className="leading-8 text-zinc-700">
            To the fullest extent permitted by law, SubIQ is provided on an
            &quot;as is&quot; and &quot;as available&quot; basis without
            warranties of any kind, whether express, implied, or statutory. We
            do not warrant that estimates, notifications, company data, links,
            exchange rates, AI guidance, or third-party information will be
            accurate, complete, current, secure, or suitable for your needs.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-2xl font-semibold">
            Limitation of Liability
          </h2>
          <p className="mb-3 leading-8 text-zinc-700">
            To the fullest extent permitted by law, ANMISOFT and its service
            providers will not be liable for indirect, incidental, special,
            consequential, exemplary, or punitive damages, or for loss arising
            from:
          </p>
          <ul className="list-disc space-y-2 pl-6 leading-8 text-zinc-700">
            <li>Your use of or inability to use SubIQ.</li>
            <li>
              Missed, delayed, duplicated, or inaccurate reminders or estimates.
            </li>
            <li>
              A subscription renewal, charge, failed cancellation, denied
              refund, or provider decision.
            </li>
            <li>
              Reliance on AI-generated guidance, source links, or third-party
              information.
            </li>
            <li>Unauthorized access to, alteration of, or loss of data.</li>
            <li>
              The availability, conduct, or content of a third-party service.
            </li>
          </ul>
          <p className="mt-4 leading-8 text-zinc-700">
            Nothing in these Terms excludes rights or liability that cannot
            lawfully be excluded or limited under applicable consumer law.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-2xl font-semibold">
            Changes to These Terms
          </h2>
          <p className="leading-8 text-zinc-700">
            We may update these Terms to reflect changes to SubIQ, our
            providers, or legal requirements. Updated Terms will be posted on
            this page with a revised effective date. Your continued use of SubIQ
            after an update means you accept the revised Terms to the extent
            permitted by law.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-2xl font-semibold">
            Applicable Law and Disputes
          </h2>
          <p className="leading-8 text-zinc-700">
            These Terms are governed by applicable law, without limiting any
            mandatory consumer protections available where you live. Before
            starting a formal dispute, you agree to contact us and make a
            reasonable effort to resolve the issue informally, except where
            applicable law gives you the right to proceed directly.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-2xl font-semibold">Contact Us</h2>
          <p className="mb-3 leading-8 text-zinc-700">
            If you have questions about these Terms or need help with SubIQ,
            contact:
          </p>
          <ul className="mb-4 list-disc space-y-2 pl-6 leading-8 text-zinc-700">
            <li>ANMISOFT</li>
            <li>Email: support@anmisoft.com</li>
          </ul>
          <p className="leading-8 text-zinc-700">
            Visit the{" "}
            <Link
              href="./support"
              className="font-medium text-zinc-900 underline-offset-4 hover:underline"
            >
              SubIQ support page
            </Link>{" "}
            for troubleshooting and common questions.
          </p>
        </section>
      </article>
    </main>
  );
}

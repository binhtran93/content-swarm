import Link from "next/link";

export function SubiqPrivacyPage() {
  return (
    <main className="flex flex-1 justify-center bg-zinc-50 px-4 py-12 text-zinc-900">
      <article className="w-full max-w-3xl rounded-xl bg-white p-6 shadow-sm sm:p-10">
        <h1 className="mb-3 text-3xl font-semibold tracking-tight">
          Privacy Policy
        </h1>
        <p className="mb-8 text-sm text-zinc-600">Effective Date: 13.07.2026</p>

        <p className="mb-6 leading-8 text-zinc-700">
          At SubIQ (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;),
          operated by ANMISOFT, we respect your privacy. This Privacy Policy
          explains what information SubIQ collects, how it is used, when it is
          shared, how long it is retained, and the choices available to you when
          you use our mobile app or related services.
        </p>

        <section
          id="account-deletion"
          className="mb-8 rounded-lg bg-zinc-50 p-6"
        >
          <h2 className="mb-3 text-2xl font-semibold">
            Delete Your SubIQ Account and Data
          </h2>
          <p className="mb-3 leading-8 text-zinc-700">
            If you created a synced SubIQ account with Google, you can
            permanently delete it in the app: open <strong>Settings</strong>,
            select <strong>Account</strong>, choose
            <strong> Delete Account</strong>, and confirm. This deletes your
            SubIQ Firebase account, settings, and all saved subscription records
            associated with that account.
          </p>
          <p className="mb-3 leading-8 text-zinc-700">
            You can also request deletion without the app by emailing{" "}
            <a
              href="mailto:support@anmisoft.com?subject=SubIQ%20account%20deletion%20request"
              className="font-semibold text-zinc-900 underline-offset-4 hover:underline"
            >
              support@anmisoft.com
            </a>{" "}
            with the subject &quot;SubIQ account deletion request.&quot; Send
            the request from the Google email address used with SubIQ, if
            possible. We may ask for information needed to locate the account
            and verify that the requester controls it.
          </p>
          <p className="leading-8 text-zinc-700">
            Completed deletion removes the active Firebase Authentication
            account and its SubIQ data in Firestore, including subscription
            records and app settings. Information may remain temporarily in
            backups, security logs, or records that we must retain for fraud
            prevention, dispute resolution, or legal compliance, and is removed
            or anonymized when it is no longer required. Aggregated or
            anonymized analytics that can no longer identify the account may be
            retained.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-2xl font-semibold">
            Information We Collect
          </h2>
          <p className="mb-3 leading-8 text-zinc-700">
            Depending on how you use SubIQ, we may collect or process the
            following information:
          </p>
          <ul className="list-disc space-y-2 pl-6 leading-8 text-zinc-700">
            <li>
              An anonymous Firebase account identifier used to separate and
              protect your data. SubIQ does not require your name, email
              address, or password for normal in-app use.
            </li>
            <li>
              If you choose Continue with Google to create a synced account,
              Google and Firebase account information such as your account
              identifier, email address, display name, and profile image, when
              provided by Google.
            </li>
            <li>
              Subscription records you enter, including company name, company
              domain or logo, category, price, currency, billing period, start
              date, trial details, billing changes, cancellation status, renewal
              information, and reminder preferences.
            </li>
            <li>
              App settings such as your preferred currency, language, and theme
              preference.
            </li>
            <li>
              Company search terms and the company names or domains you select
              when searching for a subscription provider, logo, cancellation
              guide, or refund guide.
            </li>
            <li>
              AI-generated cancellation or refund instructions, source links,
              and request metadata created when you use SubIQ&apos;s guidance
              tools.
            </li>
            <li>
              Analytics and technical information, such as an app-instance or
              anonymous user identifier, app version, device type, operating
              system, usage events, performance information, and diagnostic or
              security logs.
            </li>
            <li>
              Support correspondence and any information you choose to include
              when you contact us.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-2xl font-semibold">
            How We Collect Information
          </h2>
          <ul className="list-disc space-y-2 pl-6 leading-8 text-zinc-700">
            <li>
              Directly from you when you add or edit a subscription, change
              settings, select a company, use a cancellation or refund tool,
              enable reminders, or contact support.
            </li>
            <li>
              Automatically through Firebase and similar technologies when the
              app creates an anonymous account, synchronizes data, records
              analytics, or calls a cloud service.
            </li>
            <li>
              From generated app activity, such as calculated renewal dates,
              scheduled reminder preferences, AI guidance, and technical logs
              associated with a request.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-2xl font-semibold">
            How We Use Information
          </h2>
          <p className="mb-3 leading-8 text-zinc-700">We use information to:</p>
          <ul className="list-disc space-y-2 pl-6 leading-8 text-zinc-700">
            <li>
              Create, display, update, synchronize, and delete your subscription
              records.
            </li>
            <li>
              Calculate estimated renewal dates, upcoming charges, calendar
              entries, and totals in your selected currency.
            </li>
            <li>Schedule the subscription reminders you choose to enable.</li>
            <li>
              Search for companies and logos and provide cancellation or refund
              instructions for the company you select.
            </li>
            <li>
              Maintain the app, authenticate requests, prevent abuse,
              troubleshoot errors, measure performance, and improve features and
              reliability.
            </li>
            <li>Respond to support, privacy, and data deletion requests.</li>
          </ul>
          <p className="mt-4 leading-8 text-zinc-700">
            We do not sell your personal information, and SubIQ does not use
            your subscription records for third-party advertising.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-2xl font-semibold">
            Accounts, Google Sign-In, and Firebase
          </h2>
          <p className="mb-4 leading-8 text-zinc-700">
            SubIQ uses Google Firebase Authentication to create an anonymous
            account identifier. Your subscription records and preferences are
            stored in Google Cloud Firestore under that identifier so the app
            can retrieve and synchronize them. Firebase Cloud Functions
            authenticate requests for SubIQ&apos;s cancellation and refund
            guidance tools.
          </p>
          <p className="mb-4 leading-8 text-zinc-700">
            You may choose Continue with Google to link the anonymous account to
            your Google identity and create a persistent SubIQ account. This
            allows you to sign in and access your subscription records across
            supported devices. SubIQ receives an authentication token and may
            receive your Google account identifier, email address, display name,
            and profile image. SubIQ does not receive or store your Google
            password.
          </p>
          <p className="leading-8 text-zinc-700">
            SubIQ also uses Firebase Analytics to understand app usage and
            reliability. Analytics may process an app-instance identifier, the
            anonymous Firebase identifier associated with your session, device
            and app information, and interaction events. We do not use Firebase
            Analytics to collect the prices or other contents of your
            subscription records as analytics event data.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-2xl font-semibold">
            AI Guidance and Google Gemini
          </h2>
          <p className="mb-4 leading-8 text-zinc-700">
            SubIQ uses Google Gemini through a Firebase Cloud Function to
            generate informational steps for cancelling a subscription or
            requesting a refund. When you request guidance, SubIQ sends the
            selected company name and company domain to our cloud function and
            to Google Gemini. Gemini may use Google Search and website context
            to find current source material and return instructions and links.
          </p>
          <p className="mb-4 leading-8 text-zinc-700">
            SubIQ does not send your stored subscription price, billing history,
            trial details, notification preferences, or other subscription
            records to Gemini as part of these requests. Cloud logs may record
            the anonymous user identifier, selected company domain, request
            timing, source counts, and error information for security,
            troubleshooting, and service operation.
          </p>
          <p className="leading-8 text-zinc-700">
            AI-generated instructions can be incomplete, outdated, or incorrect.
            You should verify important steps with the subscription provider
            before acting on them.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-2xl font-semibold">
            Company Search, Logos, and Exchange Rates
          </h2>
          <ul className="list-disc space-y-2 pl-6 leading-8 text-zinc-700">
            <li>
              Logo.dev receives company search terms when you search its company
              directory and receives company domains when the app loads provider
              logos.
            </li>
            <li>
              SubIQ requests general currency exchange-rate data from the
              ExchangeRate-API public service. These requests do not include
              your subscription records or entered prices.
            </li>
          </ul>
          <p className="mt-4 leading-8 text-zinc-700">
            These providers may receive standard network information, such as
            your IP address, user agent, and request time, and process it under
            their own privacy terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-2xl font-semibold">Notifications</h2>
          <p className="leading-8 text-zinc-700">
            If you enable reminders, SubIQ asks for your device&apos;s
            notification permission and schedules upcoming-charge or
            trial-expiration notifications on your device. The app stores your
            reminder preferences with the relevant subscription record in
            Firestore. You can disable individual reminders in SubIQ or manage
            notification permission in your device settings.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-2xl font-semibold">
            Third Parties We Share Information With
          </h2>
          <p className="mb-3 leading-8 text-zinc-700">
            We share information only as needed to provide, secure, and improve
            SubIQ. Providers that may process information include:
          </p>
          <ul className="list-disc space-y-2 pl-6 leading-8 text-zinc-700">
            <li>
              Google Firebase and Google Cloud for anonymous or Google-linked
              authentication, database storage, cloud functions, analytics,
              hosting infrastructure, security, and service logs.
            </li>
            <li>
              Google Gemini and Google Search for generating grounded
              cancellation and refund instructions from the selected company
              name and domain.
            </li>
            <li>
              Logo.dev for company search results and company logo images.
            </li>
            <li>ExchangeRate-API for general currency conversion rates.</li>
            <li>
              Apple and Google platform services for app distribution,
              operating-system features, and device notification delivery or
              scheduling.
            </li>
            <li>
              Support, security, and infrastructure providers when needed to
              respond to requests, protect the service, comply with law, or
              investigate misuse.
            </li>
          </ul>
          <p className="mt-4 leading-8 text-zinc-700">
            These providers may process information under their own privacy
            policies and data processing terms. We may also disclose information
            when required by law or when reasonably necessary to protect users,
            our rights, or the security of the service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-2xl font-semibold">
            Data Retention and Deletion
          </h2>
          <p className="mb-4 leading-8 text-zinc-700">
            We retain subscription records and preferences while they are
            associated with your anonymous or Google-linked SubIQ account and
            needed to provide SubIQ. Analytics, request logs, and security
            records may be retained for a limited period needed for reporting,
            troubleshooting, abuse prevention, legal compliance, or service
            security.
          </p>
          <ul className="list-disc space-y-2 pl-6 leading-8 text-zinc-700">
            <li>
              You can delete individual subscription records from within SubIQ.
            </li>
            <li>
              If you use a Google-linked account, you can delete it from
              Settings &gt; Account &gt; Delete Account or follow the external
              request steps in the{" "}
              <Link
                href="#account-deletion"
                className="font-medium text-zinc-900 underline-offset-4 hover:underline"
              >
                account deletion section
              </Link>
              .
            </li>
            <li>
              Deleted information may remain temporarily in backups, logs, or
              records retained for security, fraud prevention, dispute
              resolution, or legal obligations.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-2xl font-semibold">
            Your Rights and Choices
          </h2>
          <p className="mb-3 leading-8 text-zinc-700">
            Depending on where you live, you may have rights to access, correct,
            delete, restrict, or receive a copy of personal information
            associated with you. You can:
          </p>
          <ul className="list-disc space-y-2 pl-6 leading-8 text-zinc-700">
            <li>Edit or delete subscription records in the app.</li>
            <li>
              Change currency, theme, and available app preferences in Settings.
            </li>
            <li>
              Disable reminders in SubIQ or notification permission in device
              settings.
            </li>
            <li>
              Contact support@anmisoft.com to ask about access, correction,
              deletion, or another privacy request.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-2xl font-semibold">
            Data Security and International Processing
          </h2>
          <p className="leading-8 text-zinc-700">
            We use reasonable technical and organizational safeguards designed
            to protect your information. No electronic transmission or storage
            method is completely secure, so we cannot guarantee absolute
            security. Our providers may process information in countries other
            than your own, subject to applicable safeguards and legal
            requirements.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-2xl font-semibold">
            Children&apos;s Privacy
          </h2>
          <p className="leading-8 text-zinc-700">
            SubIQ is intended for a general audience and is not directed to
            children under 13. We do not knowingly collect personal information
            from children under 13. If you believe a child has provided
            information through SubIQ, contact us so we can investigate and
            delete it where appropriate.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-2xl font-semibold">
            Changes to This Privacy Policy
          </h2>
          <p className="leading-8 text-zinc-700">
            We may update this Privacy Policy as SubIQ changes or to reflect
            legal, regulatory, or operational requirements. We will post the
            revised policy on this page and update the effective date.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-2xl font-semibold">Contact Us</h2>
          <p className="mb-3 leading-8 text-zinc-700">
            For privacy questions, data requests, or help with SubIQ, contact:
          </p>
          <ul className="mb-4 list-disc space-y-2 pl-6 leading-8 text-zinc-700">
            <li>ANMISOFT</li>
            <li>Email: support@anmisoft.com</li>
          </ul>
          <p className="leading-8 text-zinc-700">
            You can also visit our{" "}
            <Link
              href="./support"
              className="font-medium text-zinc-900 underline-offset-4 hover:underline"
            >
              support page
            </Link>{" "}
            or review the{" "}
            <Link
              href="./terms"
              className="font-medium text-zinc-900 underline-offset-4 hover:underline"
            >
              SubIQ Terms and Conditions
            </Link>
            .
          </p>
        </section>
      </article>
    </main>
  );
}

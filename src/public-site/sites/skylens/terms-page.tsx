import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms and Conditions | SkyLens",
  description: "Terms and conditions for the SkyLens app.",
};

export default function SkyLensTermsPage() {
  return (
    <main className="flex flex-1 justify-center bg-zinc-50 px-4 py-12 text-zinc-900">
      <article className="w-full max-w-3xl rounded-xl bg-white p-6 shadow-sm sm:p-10">
        <h1 className="mb-3 text-3xl font-semibold tracking-tight">
          Terms and Conditions
        </h1>
        <p className="mb-8 text-sm text-zinc-600">Effective Date: 24.06.2026</p>

        <p className="mb-6 leading-8 text-zinc-700">
          Welcome to SkyLens (&quot;we,&quot; &quot;our,&quot; or
          &quot;us&quot;). By using our website and mobile apps, you agree to
          comply with and be bound by these Terms and Conditions
          (&quot;Terms&quot;). Please read them carefully before accessing or
          using our services. If you do not agree to these Terms, you may not
          use our services.
        </p>

        <section className="mb-8">
          <h2 className="mb-3 text-2xl font-semibold">Acceptance of Terms</h2>
          <p className="leading-8 text-zinc-700">
            By accessing our website or mobile apps, you agree to these Terms
            and our Privacy Policy. These Terms apply to all users, including
            visitors to our website and users of SkyLens.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-2xl font-semibold">Use of Our Services</h2>
          <ul className="list-disc space-y-2 pl-6 leading-8 text-zinc-700">
            <li>
              Eligibility: You must be at least 13 years old to use our
              services. By accessing or using our website or mobile apps, you
              confirm that you meet this age requirement.
            </li>
            <li>
              Account Creation: Some SkyLens features may require you to create
              an account. You agree to provide accurate and complete information
              when creating an account and to keep this information up-to-date.
            </li>
            <li>
              Prohibited Activities: You agree not to misuse our services,
              including but not limited to:
            </li>
          </ul>
          <ul className="mt-2 list-disc space-y-2 pl-10 leading-8 text-zinc-700">
            <li>Engaging in unauthorized access or use of our systems.</li>
            <li>
              Transmitting malicious code or engaging in activities that disrupt
              our services.
            </li>
            <li>Violating any applicable laws or regulations.</li>
            <li>
              Uploading images or content that you do not have the right to use.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-2xl font-semibold">
            User-Generated Content
          </h2>
          <p className="mb-4 leading-8 text-zinc-700">
            If SkyLens allows you to submit content, including photos, images,
            prompts, comments, or feedback, you retain ownership of any
            intellectual property rights in your content. However, by submitting
            content, you grant us a worldwide, royalty-free, non-exclusive
            license to use, process, reproduce, and display your content as
            necessary to provide SkyLens features.
          </p>
          <p className="leading-8 text-zinc-700">
            You are solely responsible for the content you submit and must
            ensure that it does not violate any third-party rights, privacy
            rights, or applicable laws.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-2xl font-semibold">AI-Generated Results</h2>
          <p className="mb-4 leading-8 text-zinc-700">
            SkyLens may generate AI-powered descriptions, summaries, answers,
            organization, or other visual insights based on the images and
            prompts you submit. AI-generated results may be incomplete,
            inaccurate, or unsuitable for certain purposes.
          </p>
          <p className="leading-8 text-zinc-700">
            You should not rely on SkyLens as a substitute for professional
            advice, safety-critical decisions, medical diagnosis, legal advice,
            financial advice, or emergency assistance. You are responsible for
            reviewing and verifying any results before relying on them.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-2xl font-semibold">
            Privacy and Data Collection
          </h2>
          <p className="mb-3 leading-8 text-zinc-700">
            We collect and process your personal information in accordance with
            our Privacy Policy. By using our services, you consent to such
            collection and processing.
          </p>
          <p className="mb-3 leading-8 text-zinc-700">Key points include:</p>
          <ul className="list-disc space-y-2 pl-6 leading-8 text-zinc-700">
            <li>
              Email Addresses: We may collect email addresses from users via
              SkyLens during onboarding or account setup.
            </li>
            <li>
              Photos and Images: We process images you choose to submit in order
              to provide AI-powered visual features.
            </li>
            <li>
              Cookies and Analytics: Our website may use cookies, and both the
              website and mobile apps may utilize Google Analytics to gather
              insights.
            </li>
            <li>
              Advertisements: SkyLens may use Google AdMob to display
              personalized ads, which may involve sharing certain device
              information with third-party advertisers.
            </li>
          </ul>
          <p className="mt-4 leading-8 text-zinc-700">
            For more details, please refer to our Privacy Policy.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-2xl font-semibold">Account Management</h2>
          <ul className="list-disc space-y-2 pl-6 leading-8 text-zinc-700">
            <li>You can edit your account information through SkyLens.</li>
            <li>
              Users may delete their accounts via SkyLens or by submitting a
              request by sending email to support@anmisoft.com.
            </li>
            <li>
              You are responsible for maintaining the confidentiality of your
              account credentials and for all activities that occur under your
              account.
            </li>
            <li>
              Note: Some features may not require you to create an account. For
              these features, account deletion or subscription cancellation
              requests may not be applicable if no user account or data is
              stored.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-2xl font-semibold">Refund Policy</h2>
          <p className="mb-3 leading-8 text-zinc-700">
            Google Play Store Apps: For apps distributed through the Google Play
            Store, subscriptions and in-app purchases are handled exclusively
            through Google Play.
          </p>
          <p className="mb-3 leading-8 text-zinc-700">
            Refund eligibility for Google Play Store apps is limited to:
          </p>
          <ul className="mb-4 list-disc space-y-2 pl-6 leading-8 text-zinc-700">
            <li>Accidental charges, and</li>
            <li>
              The most recent billing period, if the subscription was not used
              intentionally.
            </li>
          </ul>
          <p className="mb-4 leading-8 text-zinc-700">
            Past subscription periods or previously used services are not
            eligible for refunds, as access to the full app features has already
            been provided. All refund requests for Google Play Store apps are
            reviewed individually and processed only for transactions still
            refundable through Google Play&apos;s &quot;Order Management&quot;
            system.
          </p>
          <p className="leading-8 text-zinc-700">
            Apple App Store Apps: For apps distributed through the Apple App
            Store, refunds are handled exclusively through Apple&apos;s refund
            system and are subject to Apple&apos;s refund policies and
            procedures.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-2xl font-semibold">
            Intellectual Property Rights
          </h2>
          <p className="leading-8 text-zinc-700">
            All content, design elements, and trademarks on our website and
            within SkyLens are the intellectual property of SkyLens unless
            otherwise specified. You may not copy, distribute, or use any
            content without our prior written consent.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-2xl font-semibold">
            Consent to Share Consumption Data with Apple
          </h2>
          <p className="mb-4 leading-8 text-zinc-700">
            By using our app and making in-app purchases, you consent to our
            sharing of data regarding your usage and consumption of purchased
            content with Apple, as part of our efforts to resolve refund
            requests. This information may include details about how you have
            accessed and interacted with the purchased content. The purpose of
            sharing this data is to help Apple make an informed decision
            regarding refund requests.
          </p>
          <p className="leading-8 text-zinc-700">
            We ensure that such data sharing is done in compliance with
            Apple&apos;s policies and only as necessary to process your
            requests.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-2xl font-semibold">
            Limitation of Liability
          </h2>
          <p className="mb-3 leading-8 text-zinc-700">
            To the fullest extent permitted by law, SkyLens will not be liable
            for any direct, indirect, incidental, consequential, or punitive
            damages arising from:
          </p>
          <ul className="list-disc space-y-2 pl-6 leading-8 text-zinc-700">
            <li>Your use or inability to use our website or mobile apps.</li>
            <li>Unauthorized access to or alteration of your data.</li>
            <li>
              Actions, results, or content provided by third-party services,
              including Google AdMob, Google Analytics, and AI processing
              services.
            </li>
            <li>
              Your reliance on AI-generated visual results or recommendations.
            </li>
          </ul>
          <p className="mt-4 leading-8 text-zinc-700">
            Our services are provided on an &quot;as is&quot; and &quot;as
            available&quot; basis without any warranties of any kind.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-2xl font-semibold">
            Modifications to Terms
          </h2>
          <p className="leading-8 text-zinc-700">
            We reserve the right to modify these Terms at any time. Any changes
            will be posted on this page with an updated &quot;Effective
            Date.&quot; Your continued use of our services after changes are
            posted constitutes your acceptance of the revised Terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-2xl font-semibold">Governing Law</h2>
          <p className="leading-8 text-zinc-700">
            These Terms and any disputes arising from your use of our services
            will be governed by and construed in accordance with the laws of
            [Your Jurisdiction].
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-2xl font-semibold">Contact Us</h2>
          <p className="mb-3 leading-8 text-zinc-700">
            If you have any questions or concerns about these Terms, please
            contact us:
          </p>
          <ul className="mb-4 list-disc space-y-2 pl-6 leading-8 text-zinc-700">
            <li>Email: support@anmisoft.com</li>
          </ul>
          <p className="leading-8 text-zinc-700">
            Need help with the app? Visit our{" "}
            <Link
              href="/skylens/support"
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

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Urge Zero",
  description: "Privacy policy for the Urge Zero app.",
};

export default function UrgeZeroPrivacyPage() {
  return (
    <main className="legal-document flex flex-1 justify-center bg-zinc-50 px-4 py-12 text-zinc-900">
      <article className="legal-document__article w-full max-w-3xl rounded-xl bg-white p-6 shadow-sm sm:p-10">
        <h1 className="mb-3 text-3xl font-semibold tracking-tight">
          Privacy Policy
        </h1>
        <p className="mb-8 text-sm text-zinc-600">Effective Date: 10.02.2026</p>

        <p className="mb-6 leading-8 text-zinc-700">
          At Urge Zero (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;), we
          prioritize your privacy and are committed to safeguarding your
          personal information. This privacy policy explains how we collect,
          use, and share your information when you interact with our mobile apps
          and website. By using our services, you agree to the terms outlined
          below.
        </p>

        <section className="mb-8">
          <h2 className="mb-3 text-2xl font-semibold">
            Information We Collect
          </h2>

          <h3 className="mb-2 text-xl font-medium">Email Addresses</h3>
          <p className="mb-4 leading-8 text-zinc-700">
            We collect email addresses directly from users of our mobile apps
            during the onboarding process. This information is provided by users
            voluntarily through a text input field within the apps. We do not
            collect email addresses from visitors to our website. The email
            addresses we collect are used solely to provide personalized
            services, communicate with users, and enhance their experience with
            our apps.
          </p>

          <h3 className="mb-2 text-xl font-medium">Cookies and Analytics</h3>
          <ul className="mb-4 list-disc space-y-2 pl-6 leading-8 text-zinc-700">
            <li>
              Cookies: Our website uses cookies to improve your browsing
              experience, remember your preferences, and track website traffic.
              Cookies are small data files stored on your device that help us
              understand how you interact with our site.
            </li>
            <li>
              Google Analytics: Both our website and mobile apps use Google
              Analytics to analyze user behavior and gather insights into how
              our services are used. This information helps us improve the
              functionality and performance of our services.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-2xl font-semibold">
            Photos, Images, and Visual Data
          </h2>

          <h3 className="mb-2 text-xl font-medium">What We Collect</h3>
          <p className="mb-4 leading-8 text-zinc-700">
            Some of our apps allow you to capture photos using your
            device&apos;s camera or select images from your photo library. These
            images may contain faces or other personal visual information. We
            only access your camera or photo library when you explicitly choose
            to use these features within the app.
          </p>

          <h3 className="mb-2 text-xl font-medium">How We Use Visual Data</h3>
          <p className="mb-4 leading-8 text-zinc-700">
            Photos and images you provide are used solely for the core
            functionality of the app, such as generating AI-powered content
            (e.g., text, images, or other creative outputs) based on the visual
            content you submit. We do not perform facial recognition, create
            biometric identifiers, or build facial feature maps from your
            photos. Images are sent to third-party AI services (such as Google
            Gemini) exclusively for the purpose of generating content within the
            app.
          </p>

          <h3 className="mb-2 text-xl font-medium">Storage and Retention</h3>
          <p className="mb-4 leading-8 text-zinc-700">
            Images you submit may be stored on our servers to provide core app
            features, such as viewing past results and improving analysis
            quality. These images are securely stored and may be accessed by our
            systems to operate and improve the service. When an image is
            processed by a third-party AI service, it is transmitted securely
            and used only for the purpose of generating results. We do not use
            your images for advertising or sell your data. You can delete your
            images at any time.
          </p>

          <h3 className="mb-2 text-xl font-medium">Sharing of Visual Data</h3>
          <p className="leading-8 text-zinc-700">
            We do not sell, rent, or share your photos or images with any third
            parties for advertising, marketing, or any purpose unrelated to the
            app&apos;s core functionality. Images are shared only with
            third-party AI processing services (such as Google Gemini) solely to
            generate the content you request. These services process the data
            according to their own privacy policies and data processing terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-2xl font-semibold">
            How We Use Your Information
          </h2>
          <p className="mb-3 leading-8 text-zinc-700">
            We use the information we collect to:
          </p>
          <ul className="list-disc space-y-2 pl-6 leading-8 text-zinc-700">
            <li>
              Provide, maintain, and improve our mobile apps and website
              functionality.
            </li>
            <li>
              Analyze usage patterns to better understand user needs and
              preferences.
            </li>
            <li>
              Communicate with users about updates, support, and feedback.
            </li>
            <li>
              Enhance user experience by offering personalized features based on
              collected data.
            </li>
          </ul>
          <p className="mt-4 leading-8 text-zinc-700">
            All data collected is handled with care and used strictly for the
            purposes outlined in this policy.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-2xl font-semibold">
            Sharing Your Information
          </h2>
          <p className="mb-3 leading-8 text-zinc-700">
            We do not sell or rent your personal information to any third
            parties. However, we do share certain data with trusted third-party
            providers to enable core functionality:
          </p>
          <ul className="list-disc space-y-2 pl-6 leading-8 text-zinc-700">
            <li>
              Google Analytics: To gather insights into user behavior and app
              performance.
            </li>
            <li>
              AI Processing Services (e.g., Google Gemini): To process
              user-submitted content, including photos and images, for the
              purpose of generating AI-powered features within our apps. Data is
              processed in real time and is not permanently stored by these
              services.
            </li>
          </ul>
          <p className="mt-4 leading-8 text-zinc-700">
            These third-party providers may collect and process data in
            accordance with their own privacy policies. We recommend reviewing
            their policies for additional details on how they handle your data.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-2xl font-semibold">
            Your Rights and Choices
          </h2>
          <p className="mb-3 leading-8 text-zinc-700">
            We are committed to giving you control over your information.
            Here&apos;s how you can manage your data:
          </p>
          <ul className="list-disc space-y-2 pl-6 leading-8 text-zinc-700">
            <li>
              Edit Your Information: You can update your account details
              directly within the mobile apps at any time.
            </li>
            <li>
              Delete Your Account: Users can delete their accounts and all
              associated data either through the mobile apps or by submitting a
              request by sending email to support@anmisoft.com. We will process
              account deletion requests promptly.
            </li>
            <li>
              Opt-Out of Ads: You can opt out of targeted advertising by
              adjusting your device settings, such as resetting your advertising
              ID or enabling ad personalization preferences.
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
            We reserve the right to update this privacy policy as necessary to
            reflect changes in our services, legal requirements, or industry
            standards. Updates will be posted on this page with an updated
            &quot;Effective Date.&quot; We encourage you to review this policy
            periodically to stay informed about how we are protecting your data.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-2xl font-semibold">Contact Us</h2>
          <p className="mb-3 leading-8 text-zinc-700">
            If you have any questions, concerns, or requests related to this
            privacy policy, please don&apos;t hesitate to reach out to us:
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
              href="/urge-zero/support"
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

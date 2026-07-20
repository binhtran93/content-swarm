import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support | SkyLens",
  description:
    "Get help with SkyLens, including contact details, FAQs, and troubleshooting guidance.",
};

const faqs = [
  {
    question: "How do I analyze a photo with SkyLens?",
    answer:
      "Open SkyLens, choose the camera or photo library option, select the image you want to analyze, and follow the on-screen flow to generate visual insights.",
  },
  {
    question: "Why do I need to grant camera or photo library permission?",
    answer:
      "SkyLens only needs these permissions when you choose to capture a new photo or select an existing image. You can manage these permissions in your device settings at any time.",
  },
  {
    question: "Can SkyLens identify every object or scene accurately?",
    answer:
      "SkyLens uses AI to generate helpful visual results, but results may be incomplete or inaccurate. Review important results carefully and do not rely on the app for safety-critical, medical, legal, or financial decisions.",
  },
  {
    question: "How do I delete an image or result?",
    answer:
      "If the app shows saved history, open the item you want to remove and use the delete option. If you need help removing account data, email support@anmisoft.com with your request.",
  },
  {
    question: "How do I manage subscription or billing issues?",
    answer:
      "Subscriptions are managed through the store where you installed the app (Google Play or Apple App Store). If you need help with billing details, contact store support first, then email us if you need product-specific help.",
  },
  {
    question: "Can I request a new visual analysis feature?",
    answer:
      "Yes. We welcome product suggestions. Send your idea to support@anmisoft.com with your use case so we can evaluate it for future updates.",
  },
];

export default function SkyLensSupportPage() {
  return (
    <main className="flex flex-1 justify-center bg-zinc-50 px-4 py-12 text-zinc-900">
      <article className="w-full max-w-3xl rounded-xl bg-white p-6 shadow-sm sm:p-10">
        <header className="mb-10">
          <h1 className="mb-3 text-3xl font-semibold tracking-tight">
            Support
          </h1>
          <p className="leading-8 text-zinc-700">
            Need help with SkyLens? This page includes support contact details,
            common questions, and troubleshooting guidance so you can resolve
            issues quickly.
          </p>
        </header>

        <section className="mb-10">
          <h2 className="mb-3 text-2xl font-semibold">Get Help</h2>
          <p className="leading-8 text-zinc-700">
            If you have questions about image analysis, camera permissions,
            account behavior, or app performance, contact us and include as much
            detail as possible so we can assist faster.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-2xl font-semibold">Contact Us</h2>
          <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-6">
            <h3 className="mb-2 text-xl font-medium">Email Support</h3>
            <p className="mb-2 leading-8 text-zinc-700">
              For all support inquiries, please email us at:
            </p>
            <a
              href="mailto:support@anmisoft.com"
              className="text-lg font-semibold text-zinc-900 underline-offset-4 hover:underline"
            >
              support@anmisoft.com
            </a>
            <p className="mt-3 text-sm text-zinc-600">
              We typically respond within 24 to 48 business hours.
            </p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-2xl font-semibold">Common Questions</h2>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="rounded-lg border border-zinc-200 px-4 py-3"
              >
                <summary className="cursor-pointer text-lg font-medium text-zinc-900">
                  {faq.question}
                </summary>
                <p className="mt-3 leading-8 text-zinc-700">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="mb-3 text-2xl font-semibold">Report Issues</h2>
          <p className="mb-3 leading-8 text-zinc-700">
            If you experience technical problems, include the following details
            in your email:
          </p>
          <ul className="list-disc space-y-2 pl-6 leading-8 text-zinc-700">
            <li>Your device model and operating system version.</li>
            <li>App version number.</li>
            <li>A clear description of the issue.</li>
            <li>Steps to reproduce the problem.</li>
            <li>The type of image or workflow involved, if relevant.</li>
            <li>Screenshots or screen recordings, if available.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="mb-3 text-2xl font-semibold">Feature Requests</h2>
          <p className="leading-8 text-zinc-700">
            Have an idea to improve SkyLens? Send your suggestion to{" "}
            <a
              href="mailto:support@anmisoft.com"
              className="font-semibold text-zinc-900 underline-offset-4 hover:underline"
            >
              support@anmisoft.com
            </a>{" "}
            and include how the feature would help your workflow.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-2xl font-semibold">Company Information</h2>
          <ul className="list-disc space-y-2 pl-6 leading-8 text-zinc-700">
            <li>ANMISOFT</li>
            <li>Email: support@anmisoft.com</li>
          </ul>
        </section>
      </article>
    </main>
  );
}

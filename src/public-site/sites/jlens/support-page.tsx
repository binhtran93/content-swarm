import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support | JLens",
  description:
    "Get help with JLens, including contact details, FAQs, and troubleshooting guidance.",
};

const faqs = [
  {
    question: "How do I identify a jewelry piece in the app?",
    answer:
      "Open Jewelry Identifier, take a clear photo of the item, and wait for the analysis. For best results, use good lighting, keep the piece in focus, and capture the front-facing details.",
  },
  {
    question: "What types of jewelry can the app analyze?",
    answer:
      "The app is designed to help analyze common jewelry categories like rings, earrings, necklaces, bracelets, and gemstone-based pieces. Results may vary depending on image quality and item condition.",
  },
  {
    question: "How accurate are the results?",
    answer:
      "Results are AI-generated estimates intended for guidance. For high-value items, authenticity verification, or insurance purposes, we recommend consulting a qualified jeweler or gemologist.",
  },
  {
    question: "Where can I find my previous results?",
    answer:
      "Your prior analyses are available in the app history section. You can revisit past items there and manage your saved records from within the app.",
  },
  {
    question: "How do I manage subscription or billing issues?",
    answer:
      "Subscriptions are managed through the store where you installed the app (Google Play or Apple App Store). If you need help with billing details, contact store support first, then email us if you need product-specific help.",
  },
  {
    question: "Can I request a new feature?",
    answer:
      "Yes. We welcome product suggestions. Send your idea to support@anmisoft.com with your use case so we can evaluate it for future updates.",
  },
];

export default function JewelryIdentifierSupportPage() {
  return (
    <main className="flex flex-1 justify-center bg-zinc-50 px-4 py-12 text-zinc-900">
      <article className="w-full max-w-3xl rounded-xl bg-white p-6 shadow-sm sm:p-10">
        <header className="mb-10">
          <h1 className="mb-3 text-3xl font-semibold tracking-tight">
            Support
          </h1>
          <p className="leading-8 text-zinc-700">
            Need help with Jewelry Identifier? This page includes support
            contact details, common questions, and troubleshooting guidance so
            you can resolve issues quickly.
          </p>
        </header>

        <section className="mb-10">
          <h2 className="mb-3 text-2xl font-semibold">Get Help</h2>
          <p className="leading-8 text-zinc-700">
            If you have questions about features, account behavior, or app
            performance, contact us and include as much detail as possible so we
            can assist faster.
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
            <li>Screenshots or screen recordings, if available.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="mb-3 text-2xl font-semibold">Feature Requests</h2>
          <p className="leading-8 text-zinc-700">
            Have an idea to improve Jewelry Identifier? Send your suggestion to{" "}
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
            <li>TDBINH</li>
            <li>Email: support@anmisoft.com</li>
          </ul>
        </section>
      </article>
    </main>
  );
}

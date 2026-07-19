import Link from "next/link";

const faqs = [
  {
    question: "How do I add or update a subscription?",
    answer:
      "Open SubIQ and choose Add Subscription. Select or search for the company, then enter its price, currency, billing period, start date, category, and any trial details. To make changes later, open the subscription and choose the edit option.",
  },
  {
    question: "Why does my monthly total differ from my actual bill?",
    answer:
      "SubIQ calculates estimates from the subscription details you enter and general exchange rates. Taxes, fees, provider billing rules, exchange-rate changes, trial conversions, and missing or outdated entries can make the actual amount different. Check the provider's bill for the final charge.",
  },
  {
    question: "How do I enable renewal or trial reminders?",
    answer:
      "Open a subscription, choose Notifications, enable the reminders you want, and allow notification permission when prompted. If reminders remain unavailable, enable SubIQ notifications in your device settings and return to the app.",
  },
  {
    question: "Can SubIQ cancel a subscription or obtain a refund for me?",
    answer:
      "No. SubIQ provides informational steps and links for the selected company, but it does not access your provider account, submit a cancellation, or request a refund on your behalf. Complete the process with the provider and verify that it has been confirmed.",
  },
  {
    question:
      "Are cancellation and refund instructions guaranteed to be accurate?",
    answer:
      "No. The guidance is generated with AI and current web sources, but provider policies and account screens can change. Instructions may be incomplete or outdated, so confirm important details with the provider's official support or billing pages.",
  },
  {
    question: "What should I do if a company or logo is missing?",
    answer:
      "Try searching with the company's full brand name or website name. If it still does not appear, you can enter the company details manually. Logos are supplied by an external company-directory service and may occasionally be unavailable.",
  },
  {
    question:
      "How do I delete a subscription or request deletion of all my data?",
    answer:
      "To remove one subscription, open it and use the delete option. If you created a synced account with Google, open Settings, select Account, choose Delete Account, and confirm. You can also request account and data deletion by emailing support@anmisoft.com from the Google email address used with SubIQ, if possible. We may ask for information needed to locate and verify the account.",
  },
  {
    question: "How is my subscription data stored?",
    answer:
      "SubIQ creates an anonymous Firebase account and stores your subscription records and app preferences in Firebase. If you choose Continue with Google, that account becomes a persistent Google-linked SubIQ account so you can access your records across supported devices. SubIQ does not receive your Google password.",
  },
];

export function SubiqSupportPage() {
  return (
    <main className="flex flex-1 justify-center bg-zinc-50 px-4 py-12 text-zinc-900">
      <article className="w-full max-w-3xl rounded-xl bg-white p-6 shadow-sm sm:p-10">
        <header className="mb-10">
          <h1 className="mb-3 text-3xl font-semibold tracking-tight">
            Support
          </h1>
          <p className="leading-8 text-zinc-700">
            Need help with SubIQ? Find answers about subscription tracking,
            reminders, totals, cancellation and refund guidance, and your data
            below.
          </p>
        </header>

        <section className="mb-10">
          <h2 className="mb-3 text-2xl font-semibold">Get Help</h2>
          <p className="leading-8 text-zinc-700">
            If SubIQ is not working as expected, contact us with the affected
            feature, what you expected to happen, and what happened instead.
            Please do not include passwords, full payment-card numbers, or other
            sensitive account credentials.
          </p>
        </section>

        <section className="mb-10 rounded-lg bg-zinc-50 p-6">
          <h2 className="mb-3 text-2xl font-semibold">
            Account and Data Deletion
          </h2>
          <p className="mb-3 leading-8 text-zinc-700">
            To delete a Google-linked SubIQ account in the app, open{" "}
            <strong>Settings</strong>, select <strong>Account</strong>, choose{" "}
            <strong>Delete Account</strong>, and confirm. This permanently
            deletes the account, its settings, and its saved subscription
            records.
          </p>
          <p className="leading-8 text-zinc-700">
            If you cannot access the app, email{" "}
            <a
              href="mailto:support@anmisoft.com?subject=SubIQ%20account%20deletion%20request"
              className="font-semibold text-zinc-900 underline-offset-4 hover:underline"
            >
              support@anmisoft.com
            </a>{" "}
            with the subject &quot;SubIQ account deletion request.&quot; See the{" "}
            <Link
              href="./privacy#account-deletion"
              className="font-medium text-zinc-900 underline-offset-4 hover:underline"
            >
              account deletion section of our Privacy Policy
            </Link>{" "}
            for the data deleted and limited retention exceptions.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-2xl font-semibold">Contact Us</h2>
          <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-6">
            <h3 className="mb-2 text-xl font-medium">Email Support</h3>
            <p className="mb-2 leading-8 text-zinc-700">
              For product help, privacy questions, and data requests, email:
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
          <h2 className="mb-3 text-2xl font-semibold">Troubleshooting</h2>
          <ul className="list-disc space-y-2 pl-6 leading-8 text-zinc-700">
            <li>Confirm that your device has an active internet connection.</li>
            <li>Close and reopen SubIQ, then retry the affected action.</li>
            <li>
              Install the latest available version of SubIQ and your device
              software.
            </li>
            <li>
              For reminder issues, confirm that notifications are enabled both
              in SubIQ and in your device settings.
            </li>
            <li>
              For incorrect totals or renewal dates, review the saved price,
              currency, billing period, start date, trial details, and any
              billing changes.
            </li>
            <li>
              For cancellation or refund guidance, retry the request and verify
              the company name and domain you selected.
            </li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="mb-3 text-2xl font-semibold">Report an Issue</h2>
          <p className="mb-3 leading-8 text-zinc-700">
            Include the following details in your support email when available:
          </p>
          <ul className="list-disc space-y-2 pl-6 leading-8 text-zinc-700">
            <li>Your device model and operating system version.</li>
            <li>The SubIQ version shown in Settings.</li>
            <li>
              A clear description of the issue and the steps that reproduce it.
            </li>
            <li>The affected screen or workflow.</li>
            <li>Any error message shown by the app.</li>
            <li>
              Screenshots or a screen recording with sensitive information
              removed.
            </li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="mb-3 text-2xl font-semibold">Feature Requests</h2>
          <p className="leading-8 text-zinc-700">
            Have an idea for SubIQ? Email{" "}
            <a
              href="mailto:support@anmisoft.com"
              className="font-semibold text-zinc-900 underline-offset-4 hover:underline"
            >
              support@anmisoft.com
            </a>{" "}
            and explain the problem you would like the feature to solve.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-3 text-2xl font-semibold">Legal and Privacy</h2>
          <p className="leading-8 text-zinc-700">
            Learn how SubIQ handles information in our{" "}
            <Link
              href="./privacy"
              className="font-medium text-zinc-900 underline-offset-4 hover:underline"
            >
              Privacy Policy
            </Link>{" "}
            and review the rules for using the app in our{" "}
            <Link
              href="./terms"
              className="font-medium text-zinc-900 underline-offset-4 hover:underline"
            >
              Terms and Conditions
            </Link>
            .
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

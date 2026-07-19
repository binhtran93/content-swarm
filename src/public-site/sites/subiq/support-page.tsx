import Link from "next/link";

import type { SupportedLocaleCode } from "@/config/supported-locales";
import { getSubiqTranslator } from "@/public-site/sites/subiq/i18n/get-subiq-translator";

const emailClass =
  "font-semibold text-zinc-900 underline-offset-4 hover:underline";
const linkClass =
  "font-medium text-zinc-900 underline-offset-4 hover:underline";

export function SubiqSupportPage({ locale }: { locale: SupportedLocaleCode }) {
  const t = getSubiqTranslator(locale);
  const faqs = ([1, 2, 3, 4, 5, 6, 7, 8] as const).map((number) => ({
    question: t(`support.faq${number}Question`),
    answer: t(`support.faq${number}Answer`),
  }));
  const troubleshooting = ([1, 2, 3, 4, 5, 6] as const).map((number) =>
    t(`support.trouble${number}`),
  );
  const reportItems = ([1, 2, 3, 4, 5, 6] as const).map((number) =>
    t(`support.report${number}`),
  );

  return (
    <main className="flex flex-1 justify-center bg-zinc-50 px-4 py-12 text-zinc-900">
      <article className="w-full max-w-3xl rounded-xl bg-white p-6 shadow-sm sm:p-10">
        <header className="mb-10">
          <h1 className="mb-3 text-3xl font-semibold tracking-tight">
            {t("support.title")}
          </h1>
          <p className="leading-8 text-zinc-700">{t("support.intro")}</p>
        </header>
        <section className="mb-10">
          <h2 className="mb-3 text-2xl font-semibold">
            {t("support.getHelp")}
          </h2>
          <p className="leading-8 text-zinc-700">{t("support.getHelpBody")}</p>
        </section>
        <section className="mb-10 rounded-lg bg-zinc-50 p-6">
          <h2 className="mb-3 text-2xl font-semibold">
            {t("support.deletionTitle")}
          </h2>
          <p className="mb-3 leading-8 text-zinc-700">
            {t.rich("support.deletionApp", {
              strong: (chunks) => <strong>{chunks}</strong>,
            })}
          </p>
          <p className="leading-8 text-zinc-700">
            {t.rich("support.deletionEmail", {
              email: (chunks) => (
                <a
                  className={emailClass}
                  href="mailto:support@anmisoft.com?subject=SubIQ%20account%20deletion%20request"
                >
                  {chunks}
                </a>
              ),
              privacy: (chunks) => (
                <Link className={linkClass} href="./privacy#account-deletion">
                  {chunks}
                </Link>
              ),
            })}
          </p>
        </section>
        <section className="mb-10">
          <h2 className="mb-4 text-2xl font-semibold">
            {t("support.contact")}
          </h2>
          <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-6">
            <h3 className="mb-2 text-xl font-medium">
              {t("support.emailSupport")}
            </h3>
            <p className="mb-2 leading-8 text-zinc-700">
              {t("support.emailSupportBody")}
            </p>
            <a
              className={`text-lg ${emailClass}`}
              href="mailto:support@anmisoft.com"
            >
              support@anmisoft.com
            </a>
            <p className="mt-3 text-sm text-zinc-600">
              {t("support.responseTime")}
            </p>
          </div>
        </section>
        <section className="mb-10">
          <h2 className="mb-4 text-2xl font-semibold">
            {t("support.commonQuestions")}
          </h2>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <details
                className="rounded-lg border border-zinc-200 px-4 py-3"
                key={faq.question}
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
          <h2 className="mb-3 text-2xl font-semibold">
            {t("support.troubleshooting")}
          </h2>
          <ul className="list-disc space-y-2 pl-6 leading-8 text-zinc-700">
            {troubleshooting.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
        <section className="mb-10">
          <h2 className="mb-3 text-2xl font-semibold">
            {t("support.reportIssue")}
          </h2>
          <p className="mb-3 leading-8 text-zinc-700">
            {t("support.reportIntro")}
          </p>
          <ul className="list-disc space-y-2 pl-6 leading-8 text-zinc-700">
            {reportItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
        <section className="mb-10">
          <h2 className="mb-3 text-2xl font-semibold">
            {t("support.featureRequests")}
          </h2>
          <p className="leading-8 text-zinc-700">
            {t.rich("support.featureBody", {
              email: (chunks) => (
                <a className={emailClass} href="mailto:support@anmisoft.com">
                  {chunks}
                </a>
              ),
            })}
          </p>
        </section>
        <section className="mb-10">
          <h2 className="mb-3 text-2xl font-semibold">
            {t("support.legalPrivacy")}
          </h2>
          <p className="leading-8 text-zinc-700">
            {t.rich("support.legalBody", {
              privacy: (chunks) => (
                <Link className={linkClass} href="./privacy">
                  {chunks}
                </Link>
              ),
              terms: (chunks) => (
                <Link className={linkClass} href="./terms">
                  {chunks}
                </Link>
              ),
            })}
          </p>
        </section>
        <section>
          <h2 className="mb-3 text-2xl font-semibold">
            {t("support.company")}
          </h2>
          <ul className="list-disc space-y-2 pl-6 leading-8 text-zinc-700">
            <li>ANMISOFT</li>
            <li>{t("support.email")}: support@anmisoft.com</li>
          </ul>
        </section>
      </article>
    </main>
  );
}

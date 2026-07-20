import Link from "next/link";

import type { SupportedLocaleCode } from "@/config/supported-locales";
import { getSubiqTranslator } from "@/public-site/sites/subiq/i18n/get-subiq-translator";

import styles from "./support-page.module.css";

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
    <main className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.contentShell}>
          <h1>{t("support.title")}</h1>
          <p className={styles.heroDescription}>{t("support.intro")}</p>
        </div>
      </header>

      <div className={`${styles.contentShell} ${styles.supportLayout}`}>
        <aside className={styles.supportRail} aria-label={t("support.contact")}>
          <section className={styles.contactPanel}>
            <h2>{t("support.emailSupport")}</h2>
            <p>{t("support.emailSupportBody")}</p>
            <a
              className={styles.contactButton}
              href="mailto:support@anmisoft.com?subject=SubIQ%20support%20request"
            >
              {t("support.emailSupport")}
            </a>
            <a className={styles.emailLink} href="mailto:support@anmisoft.com">
              support@anmisoft.com
            </a>
            <p className={styles.responseTime}>{t("support.responseTime")}</p>
          </section>

          <section className={styles.railSection}>
            <h2>{t("support.legalPrivacy")}</h2>
            <p>
              {t.rich("support.legalBody", {
                privacy: (chunks) => (
                  <Link className={styles.inlineLink} href="./privacy">
                    {chunks}
                  </Link>
                ),
                terms: (chunks) => (
                  <Link className={styles.inlineLink} href="./terms">
                    {chunks}
                  </Link>
                ),
              })}
            </p>
          </section>

          <section className={styles.railSection}>
            <h2>{t("support.company")}</h2>
            <p>ANMISOFT</p>
            <p>{t("support.email")}: support@anmisoft.com</p>
          </section>
        </aside>

        <article className={styles.supportContent}>
          <section className={styles.faqSection}>
            <div className={styles.sectionHeading}>
              <h2>{t("support.commonQuestions")}</h2>
            </div>
            <div className={styles.faqList}>
              {faqs.map((faq) => (
                <details className={styles.faqItem} key={faq.question}>
                  <summary>{faq.question}</summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>

          <section className={styles.infoSection}>
            <h2>{t("support.deletionTitle")}</h2>
            <div className={styles.sectionBody}>
              <p>
                {t.rich("support.deletionApp", {
                  strong: (chunks) => <strong>{chunks}</strong>,
                })}
              </p>
              <p>
                {t.rich("support.deletionEmail", {
                  email: (chunks) => (
                    <a
                      className={styles.inlineLink}
                      href="mailto:support@anmisoft.com?subject=SubIQ%20account%20deletion%20request"
                    >
                      {chunks}
                    </a>
                  ),
                  privacy: (chunks) => (
                    <Link
                      className={styles.inlineLink}
                      href="./privacy#account-deletion"
                    >
                      {chunks}
                    </Link>
                  ),
                })}
              </p>
            </div>
          </section>

          <div className={styles.guidanceGrid}>
            <section className={styles.guidanceSection}>
              <h2>{t("support.troubleshooting")}</h2>
              <ul>
                {troubleshooting.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <section className={styles.guidanceSection}>
              <h2>{t("support.reportIssue")}</h2>
              <p>{t("support.getHelpBody")}</p>
              <p>{t("support.reportIntro")}</p>
              <ul>
                {reportItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          </div>

          <section className={styles.infoSection}>
            <h2>{t("support.featureRequests")}</h2>
            <div className={styles.sectionBody}>
              <p>
                {t.rich("support.featureBody", {
                  email: (chunks) => (
                    <a
                      className={styles.inlineLink}
                      href="mailto:support@anmisoft.com?subject=SubIQ%20feature%20request"
                    >
                      {chunks}
                    </a>
                  ),
                })}
              </p>
            </div>
          </section>
        </article>
      </div>
    </main>
  );
}

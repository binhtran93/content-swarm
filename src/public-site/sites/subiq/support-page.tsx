import Link from "next/link";

import type { SupportedLocaleCode } from "@/config/supported-locales";
import {
  SupportPage,
  type SupportPageContent,
} from "@/public-site/components/support";
import { getSubiqTranslator } from "@/public-site/sites/subiq/i18n/get-subiq-translator";

const supportEmail = "support@anmisoft.com";

export function SubiqSupportPage({ locale }: { locale: SupportedLocaleCode }) {
  const t = getSubiqTranslator(locale);
  const reportItems = ([1, 2, 3, 4, 5, 6] as const).map((number) =>
    t(`support.report${number}`),
  );
  const content: SupportPageContent = {
    title: t("support.title"),
    intro: t("support.intro"),
    contactAriaLabel: t("support.contact"),
    contact: {
      title: t("support.emailSupport"),
      description: t("support.emailSupportBody"),
      actionLabel: t("support.emailSupport"),
      subject: "SubIQ support request",
      responseTime: t("support.responseTime"),
    },
    reportIssue: {
      title: t("support.reportIssue"),
      destinationLabel: t("support.reportDestination"),
      description: (
        <>
          <p>{t("support.getHelpBody")}</p>
          <p>{t("support.reportIntro")}</p>
        </>
      ),
      items: reportItems,
    },
    legal: {
      title: t("support.legalPrivacy"),
      content: (
        <p>
          {t.rich("support.legalBody", {
            privacy: (chunks) => <Link href="./privacy">{chunks}</Link>,
            terms: (chunks) => <Link href="./terms">{chunks}</Link>,
          })}
        </p>
      ),
    },
    company: {
      title: t("support.company"),
      name: "ANMISOFT",
      emailLabel: t("support.email"),
    },
    sections: [
      {
        id: "account-deletion",
        title: t("support.deletionTitle"),
        content: (
          <>
            <p>
              {t.rich("support.deletionApp", {
                strong: (chunks) => <strong>{chunks}</strong>,
                email: (chunks) => (
                  <a href="mailto:support@anmisoft.com?subject=SubIQ%20deletion%20request">
                    {chunks}
                  </a>
                ),
              })}
            </p>
            <p>
              {t.rich("support.deletionEmail", {
                email: (chunks) => (
                  <a href="mailto:support@anmisoft.com?subject=SubIQ%20account%20deletion%20request">
                    {chunks}
                  </a>
                ),
                privacy: (chunks) => (
                  <Link href="./privacy#account-deletion">{chunks}</Link>
                ),
              })}
            </p>
          </>
        ),
      },
      {
        id: "feature-requests",
        title: t("support.featureRequests"),
        content: (
          <p>
            {t.rich("support.featureBody", {
              email: (chunks) => (
                <a href="mailto:support@anmisoft.com?subject=SubIQ%20feature%20request">
                  {chunks}
                </a>
              ),
            })}
          </p>
        ),
      },
    ],
  };

  return <SupportPage supportEmail={supportEmail} content={content} />;
}

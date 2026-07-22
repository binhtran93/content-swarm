import Link from "next/link";

import {
  defaultLocale,
  type SupportedLocaleCode,
} from "@/config/supported-locales";
import {
  SupportPage,
  type SupportPageContent,
} from "@/public-site/components/support";
import { getUrgeZeroTranslator } from "@/public-site/sites/urge-zero/i18n/get-urge-zero-translator";
import { createUrgeZeroStaticPageMetadata } from "@/public-site/sites/urge-zero/static-page-seo";

const supportEmail = "support@anmisoft.com";
export const metadata = createUrgeZeroStaticPageMetadata(
  "support",
  defaultLocale,
);

export function UrgeZeroSupportPage({
  locale,
}: {
  locale: SupportedLocaleCode;
}) {
  const t = getUrgeZeroTranslator(locale);
  const content: SupportPageContent = {
    title: t("support.title"),
    intro: t("support.intro"),
    contactAriaLabel: t("support.contact"),
    contact: {
      title: t("support.emailSupport"),
      description: t("support.emailSupportBody"),
      actionLabel: t("support.emailSupport"),
      subject: "UrgeZero support request",
      responseTime: t("support.responseTime"),
    },
    reportIssue: {
      title: t("support.reportIssue"),
      destinationLabel: t("support.reportDestination"),
      description: (
        <>
          <p>{t("support.reportBody")}</p>
          <p>{t("support.reportIntro")}</p>
        </>
      ),
      items: ([1, 2, 3, 4, 5, 6] as const).map((number) =>
        t(`support.report${number}`),
      ),
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
          <p>
            {t.rich("support.deletionBody", {
              email: (chunks) => (
                <a href="mailto:support@anmisoft.com?subject=UrgeZero%20deletion%20request">
                  {chunks}
                </a>
              ),
              privacy: (chunks) => (
                <Link href="./privacy#account-deletion">{chunks}</Link>
              ),
            })}
          </p>
        ),
      },
      {
        id: "feature-requests",
        title: t("support.featureRequests"),
        content: (
          <p>
            {t.rich("support.featureBody", {
              email: (chunks) => (
                <a href="mailto:support@anmisoft.com?subject=UrgeZero%20feature%20request">
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

export default function DefaultUrgeZeroSupportPage() {
  return <UrgeZeroSupportPage locale={defaultLocale} />;
}

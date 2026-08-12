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
        id: "gmail-data",
        title: "Gmail Access, Disconnection, and Data Deletion",
        content: (
          <>
            <p>
              Find from Gmail is optional. SubIQ uses read-only access only
              after you connect Gmail and start a scan. It cannot send, modify,
              or delete your emails, and it does not continuously monitor your
              inbox.
            </p>
            <p>
              To revoke access and delete all scan data for a connected Gmail
              account, open <strong>Find from Gmail</strong>, choose{" "}
              <strong>Disconnect Gmail</strong> below that account, and confirm.
              This deletes its scan results, review candidates, private scan
              work, and connection credentials. Subscriptions you already chose
              to save remain in SubIQ.
            </p>
            <p>
              Removing SubIQ from your{" "}
              <a href="https://myaccount.google.com/permissions">
                Google Account permissions
              </a>{" "}
              stops future Gmail access but does not itself send SubIQ a data
              deletion request. Use Disconnect Gmail in the app or email{" "}
              <a href="mailto:support@anmisoft.com?subject=SubIQ%20Gmail%20data%20deletion%20request">
                support@anmisoft.com
              </a>{" "}
              if you need help deleting Gmail-derived data.
            </p>
            <p>
              See the{" "}
              <Link href="./privacy#google-api-data">
                Gmail section of our Privacy Policy
              </Link>{" "}
              for details about access, processing, storage, sharing, and
              retention.
            </p>
          </>
        ),
      },
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

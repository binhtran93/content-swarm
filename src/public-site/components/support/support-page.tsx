import Link from "next/link";
import type { ReactNode } from "react";

import styles from "./support-page.module.css";

export type SupportPageSection = {
  id: string;
  title: ReactNode;
  content: ReactNode;
};

export type SupportPageContent = {
  title: ReactNode;
  intro: ReactNode;
  contactAriaLabel: string;
  contact: {
    title: ReactNode;
    description: ReactNode;
    actionLabel: ReactNode;
    subject?: string;
    responseTime?: ReactNode;
  };
  reportIssue: {
    title: ReactNode;
    description: ReactNode;
    items: readonly string[];
    destinationLabel: ReactNode;
  };
  legal: {
    title: ReactNode;
    content: ReactNode;
  };
  company: {
    title: ReactNode;
    name: ReactNode;
    emailLabel: ReactNode;
  };
  sections?: readonly SupportPageSection[];
};

function createEmailHref(email: string, subject?: string) {
  return subject
    ? `mailto:${email}?subject=${encodeURIComponent(subject)}`
    : `mailto:${email}`;
}

function SupportInfoSection({
  title,
  children,
}: {
  title: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className={styles.infoSection}>
      <h2>{title}</h2>
      <div className={styles.sectionBody}>{children}</div>
    </section>
  );
}

export function SupportPage({
  supportEmail,
  content,
}: {
  supportEmail: string;
  content: SupportPageContent;
}) {
  return (
    <main className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.contentShell}>
          <h1>{content.title}</h1>
          <div className={styles.heroDescription}>{content.intro}</div>
        </div>
      </header>

      <div className={`${styles.contentShell} ${styles.supportLayout}`}>
        <aside
          className={styles.supportRail}
          aria-label={content.contactAriaLabel}
        >
          <section className={styles.contactPanel}>
            <h2>{content.contact.title}</h2>
            <div className={styles.contactDescription}>
              {content.contact.description}
            </div>
            <a
              className={styles.contactButton}
              href={createEmailHref(supportEmail, content.contact.subject)}
            >
              {content.contact.actionLabel}
            </a>
            <a
              className={styles.emailLink}
              href={createEmailHref(supportEmail)}
            >
              {supportEmail}
            </a>
            {content.contact.responseTime ? (
              <div className={styles.responseTime}>
                {content.contact.responseTime}
              </div>
            ) : null}
          </section>

          <section className={styles.railSection}>
            <h2>{content.legal.title}</h2>
            <div className={styles.railContent}>{content.legal.content}</div>
          </section>

          <section className={styles.railSection}>
            <h2>{content.company.title}</h2>
            <div className={styles.railContent}>
              <p>{content.company.name}</p>
              <p>
                {content.company.emailLabel}: {supportEmail}
              </p>
            </div>
          </section>
        </aside>

        <article className={styles.supportContent}>
          <SupportInfoSection title={content.reportIssue.title}>
            <div className={styles.reportDescription}>
              {content.reportIssue.description}
            </div>
            <ul className={styles.checklist}>
              {content.reportIssue.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className={styles.reportDestination}>
              {content.reportIssue.destinationLabel}{" "}
              <a href={createEmailHref(supportEmail, content.contact.subject)}>
                {supportEmail}
              </a>
            </p>
          </SupportInfoSection>

          {content.sections?.map((section) => (
            <SupportInfoSection title={section.title} key={section.id}>
              {section.content}
            </SupportInfoSection>
          ))}
        </article>
      </div>
    </main>
  );
}

export function createEnglishSupportPageContent({
  productName,
  companyName,
  supportEmail,
  privacyHref,
  termsHref,
}: {
  productName: string;
  companyName: string;
  supportEmail: string;
  privacyHref: string;
  termsHref: string;
}): SupportPageContent {
  return {
    title: "Support",
    intro: `Need help with ${productName}? Contact support for product questions, technical issues, privacy requests, and account assistance.`,
    contactAriaLabel: "Contact support",
    contact: {
      title: "Email Support",
      description:
        "For product help, privacy questions, and data requests, email:",
      actionLabel: "Email Support",
      subject: `${productName} support request`,
      responseTime: "We typically respond within 24 to 48 business hours.",
    },
    reportIssue: {
      title: "Report an Issue",
      destinationLabel: "Send these details to",
      description: (
        <>
          <p>
            Tell us what you expected to happen and what happened instead. Do
            not include passwords, full payment-card numbers, or other sensitive
            account credentials.
          </p>
          <p>Include these details when available:</p>
        </>
      ),
      items: [
        "Your device model and operating system version.",
        `The ${productName} version shown in the app settings.`,
        "A clear description of the issue and the steps that reproduce it.",
        "The affected screen or workflow.",
        "Any error message shown by the app.",
        "Screenshots or a screen recording with sensitive information removed.",
      ],
    },
    legal: {
      title: "Legal and Privacy",
      content: (
        <p>
          Learn how {productName} handles information in our{" "}
          <Link href={privacyHref}>Privacy Policy</Link> and review the rules
          for using the app in our{" "}
          <Link href={termsHref}>Terms and Conditions</Link>.
        </p>
      ),
    },
    company: {
      title: "Company Information",
      name: companyName,
      emailLabel: "Email",
    },
    sections: [
      {
        id: "account-deletion",
        title: "Account and Data Deletion",
        content: (
          <p>
            To request deletion of an account or personal data associated with{" "}
            {productName}, email{" "}
            <a
              href={createEmailHref(
                supportEmail,
                `${productName} deletion request`,
              )}
            >
              {supportEmail}
            </a>
            . We may ask you to verify ownership before completing the request.
            See our <Link href={privacyHref}>Privacy Policy</Link> for details
            about deletion and limited retention.
          </p>
        ),
      },
      {
        id: "feature-requests",
        title: "Feature Requests",
        content: (
          <p>
            Have an idea for {productName}? Email{" "}
            <a
              href={createEmailHref(
                supportEmail,
                `${productName} feature request`,
              )}
            >
              {supportEmail}
            </a>{" "}
            and explain the problem you would like the feature to solve.
          </p>
        ),
      },
    ],
  };
}

export function EnglishSupportPage({
  productName,
  companyName,
  supportEmail,
  privacyHref,
  termsHref,
}: {
  productName: string;
  companyName: string;
  supportEmail: string;
  privacyHref: string;
  termsHref: string;
}) {
  return (
    <SupportPage
      supportEmail={supportEmail}
      content={createEnglishSupportPageContent({
        productName,
        companyName,
        supportEmail,
        privacyHref,
        termsHref,
      })}
    />
  );
}

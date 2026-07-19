import type { ReactNode } from "react";
import Image from "next/image";

import type { SupportedLocaleCode } from "@/config/supported-locales";
import {
  AcquisitionActions,
  AcquisitionSectionCopy,
} from "@/public-site/components/acquisition";
import type { SiteStoreBadge } from "@/public-site/config/site-config";

import styles from "./landing.module.css";

export type FeatureRow = {
  number: string;
  title: string;
  description: string;
};

export type LandingFaq = {
  question: string;
  answer: string;
};

function classes(...values: Array<string | undefined | false>) {
  return values.filter(Boolean).join(" ");
}

export function ContentShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={classes(styles.contentShell, className)}>{children}</div>
  );
}

export function LandingHero({
  title,
  description,
  actions,
  visual,
}: {
  title: ReactNode;
  description: string;
  actions?: ReactNode;
  visual: ReactNode;
}) {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.heroInner}>
        <div className={styles.heroCopy}>
          <h1 id="hero-title">{title}</h1>
          <p className={styles.heroDescription}>{description}</p>
          {actions ? <div className={styles.heroActions}>{actions}</div> : null}
        </div>
        <div className={styles.visualStage} aria-hidden="true">
          {visual}
        </div>
      </div>
    </section>
  );
}

export function LandingSection({
  id,
  tone = "default",
  className,
  children,
}: {
  id?: string;
  tone?: "default" | "muted";
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      className={classes(
        styles.section,
        tone === "muted" && styles.sectionMuted,
        className,
      )}
      id={id}
    >
      {children}
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  className?: string;
}) {
  return (
    <div className={classes(styles.sectionHeading, className)}>
      {eyebrow ? <p className={styles.sectionEyebrow}>{eyebrow}</p> : null}
      <h2>{title}</h2>
      {description ? <p>{description}</p> : null}
    </div>
  );
}

export function PhoneFrame({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={classes(styles.phoneFrame, className)}>
      <div className={styles.phoneBody}>
        <span className={styles.phoneButtonTop} />
        <span className={styles.phoneButtonMiddle} />
        <span className={styles.phoneButtonRight} />
        <div className={styles.phoneScreen}>
          {children}
          <div className={styles.dynamicIsland} />
        </div>
      </div>
    </div>
  );
}

export function PhoneScreenshot({
  src,
  alt,
  sizes = "(max-width: 700px) calc(100vw - 40px), (max-width: 980px) 34vw, 420px",
  className,
  priority,
}: {
  src: string;
  alt: string;
  sizes?: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <div className={classes(styles.screenshotPhoneFrame, className)}>
      <PhoneFrame>
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={styles.screenshotPhoneImage}
        />
      </PhoneFrame>
    </div>
  );
}

export function FeatureShowcaseSection({
  id,
  tone = "default",
  visualSide = "start",
  eyebrow,
  title,
  description,
  rows,
  screenshot,
  screenshotAlt,
  className,
}: {
  id?: string;
  tone?: "default" | "muted";
  visualSide?: "start" | "end";
  eyebrow: string;
  title: ReactNode;
  description: string;
  rows: FeatureRow[];
  screenshot: string;
  screenshotAlt: string;
  className?: string;
}) {
  return (
    <LandingSection id={id} tone={tone} className={className}>
      <ContentShell
        className={classes(
          styles.featureLayout,
          visualSide === "end" && styles.visualEnd,
        )}
      >
        <div className={styles.featureCopy}>
          <SectionHeading
            eyebrow={eyebrow}
            title={title}
            description={description}
          />
          <div className={styles.detailRows}>
            {rows.map((detail) => (
              <article className={styles.detailRow} key={detail.number}>
                <span>{detail.number}</span>
                <div>
                  <h3>{detail.title}</h3>
                  <p>{detail.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
        <div className={styles.featureVisual}>
          <PhoneScreenshot src={screenshot} alt={screenshotAlt} />
        </div>
      </ContentShell>
    </LandingSection>
  );
}

export function FaqSection({
  faqs,
  title = "Frequently asked questions",
  id = "faq",
}: {
  faqs: LandingFaq[];
  title?: ReactNode;
  id?: string;
}) {
  return (
    <LandingSection id={id}>
      <ContentShell>
        <SectionHeading title={title} className={styles.faqHeading} />
        <div className={styles.faqList}>
          {faqs.map((faq) => (
            <details key={faq.question} className={styles.faqItem}>
              <summary>{faq.question}</summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </ContentShell>
    </LandingSection>
  );
}

export function DownloadCta({
  title,
  description,
  waitlistTitle,
  waitlistDescription,
  badges,
  locale,
  privacyHref,
  id = "download",
}: {
  title: ReactNode;
  description: string;
  waitlistTitle: ReactNode;
  waitlistDescription: string;
  badges: readonly SiteStoreBadge[];
  locale: SupportedLocaleCode;
  privacyHref: string;
  id?: string;
}) {
  return (
    <section className={styles.downloadSection} id={id}>
      <ContentShell>
        <div className={styles.downloadPanel}>
          <div className={styles.downloadCopy}>
            <AcquisitionSectionCopy
              storesDescription={description}
              storesTitle={title}
              waitlistDescription={waitlistDescription}
              waitlistTitle={waitlistTitle}
            />
          </div>
          <AcquisitionActions
            badges={badges}
            className={styles.downloadActions}
            ariaLabel="App availability"
            locale={locale}
            privacyHref={privacyHref}
            source="final"
          />
        </div>
      </ContentShell>
    </section>
  );
}

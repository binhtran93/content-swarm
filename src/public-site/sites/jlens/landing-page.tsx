import Image from "next/image";
import {
  Archive,
  Ban,
  BrushCleaning,
  History,
  Images,
  ScanSearch,
  ShieldCheck,
} from "lucide-react";

import type { SupportedLocaleCode } from "@/config/supported-locales";
import { AcquisitionActions } from "@/public-site/components/acquisition";
import {
  ContentShell,
  DownloadCta,
  FaqSection,
  FeatureShowcaseSection,
  LandingSection,
  PhoneFrame,
  ResponsivePhoneComposition,
  SectionHeading,
  ViewportHero,
} from "@/public-site/components/landing";
import {
  getCanonicalUrl,
  withPublicRoute,
} from "@/public-site/config/public-url";
import { getLocalizedJlensConfig } from "@/public-site/sites/jlens/site-config";
import { JlensSiteLayout } from "@/public-site/sites/jlens/site-layout";
import { getJlensTranslator } from "@/public-site/sites/jlens/i18n/get-jlens-translator";

import styles from "./landing-page.module.css";

function JlensHero({
  locale,
  privacyHref,
}: {
  locale: SupportedLocaleCode;
  privacyHref: string;
}) {
  const t = getJlensTranslator(locale);
  const config = getLocalizedJlensConfig(locale);
  return (
    <ViewportHero
      className={styles.hero}
      innerClassName={styles.heroInner}
      labelledBy="jlens-hero-title"
    >
      <div className={styles.heroCopy}>
        <h1 id="jlens-hero-title">
          {t.rich("landing.heroTitle", {
            accent: (chunks) => (
              <span className={styles.heroTitleAccent}>{chunks}</span>
            ),
          })}
        </h1>
        <p className={styles.heroDescription}>{t("landing.heroDescription")}</p>
        <AcquisitionActions
          ariaLabel={t("landing.downloadAria")}
          badges={config.storeBadges}
          className={styles.heroActions}
          locale={locale}
          privacyHref={privacyHref}
          source="hero"
        />
      </div>

      <div className={styles.heroVisual} aria-hidden="true">
        <ResponsivePhoneComposition className={styles.phoneComposition}>
          <PhoneFrame>
            <div className={styles.scannerInterface}>
              <div className={styles.scannerDock}>
                <span className={styles.galleryControl}>
                  <Images />
                </span>
                <span className={styles.scanControl}>
                  <ScanSearch />
                </span>
                <span className={styles.historyControl}>
                  <History />
                </span>
              </div>
            </div>
          </PhoneFrame>
          <Image
            alt=""
            className={styles.heroRing}
            height={722}
            priority
            sizes="(max-width: 700px) 118vw, (max-width: 1100px) 610px, 720px"
            src="/jlens/ring.png"
            width={722}
          />
          <span className={`${styles.callout} ${styles.calloutMetal}`}>
            {t("landing.possibleGold")}
            <span className={styles.calloutConnector}>
              <span className={styles.calloutPoint} />
            </span>
          </span>
          <span className={`${styles.callout} ${styles.calloutStone}`}>
            {t("landing.cushionStone")}
            <span className={styles.calloutConnector}>
              <span className={styles.calloutPoint} />
            </span>
          </span>
          <span className={`${styles.callout} ${styles.calloutValue}`}>
            {t("landing.estimatedValue")}
            <span className={styles.calloutConnector}>
              <span className={styles.calloutPoint} />
            </span>
          </span>
        </ResponsivePhoneComposition>
      </div>
    </ViewportHero>
  );
}

function JlensCareSection({ locale }: { locale: SupportedLocaleCode }) {
  const t = getJlensTranslator(locale);
  const careItems = [
    {
      title: t("landing.cleaningTitle"),
      description: t("landing.cleaningDescription"),
      bullets: [t("landing.cleaning1"), t("landing.cleaning2")],
      Icon: BrushCleaning,
    },
    {
      title: t("landing.storageTitle"),
      description: t("landing.storageDescription"),
      bullets: [t("landing.storage1"), t("landing.storage2")],
      Icon: Archive,
    },
    {
      title: t("landing.maintenanceTitle"),
      description: t("landing.maintenanceDescription"),
      bullets: [t("landing.maintenance1"), t("landing.maintenance2")],
      Icon: ShieldCheck,
    },
    {
      title: t("landing.avoidTitle"),
      description: t("landing.avoidDescription"),
      bullets: [t("landing.avoid1"), t("landing.avoid2")],
      Icon: Ban,
    },
  ];
  return (
    <LandingSection className={styles.careSection}>
      <ContentShell className={styles.careLayout}>
        <div className={styles.careCopy}>
          <SectionHeading
            description={t("landing.careDescription")}
            eyebrow={t("landing.careEyebrow")}
            title={t("landing.careTitle")}
          />
          <ol className={styles.careTopics}>
            {careItems.map(({ title, description }, index) => (
              <li key={title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <strong>{title}</strong>
                  <p>{description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className={styles.careVisual}>
          <ResponsivePhoneComposition className={styles.carePhone}>
            <PhoneFrame>
              <div className={styles.careScreen}>
                <div className={styles.careComparison}>
                  <Image
                    alt={t("landing.altCare")}
                    className={styles.careComparisonImage}
                    height={1672}
                    sizes="(max-width: 700px) calc(100vw - 72px), (max-width: 980px) 320px, 390px"
                    src="/jlens/compare/before-after.png"
                    width={941}
                  />
                  <span
                    className={`${styles.compareLabel} ${styles.beforeLabel}`}
                  >
                    {t("landing.before")} <span aria-hidden="true">🤧</span>
                  </span>
                  <span
                    className={`${styles.compareLabel} ${styles.afterLabel}`}
                  >
                    {t("landing.after")} <span aria-hidden="true">🥳</span>
                  </span>
                </div>

                <article className={styles.careCard}>
                  <h3>{t("landing.careCardTitle")}</h3>
                  <ul className={styles.careGroups}>
                    {careItems.map(({ title, bullets, Icon }) => (
                      <li className={styles.careGroup} key={title}>
                        <div className={styles.careGroupHeading}>
                          <Icon aria-hidden="true" />
                          <strong>{title}</strong>
                        </div>
                        <ul className={styles.careBullets}>
                          {bullets.map((bullet) => (
                            <li key={bullet}>{bullet}</li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                </article>
              </div>
            </PhoneFrame>
          </ResponsivePhoneComposition>
        </div>
      </ContentShell>
    </LandingSection>
  );
}

export function JlensLandingPage({ locale }: { locale: SupportedLocaleCode }) {
  const t = getJlensTranslator(locale);
  const config = getLocalizedJlensConfig(locale);
  const privacyHref = withPublicRoute(config, locale, "/privacy");
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${config.canonicalOrigin}/#website`,
        name: config.brand.name,
        url: getCanonicalUrl(config, locale, "/"),
        description: t("seo.landingDescription"),
        inLanguage: locale,
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${config.canonicalOrigin}/#app`,
        name: config.brand.name,
        applicationCategory: "ReferenceApplication",
        operatingSystem: ["iOS", "Android"],
        url: `${config.canonicalOrigin}/`,
        image: `${config.canonicalOrigin}/og.png`,
        description: t("seo.landingDescription"),
        inLanguage: locale,
      },
    ],
  };

  return (
    <JlensSiteLayout locale={locale} activeNavigationHref="/">
      <main>
        <script
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replaceAll("<", "\\u003c"),
          }}
          type="application/ld+json"
        />

        <JlensHero locale={locale} privacyHref={privacyHref} />

        <FeatureShowcaseSection
          className={styles.detailsSection}
          description={t("landing.detailsDescription")}
          eyebrow={t("landing.detailsEyebrow")}
          id="features"
          rows={[
            {
              number: "01",
              title: t("landing.details1Title"),
              description: t("landing.details1Description"),
            },
            {
              number: "02",
              title: t("landing.details2Title"),
              description: t("landing.details2Description"),
            },
            {
              number: "03",
              title: t("landing.details3Title"),
              description: t("landing.details3Description"),
            },
          ]}
          screenshot="/jlens/details.png"
          screenshotAlt={t("landing.altDetails")}
          title={t("landing.detailsTitle")}
          tone="muted"
        />

        <JlensCareSection locale={locale} />

        <FeatureShowcaseSection
          className={styles.collectionSection}
          description={t("landing.collectionDescription")}
          eyebrow={t("landing.collectionEyebrow")}
          id="collection"
          rows={[
            {
              number: "01",
              title: t("landing.collection1Title"),
              description: t("landing.collection1Description"),
            },
            {
              number: "02",
              title: t("landing.collection2Title"),
              description: t("landing.collection2Description"),
            },
            {
              number: "03",
              title: t("landing.collection3Title"),
              description: t("landing.collection3Description"),
            },
          ]}
          screenshot="/jlens/collection.png"
          screenshotAlt={t("landing.altCollection")}
          title={t("landing.collectionTitle")}
          tone="muted"
        />

        <FeatureShowcaseSection
          className={styles.chatSection}
          description={t("landing.chatDescription")}
          eyebrow={t("landing.chatEyebrow")}
          id="assistant"
          rows={[
            {
              number: "01",
              title: t("landing.chat1Title"),
              description: t("landing.chat1Description"),
            },
            {
              number: "02",
              title: t("landing.chat2Title"),
              description: t("landing.chat2Description"),
            },
            {
              number: "03",
              title: t("landing.chat3Title"),
              description: t("landing.chat3Description"),
            },
          ]}
          screenshot="/jlens/chat-2.png"
          screenshotAlt={t("landing.altChat")}
          title={t("landing.chatTitle")}
          visualSide="end"
        />

        <FaqSection
          faqs={([1, 2, 3, 4, 5, 6] as const).map((number) => ({
            question: t(`landing.faq${number}Question`),
            answer: t(`landing.faq${number}Answer`),
          }))}
        />

        <DownloadCta
          badges={config.storeBadges}
          description={t("landing.downloadDescription")}
          locale={locale}
          privacyHref={privacyHref}
          title={t("landing.downloadTitle")}
          waitlistDescription={t("landing.waitlistDescription")}
          waitlistTitle={t("landing.waitlistTitle")}
        />
      </main>
    </JlensSiteLayout>
  );
}

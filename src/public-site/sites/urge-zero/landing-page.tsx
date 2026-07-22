import {
  defaultLocale,
  type SupportedLocaleCode,
} from "@/config/supported-locales";
import { AcquisitionActions } from "@/public-site/components/acquisition";
import {
  DownloadCta,
  FaqSection,
  FeatureShowcaseSection,
  PhoneScreenshot,
  ViewportHero,
} from "@/public-site/components/landing";
import {
  getCanonicalUrl,
  withPublicRoute,
} from "@/public-site/config/public-url";
import { getUrgeZeroTranslator } from "@/public-site/sites/urge-zero/i18n/get-urge-zero-translator";
import { getLocalizedUrgeZeroConfig } from "@/public-site/sites/urge-zero/site-config";
import { UrgeZeroSiteLayout } from "@/public-site/sites/urge-zero/site-layout";

import styles from "./landing-page.module.css";

const appStoreUrl =
  "https://apps.apple.com/us/app/urgezero-quit-addiction/id6774419388";
const googlePlayUrl =
  "https://play.google.com/store/apps/details?id=com.anmisoft.urgezero";

type ScreenshotProps = {
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  src: string;
};

function Screenshot({
  alt,
  className,
  priority,
  sizes = "(max-width: 700px) 78vw, (max-width: 1100px) 34vw, 390px",
  src,
}: ScreenshotProps) {
  return (
    <PhoneScreenshot
      alt={alt}
      className={className}
      priority={priority}
      sizes={sizes}
      src={src}
    />
  );
}

export function UrgeZeroLandingPage({
  locale = defaultLocale,
}: {
  locale?: SupportedLocaleCode;
}) {
  const t = getUrgeZeroTranslator(locale);
  const config = getLocalizedUrgeZeroConfig(locale);
  const privacyHref = withPublicRoute(config, locale, "/privacy");
  const canonical = getCanonicalUrl(config, locale, "/");
  const rows = (prefix: "progress" | "tools" | "games" | "support") =>
    ([1, 2, 3] as const).map((number) => ({
      number: `0${number}`,
      title: t(`landing.${prefix}${number}Title`),
      description: t(`landing.${prefix}${number}Description`),
    }));
  const faqs = ([1, 2, 3, 4, 5, 6] as const).map((number) => ({
    question: t(`landing.faq${number}Question`),
    answer: t(`landing.faq${number}Answer`),
  }));
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${canonical}#website`,
        name: config.brand.name,
        url: canonical,
        description: t("seo.landingDescription"),
        inLanguage: locale,
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${canonical}#app`,
        name: config.brand.name,
        applicationCategory: "HealthApplication",
        operatingSystem: ["iOS", "iPadOS", "Android"],
        url: canonical,
        image: `${config.canonicalOrigin}/og.png`,
        description: t("seo.landingDescription"),
        inLanguage: locale,
        downloadUrl: [appStoreUrl, googlePlayUrl],
        sameAs: [appStoreUrl, googlePlayUrl],
      },
      {
        "@type": "FAQPage",
        "@id": `${canonical}#faq`,
        inLanguage: locale,
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
    ],
  };

  return (
    <UrgeZeroSiteLayout locale={locale} activeNavigationHref="/">
      <main>
        <script
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replaceAll("<", "\\u003c"),
          }}
          type="application/ld+json"
        />
        <ViewportHero
          className={styles.hero}
          innerClassName={styles.heroInner}
          labelledBy="urge-zero-hero-title"
        >
          <div className={styles.heroCopy}>
            <h1 id="urge-zero-hero-title">
              {t.rich("landing.heroTitle", {
                accent: (chunks) => (
                  <span className={styles.heroHighlight}>{chunks}</span>
                ),
              })}
            </h1>
            <p className={styles.heroDescription}>
              {t("landing.heroDescription")}
            </p>
            <AcquisitionActions
              ariaLabel={t("landing.downloadAria")}
              badges={config.storeBadges}
              className={styles.heroActions}
              locale={locale}
              privacyHref={privacyHref}
              source="hero"
            />
          </div>
          <div className={styles.heroVisual}>
            <Screenshot
              alt={t("landing.altEmergency")}
              className={styles.heroPhone}
              priority
              sizes="(max-width: 700px) 78vw, (max-width: 1100px) 46vw, 430px"
              src="/urge-zero/emergency.png"
            />
          </div>
        </ViewportHero>

        <FeatureShowcaseSection
          className={styles.progressSection}
          description={t("landing.progressDescription")}
          eyebrow={t("landing.progressEyebrow")}
          id="how-it-helps"
          rows={rows("progress")}
          screenshot="/urge-zero/home.png"
          screenshotAlt={t("landing.altHome")}
          title={t("landing.progressTitle")}
          visualSide="start"
        />
        <FeatureShowcaseSection
          className={styles.toolsSection}
          description={t("landing.toolsDescription")}
          eyebrow={t("landing.toolsEyebrow")}
          id="tools"
          rows={rows("tools")}
          title={t("landing.toolsTitle")}
          visual={
            <div className={styles.toolPhones}>
              <Screenshot
                alt={t("landing.altBreath")}
                className={styles.toolPhoneBack}
                src="/urge-zero/breath.png"
              />
              <Screenshot
                alt={t("landing.altActivities")}
                className={styles.toolPhoneFront}
                src="/urge-zero/shift-mind.png"
              />
            </div>
          }
          visualSide="end"
        />
        <FeatureShowcaseSection
          className={styles.gamesSection}
          description={t("landing.gamesDescription")}
          eyebrow={t("landing.gamesEyebrow")}
          rows={rows("games")}
          title={t("landing.gamesTitle")}
          visual={
            <div className={styles.gamePhones}>
              <Screenshot
                alt={t("landing.altGame1")}
                className={styles.gamePhoneLeft}
                src="/urge-zero/game-1.png"
              />
              <Screenshot
                alt={t("landing.altGame2")}
                className={styles.gamePhoneRight}
                src="/urge-zero/game-2.png"
              />
            </div>
          }
          visualSide="start"
        />
        <FeatureShowcaseSection
          className={styles.supportSection}
          description={t("landing.supportDescription")}
          eyebrow={t("landing.supportEyebrow")}
          rows={rows("support")}
          title={t("landing.supportTitle")}
          visual={
            <div className={styles.supportPhones}>
              <Screenshot
                alt={t("landing.altCoach")}
                className={styles.supportPhoneBack}
                src="/urge-zero/chat.png"
              />
              <Screenshot
                alt={t("landing.altCommunity")}
                className={styles.supportPhoneFront}
                src="/urge-zero/social.png"
              />
            </div>
          }
          visualSide="end"
        />
        <FaqSection faqs={faqs} title={t("landing.faqTitle")} />
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
    </UrgeZeroSiteLayout>
  );
}

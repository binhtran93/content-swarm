import Image from "next/image";
import type { ReactNode } from "react";

import {
  ContentShell,
  DownloadCta,
  FaqSection,
  FeatureShowcaseSection,
  LandingHero,
  LandingSection,
  PhoneFrame,
  PhoneScreenshot,
  SectionHeading,
} from "@/public-site/components/landing";
import { AcquisitionActions } from "@/public-site/components/acquisition";
import { SiteShell } from "@/public-site/components/site";
import {
  getProjectRoutePrefix,
  withPublicRoute,
} from "@/public-site/config/public-url";
import {
  getSubiqTranslator,
  resolveSubiqStaticLocale,
} from "@/public-site/sites/subiq/i18n/get-subiq-translator";
import { getLocalizedSubiqConfig } from "@/public-site/sites/subiq/site-config";
import type { SupportedLocaleCode } from "@/config/supported-locales";

import "./theme.css";
import styles from "./landing-page.module.css";

const logoDevPublishableKey = process.env.NEXT_PUBLIC_LOGO_DEV_PUBLISHABLE_KEY;

function getLogoUrl(domain: string) {
  const params = new URLSearchParams({
    size: "128",
    retina: "true",
    format: "webp",
    fallback: "404",
  });

  if (logoDevPublishableKey) {
    params.set("token", logoDevPublishableKey);
  }

  return `https://img.logo.dev/${domain}?${params.toString()}`;
}

const subscriptionLogos = {
  amazon: getLogoUrl("amazon.com"),
  apple: getLogoUrl("apple.com"),
  canva: getLogoUrl("canva.com"),
  disneyPlus: getLogoUrl("disneyplus.com"),
  duolingo: getLogoUrl("duolingo.com"),
  icloud: getLogoUrl("icloud.com"),
  max: getLogoUrl("max.com"),
  netflix: getLogoUrl("netflix.com"),
  openai: getLogoUrl("openai.com"),
  youtube: getLogoUrl("youtube.com"),
} as const;

type SubscriptionBubbleProps = {
  className: string;
  logo: string;
  logoSize?: number;
  price: string;
};

function SubscriptionBubble({
  className,
  logo,
  logoSize = 56,
  price,
}: SubscriptionBubbleProps) {
  return (
    <div className={`${styles.floatingBubble} ${className}`}>
      <div className={styles.bubbleMotion}>
        <div className={styles.bubbleSurface}>
          <Image
            src="/subiq/bubble.webp"
            alt=""
            width={910}
            height={910}
            loading="eager"
            className={styles.bubbleShell}
          />
          <Image
            src={logo}
            alt=""
            width={logoSize}
            height={logoSize}
            unoptimized
            referrerPolicy="origin"
            className={styles.serviceLogo}
          />
          <span className={styles.bubblePrice}>{price}</span>
        </div>
      </div>
    </div>
  );
}

function SubscriptionCluster() {
  return (
    <div className={styles.heroBubbleField}>
      <SubscriptionBubble
        className={`${styles.phoneService} ${styles.phoneServiceOne}`}
        logo={subscriptionLogos.openai}
        logoSize={42}
        price="$100.00"
      />
      <SubscriptionBubble
        className={`${styles.phoneService} ${styles.phoneServiceTwo}`}
        logo={subscriptionLogos.duolingo}
        logoSize={32}
        price="$12.99"
      />
      <SubscriptionBubble
        className={`${styles.phoneService} ${styles.phoneServiceThree}`}
        logo={subscriptionLogos.amazon}
        logoSize={31}
        price="$14.99"
      />
      <SubscriptionBubble
        className={`${styles.phoneService} ${styles.phoneServiceFour}`}
        logo={subscriptionLogos.max}
        logoSize={28}
        price="$18.49"
      />
      <SubscriptionBubble
        className={`${styles.phoneService} ${styles.phoneServiceFive}`}
        logo={subscriptionLogos.disneyPlus}
        logoSize={32}
        price="$18.99"
      />
      <SubscriptionBubble
        className={`${styles.phoneService} ${styles.phoneServiceSix}`}
        logo={subscriptionLogos.youtube}
        logoSize={32}
        price="$13.99"
      />
      <SubscriptionBubble
        className={`${styles.phoneService} ${styles.phoneServiceSeven}`}
        logo={subscriptionLogos.apple}
        logoSize={32}
        price="$12.99"
      />
      <SubscriptionBubble
        className={`${styles.phoneService} ${styles.phoneServiceEight}`}
        logo={subscriptionLogos.netflix}
        logoSize={32}
        price="$19.99"
      />
      <SubscriptionBubble
        className={`${styles.phoneService} ${styles.phoneServiceNine}`}
        logo={subscriptionLogos.canva}
        logoSize={32}
        price="$15.00"
      />
      <SubscriptionBubble
        className={`${styles.phoneService} ${styles.phoneServiceTen}`}
        logo={subscriptionLogos.icloud}
        logoSize={32}
        price="$9.99"
      />
    </div>
  );
}

function CellularStatusIcon() {
  return (
    <svg
      className={styles.statusIconCellular}
      viewBox="0 0 18 14"
      aria-hidden="true"
    >
      <rect x="1" y="9" width="2.5" height="4" rx="1" />
      <rect x="5.5" y="6.5" width="2.5" height="6.5" rx="1" />
      <rect x="10" y="3.5" width="2.5" height="9.5" rx="1" />
      <rect x="14.5" y="1" width="2.5" height="12" rx="1" />
    </svg>
  );
}

function WifiStatusIcon() {
  return (
    <svg
      className={styles.statusIconWifi}
      viewBox="0 0 20 15"
      aria-hidden="true"
    >
      <path d="M1.7 4.7C6.3 1.2 13.7 1.2 18.3 4.7" />
      <path d="M4.8 8.1C7.7 5.9 12.3 5.9 15.2 8.1" />
      <path d="M8.2 11.4C9.3 10.6 10.7 10.6 11.8 11.4" />
      <circle cx="10" cy="13.2" r="1.15" />
    </svg>
  );
}

function BatteryStatusIcon() {
  return (
    <svg
      className={styles.statusIconBattery}
      viewBox="0 0 27 14"
      aria-hidden="true"
    >
      <rect
        x="1"
        y="1"
        width="22"
        height="12"
        rx="3.2"
        className={styles.batteryOutline}
      />
      <rect x="3.5" y="3.5" width="17" height="7" rx="1.4" />
      <path d="M25 5V9" className={styles.batteryTip} />
    </svg>
  );
}

function PhoneMockup({
  labels,
}: {
  labels: {
    thisMonth: string;
    dueTomorrow: string;
    dueDays: string;
    home: string;
    subscriptions: string;
    tools: string;
    settings: string;
  };
}) {
  return (
    <div className={styles.phoneComposition}>
      <div className={styles.phoneFade}>
        <div className={styles.phoneMask}>
          <PhoneFrame>
            <div className={styles.statusBar}>
              <span>9:23</span>
              <div className={styles.statusIcons}>
                <CellularStatusIcon />
                <WifiStatusIcon />
                <BatteryStatusIcon />
              </div>
            </div>

            <div className={styles.phoneToolbar}>
              <Image
                src="/subiq/mascot-hi.webp"
                alt=""
                width={42}
                height={42}
              />
              <div className={styles.phoneToolbarActions}>
                <span className={styles.chartGlyph}>
                  <i />
                  <i />
                  <i />
                </span>
                <span className={styles.plusGlyph}>+</span>
              </div>
            </div>

            <div className={styles.phoneSummary}>
              <span>{labels.thisMonth}</span>
              <strong>$237.42</strong>
            </div>

            <div className={styles.renewalRail}>
              <div className={styles.renewalCard}>
                <div>
                  <Image
                    src={subscriptionLogos.disneyPlus}
                    alt=""
                    width={18}
                    height={18}
                    unoptimized
                    referrerPolicy="origin"
                  />
                  <span>Disney+</span>
                </div>
                <small className={styles.renewalUrgent}>
                  {labels.dueTomorrow}
                </small>
              </div>
              <div className={styles.renewalCard}>
                <div>
                  <Image
                    src={subscriptionLogos.amazon}
                    alt=""
                    width={18}
                    height={18}
                    unoptimized
                    referrerPolicy="origin"
                  />
                  <span>Amazon Prime</span>
                </div>
                <small className={styles.renewalWarning}>
                  {labels.dueDays}
                </small>
              </div>
            </div>

            <div className={styles.phoneTabs}>
              <div className={styles.activeTab}>
                <span className={styles.homeGlyph} />
                <small>{labels.home}</small>
              </div>
              <div>
                <span className={styles.cardGlyph} />
                <small>{labels.subscriptions}</small>
              </div>
              <div>
                <span className={styles.gridGlyph} />
                <small>{labels.tools}</small>
              </div>
              <div>
                <span className={styles.settingsGlyph}>⚙</span>
                <small>{labels.settings}</small>
              </div>
            </div>
          </PhoneFrame>
        </div>
      </div>
      <SubscriptionCluster />
    </div>
  );
}

function StorePreview({
  icon,
  label,
  device,
  screenshot,
  screenshotWidth,
  screenshotHeight,
  alt,
}: {
  icon: string;
  label: string;
  device: string;
  screenshot: string;
  screenshotWidth: number;
  screenshotHeight: number;
  alt: string;
}) {
  return (
    <article className={styles.storePreview}>
      <div className={styles.storePreviewHeader}>
        <Image
          src={icon}
          alt=""
          width={46}
          height={46}
          className={styles.storePlatformIcon}
        />
        <div>
          <h3>{label}</h3>
          <p>{device}</p>
        </div>
      </div>
      <Image
        src={screenshot}
        alt={alt}
        width={screenshotWidth}
        height={screenshotHeight}
        sizes="(max-width: 700px) 46vw, (max-width: 1100px) 260px, 280px"
        className={styles.storeScreenshotImage}
      />
    </article>
  );
}

export function SubiqLandingPage({ locale }: { locale: SupportedLocaleCode }) {
  const contentLocale = resolveSubiqStaticLocale(locale);
  const config = getLocalizedSubiqConfig(contentLocale);
  const routePrefix = getProjectRoutePrefix(config);
  const privacyHref = withPublicRoute(config, contentLocale, "/privacy");
  const t = getSubiqTranslator(contentLocale);
  const accent = (chunks: ReactNode) => (
    <span className={styles.accentText}>{chunks}</span>
  );
  const rows = (group: "cost" | "calendar" | "analytics") =>
    ([1, 2, 3] as const).map((number) => ({
      number: `0${number}`,
      title: t(`landing.${group}${number}Title`),
      description: t(`landing.${group}${number}Description`),
    }));
  const faqs = ([1, 2, 3, 4, 5, 6] as const).map((number) => ({
    question: t(`landing.faq${number}Question`),
    answer: t(`landing.faq${number}Answer`),
  }));
  const websiteStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: config.brand.name,
    url: config.canonicalOrigin,
    description: t("seo.websiteDescription"),
    inLanguage: contentLocale,
  };

  return (
    <SiteShell
      config={config}
      routePrefix={routePrefix}
      locale={contentLocale}
      languageMenuLabel={t("site.changeLanguage")}
    >
      <main>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteStructuredData).replaceAll(
              "<",
              "\\u003c",
            ),
          }}
        />
        <LandingHero
          title={t.rich("landing.heroTitle", { accent })}
          description={t("landing.heroDescription")}
          actions={
            <AcquisitionActions
              badges={config.storeBadges}
              locale={contentLocale}
              privacyHref={privacyHref}
              source="hero"
            />
          }
          visual={
            <>
              <span
                className={`${styles.ambientBubble} ${styles.ambientOne}`}
              />
              <span
                className={`${styles.ambientBubble} ${styles.ambientTwo}`}
              />
              <span
                className={`${styles.ambientBubble} ${styles.ambientThree}`}
              />
              <span
                className={`${styles.ambientBubble} ${styles.ambientFour}`}
              />
              <span
                className={`${styles.ambientBubble} ${styles.ambientFive}`}
              />
              <span
                className={`${styles.ambientBubble} ${styles.ambientSix}`}
              />

              <PhoneMockup
                labels={{
                  thisMonth: t("landing.phoneThisMonth"),
                  dueTomorrow: t("landing.phoneDueTomorrow"),
                  dueDays: t("landing.phoneDueDays", { days: 6 }),
                  home: t("landing.phoneHome"),
                  subscriptions: t("landing.phoneSubscriptions"),
                  tools: t("landing.phoneTools"),
                  settings: t("landing.phoneSettings"),
                }}
              />
            </>
          }
        />

        <FeatureShowcaseSection
          id="features"
          tone="muted"
          eyebrow={t("landing.costEyebrow")}
          title={t.rich("landing.costTitle", { accent })}
          description={t("landing.costDescription")}
          rows={rows("cost")}
          screenshot="/subiq/ss_sub_details.png"
          screenshotAlt={t("landing.altDetails")}
        />

        <FeatureShowcaseSection
          visualSide="end"
          eyebrow={t("landing.calendarEyebrow")}
          title={t.rich("landing.calendarTitle", { accent })}
          description={t("landing.calendarDescription")}
          rows={rows("calendar")}
          screenshot="/subiq/ss_calendar.png"
          screenshotAlt={t("landing.altCalendar")}
        />

        <FeatureShowcaseSection
          id="analytics"
          tone="muted"
          className={styles.analyticsSection}
          eyebrow={t("landing.analyticsEyebrow")}
          title={t.rich("landing.analyticsTitle", { accent })}
          description={t("landing.analyticsDescription")}
          rows={rows("analytics")}
          screenshot="/subiq/ss_data.png"
          screenshotAlt={t("landing.altAnalytics")}
        />

        <LandingSection className={styles.guidesSection} id="guides">
          <ContentShell className={styles.guidesInner}>
            <SectionHeading
              className={styles.guidesHeading}
              eyebrow={t("landing.guidesEyebrow")}
              title={t.rich("landing.guidesTitle", { accent })}
              description={t("landing.guidesDescription")}
            />

            <div className={styles.guideVisuals}>
              <article className={styles.guideVisual}>
                <div className={styles.guideCaption}>
                  <span>01</span>
                  <div>
                    <h3>{t("landing.cancelGuide")}</h3>
                  </div>
                </div>
                <PhoneScreenshot
                  className={styles.guidePhone}
                  src="/subiq/how_to_cancel.png"
                  alt={t("landing.altCancel")}
                />
              </article>

              <article className={styles.guideVisual}>
                <div className={styles.guideCaption}>
                  <span>02</span>
                  <div>
                    <h3>{t("landing.refundGuide")}</h3>
                  </div>
                </div>
                <PhoneScreenshot
                  className={styles.guidePhone}
                  src="/subiq/how_to_refund.png"
                  alt={t("landing.altRefund")}
                />
              </article>
            </div>
          </ContentShell>
        </LandingSection>

        <LandingSection
          className={styles.storeManagementSection}
          id="store-management"
        >
          <ContentShell className={styles.storeManagementLayout}>
            <div className={styles.storeManagementCopy}>
              <SectionHeading
                className={styles.storeManagementHeading}
                eyebrow={t("landing.storesEyebrow")}
                title={t.rich("landing.storesTitle", { accent })}
                description={t("landing.storesDescription")}
              />
            </div>

            <div className={styles.storePreviews}>
              <StorePreview
                icon="/subiq/app-store-logo.png"
                label="App Store"
                device={t("landing.appleDevices")}
                screenshot="/subiq/ios_subs.png"
                screenshotWidth={1179}
                screenshotHeight={2556}
                alt={t("landing.altApple")}
              />
              <StorePreview
                icon="/subiq/google-play-logo.png"
                label="Google Play"
                device={t("landing.androidDevice")}
                screenshot="/subiq/adnroid-subs.jpg"
                screenshotWidth={1080}
                screenshotHeight={2400}
                alt={t("landing.altGoogle")}
              />
            </div>
          </ContentShell>
        </LandingSection>

        <FaqSection faqs={faqs} title={t("landing.faqTitle")} />

        <DownloadCta
          title={t.rich("landing.downloadTitle", {
            accent: (chunks) => (
              <span className={styles.downloadAccent}>{chunks}</span>
            ),
          })}
          description={t("landing.downloadDescription")}
          waitlistTitle={t.rich("landing.waitlistTitle", {
            accent: (chunks) => (
              <span className={styles.downloadAccent}>{chunks}</span>
            ),
          })}
          waitlistDescription={t("landing.waitlistDescription")}
          badges={config.storeBadges}
          locale={contentLocale}
          privacyHref={privacyHref}
        />
      </main>
    </SiteShell>
  );
}

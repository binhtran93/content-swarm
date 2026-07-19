import Image from "next/image";

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
import { getPublicTranslator } from "@/public-site/i18n/get-public-translator";
import { subiqSiteConfig } from "@/public-site/sites/subiq/site-config";
import type { SupportedLocaleCode } from "@/config/supported-locales";

import "./theme.css";
import styles from "./landing-page.module.css";

const subscriptionDetailRows = [
  {
    number: "01",
    title: "Subscription cost overview",
    description: "See the monthly price, lifetime spend, and current status",
  },
  {
    number: "02",
    title: "Payment history",
    description: "Review every recorded charge and renewal date in order",
  },
  {
    number: "03",
    title: "Next renewal",
    description: "Check the upcoming renewal and current billing cycle",
  },
];

const renewalCalendarRows = [
  {
    number: "01",
    title: "Monthly renewal calendar",
    description: "See each subscription on the date it is due",
  },
  {
    number: "02",
    title: "Estimated monthly spending",
    description: "Plan for the estimated total before charges arrive",
  },
  {
    number: "03",
    title: "Renewal details",
    description: "Review the price, billing period, and renewal date",
  },
];

const analyticsRows = [
  {
    number: "01",
    title: "Monthly spending trends",
    description: "Compare recurring subscription costs month by month",
  },
  {
    number: "02",
    title: "Spending by category",
    description:
      "See how much goes to productivity, entertainment, education, and more",
  },
  {
    number: "03",
    title: "Highest-cost subscriptions",
    description: "Find the subscriptions with the biggest impact on your total",
  },
];

const faqs = [
  {
    question: "What subscriptions can I track with SubIQ?",
    answer:
      "You can track subscriptions and other recurring expenses by saving the provider, price, currency, billing period, start date, category, trial details, price changes, renewal information, and reminder preferences.",
  },
  {
    question: "How do subscription renewal and free-trial reminders work?",
    answer:
      "Choose which reminders to enable for each subscription, and SubIQ schedules the selected alerts on your device. Delivery depends on your device notification settings.",
  },
  {
    question: "Can SubIQ cancel subscriptions for me?",
    answer:
      "No. SubIQ provides informational steps and links for the provider you select, but you complete and confirm each cancellation directly with that provider.",
  },
  {
    question: "How accurate are subscription costs and renewal dates?",
    answer:
      "Displayed amounts and dates are estimates based on the details you enter and general exchange rates. Taxes, fees, provider rules, and currency changes can affect the final charge.",
  },
  {
    question: "How does SubIQ store my subscription data?",
    answer:
      "SubIQ uses Firebase to store subscription records and preferences associated with an anonymous account or, if you choose, a Google-linked account for syncing across supported devices.",
  },
];

const websiteStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "SubIQ",
  url: "https://getsubiq.com/",
  description:
    "A subscription tracker for recurring expenses, renewal dates, free trials, and subscription spending.",
};

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

function PhoneMockup() {
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
              <span>This month</span>
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
                  Payment due tomorrow
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
                  Payment due in 6 days
                </small>
              </div>
            </div>

            <div className={styles.phoneTabs}>
              <div className={styles.activeTab}>
                <span className={styles.homeGlyph} />
                <small>Home</small>
              </div>
              <div>
                <span className={styles.cardGlyph} />
                <small>Subscriptions</small>
              </div>
              <div>
                <span className={styles.gridGlyph} />
                <small>Tools</small>
              </div>
              <div>
                <span className={styles.settingsGlyph}>⚙</span>
                <small>Settings</small>
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
  const routePrefix = getProjectRoutePrefix(subiqSiteConfig);
  const privacyHref = withPublicRoute(subiqSiteConfig, locale, "/privacy");
  const t = getPublicTranslator();

  return (
    <SiteShell
      config={subiqSiteConfig}
      routePrefix={routePrefix}
      locale={locale}
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
          title={
            <>
              <span>Track every</span> <span>subscription</span>{" "}
              <span className={styles.accentText}>in one place</span>
            </>
          }
          description="SubIQ is a subscription tracker that keeps recurring costs, renewal dates, and free trials in one place, with spending insights and clear cancellation guidance"
          actions={
            <AcquisitionActions
              badges={subiqSiteConfig.storeBadges}
              locale={locale}
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

              <PhoneMockup />
            </>
          }
        />

        <FeatureShowcaseSection
          id="features"
          tone="muted"
          eyebrow="Subscription cost tracker"
          title={
            <>
              See the full cost of{" "}
              <span className={styles.accentText}>every subscription</span>
            </>
          }
          description="Keep each subscription’s monthly price, lifetime spend, status, payment history, and next renewal date together in one clear view"
          rows={subscriptionDetailRows}
          screenshot="/subiq/ss_sub_details.png"
          screenshotAlt="SubIQ subscription details screen showing Netflix costs, status, and payment timeline"
        />

        <FeatureShowcaseSection
          visualSide="end"
          eyebrow="Subscription renewal calendar"
          title={
            <>
              Plan for renewals{" "}
              <span className={styles.accentText}>before they are due</span>
            </>
          }
          description="View upcoming subscription renewal dates and estimated monthly spending in one calendar, so recurring charges never catch you off guard"
          rows={renewalCalendarRows}
          screenshot="/subiq/ss_calendar.png"
          screenshotAlt="SubIQ renewal calendar showing July subscription dates and estimated monthly cost"
        />

        <FeatureShowcaseSection
          id="analytics"
          tone="muted"
          className={styles.analyticsSection}
          eyebrow="Subscription spending insights"
          title={
            <>
              Understand where your{" "}
              <span className={styles.accentText}>
                subscription budget goes
              </span>
            </>
          }
          description="Compare monthly subscription costs, explore spending by category, and identify the services that have the biggest effect on your budget"
          rows={analyticsRows}
          screenshot="/subiq/ss_data.png"
          screenshotAlt="SubIQ analytics screen showing monthly spending trends, category breakdown, and top subscriptions"
        />

        <LandingSection className={styles.guidesSection} id="guides">
          <ContentShell className={styles.guidesInner}>
            <SectionHeading
              className={styles.guidesHeading}
              eyebrow="Subscription cancellation & refund guides"
              title={
                <>
                  Cancel subscriptions or request refunds,{" "}
                  <span className={styles.accentText}>step by step</span>
                </>
              }
              description="Choose a provider to find clear instructions and helpful links, then complete the cancellation or refund request directly with that provider"
            />

            <div className={styles.guideVisuals}>
              <article className={styles.guideVisual}>
                <div className={styles.guideCaption}>
                  <span>01</span>
                  <div>
                    <h3>How to cancel a subscription</h3>
                  </div>
                </div>
                <PhoneScreenshot
                  className={styles.guidePhone}
                  src="/subiq/how_to_cancel.png"
                  alt="SubIQ cancellation guide showing step-by-step instructions for ending an Amazon Prime membership"
                />
              </article>

              <article className={styles.guideVisual}>
                <div className={styles.guideCaption}>
                  <span>02</span>
                  <div>
                    <h3>How to request a refund</h3>
                  </div>
                </div>
                <PhoneScreenshot
                  className={styles.guidePhone}
                  src="/subiq/how_to_refund.png"
                  alt="SubIQ refund guide showing step-by-step instructions for requesting a refund from Canva"
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
                eyebrow="App Store & Google Play subscriptions"
                title={
                  <>
                    Open your subscription settings in{" "}
                    <span className={styles.accentText}>one tap</span>
                  </>
                }
                description="Jump from SubIQ to Apple or Google’s subscription settings to review, change, or cancel eligible app subscriptions"
              />
            </div>

            <div className={styles.storePreviews}>
              <StorePreview
                icon="/subiq/app-store-logo.png"
                label="App Store"
                device="iPhone & iPad"
                screenshot="/subiq/ios_subs.png"
                screenshotWidth={1179}
                screenshotHeight={2556}
                alt="Apple subscription management screen showing active subscriptions and renewal settings"
              />
              <StorePreview
                icon="/subiq/google-play-logo.png"
                label="Google Play"
                device="Android"
                screenshot="/subiq/adnroid-subs.jpg"
                screenshotWidth={1080}
                screenshotHeight={2400}
                alt="Google Play subscription management screen showing active and expired subscriptions"
              />
            </div>
          </ContentShell>
        </LandingSection>

        <FaqSection faqs={faqs} />

        <DownloadCta
          title={
            <>
              Download the{" "}
              <span className={styles.downloadAccent}>SubIQ tracker</span>
            </>
          }
          description="Track subscriptions on iOS and Android"
          waitlistTitle={
            <>
              Be first to try{" "}
              <span className={styles.downloadAccent}>SubIQ</span>
            </>
          }
          waitlistDescription="Join the waitlist and we’ll email you when the SubIQ subscription tracker is available"
          badges={subiqSiteConfig.storeBadges}
          locale={locale}
          privacyHref={privacyHref}
        />
      </main>
    </SiteShell>
  );
}

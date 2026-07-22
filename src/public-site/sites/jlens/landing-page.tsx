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
import { withPublicRoute } from "@/public-site/config/public-url";
import { jlensLandingDescription } from "@/public-site/sites/jlens/landing-metadata";
import { jlensSiteConfig } from "@/public-site/sites/jlens/site-config";
import { JlensSiteLayout } from "@/public-site/sites/jlens/site-layout";

import styles from "./landing-page.module.css";

const faqs = [
  {
    question: "How do I identify jewelry from a photo?",
    answer:
      "Open JLens and take a clear photo or choose one from your library—start with the complete piece, then add a sharp close-up of any hallmark, clasp, engraving, or stone setting when you want more useful visible clues",
  },
  {
    question: "What jewelry and gemstones can JLens identify?",
    answer:
      "JLens can analyze photos of rings, necklaces, bracelets, earrings, pendants, watches, loose gemstones, crystals, and minerals, with likely matches based on what is visible in the submitted images",
  },
  {
    question: "Can JLens confirm whether gold or a diamond is real?",
    answer:
      "No photo-based AI can certify metal purity or gemstone authenticity—JLens can explain visible marks and possible materials, but professional testing is needed when authenticity matters",
  },
  {
    question: "Is an estimated value a professional appraisal?",
    answer:
      "No—JLens provides an informational estimated range based on visible characteristics and available context, while condition, provenance, laboratory testing, and market demand can materially change value, so use a qualified appraiser for insurance, sale, estate, or legal decisions",
  },
  {
    question: "Can I save scans and track a jewelry collection?",
    answer:
      "Yes—you can save identified pieces, revisit their results, and use the collection view to organize your jewelry and review its combined estimated value",
  },
  {
    question: "Is JLens available on iPhone and Android?",
    answer:
      "Yes—JLens is available through the Apple App Store for iPhone and iPad and through Google Play for supported Android devices",
  },
] as const;

function JlensHero({ privacyHref }: { privacyHref: string }) {
  return (
    <ViewportHero
      className={styles.hero}
      innerClassName={styles.heroInner}
      labelledBy="jlens-hero-title"
    >
      <div className={styles.heroCopy}>
        <h1 id="jlens-hero-title">
          Jewelry <span className={styles.heroTitleAccent}>Identifier</span>
        </h1>
        <p className={styles.heroDescription}>
          Snap a photo to uncover clues about a piece, save what you find, and
          ask questions along the way
        </p>
        <AcquisitionActions
          ariaLabel="Download JLens"
          badges={jlensSiteConfig.storeBadges}
          className={styles.heroActions}
          locale={jlensSiteConfig.defaultLocale}
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
            Possible 14K gold
            <span className={styles.calloutConnector}>
              <span className={styles.calloutPoint} />
            </span>
          </span>
          <span className={`${styles.callout} ${styles.calloutStone}`}>
            Cushion-cut stone
            <span className={styles.calloutConnector}>
              <span className={styles.calloutPoint} />
            </span>
          </span>
          <span className={`${styles.callout} ${styles.calloutValue}`}>
            Est. value $2,600
            <span className={styles.calloutConnector}>
              <span className={styles.calloutPoint} />
            </span>
          </span>
        </ResponsivePhoneComposition>
      </div>
    </ViewportHero>
  );
}

const careItems = [
  {
    title: "Cleaning",
    description: "Gentle habits for everyday freshness",
    bullets: [
      "Wipe with a soft, dry microfiber cloth",
      "Avoid harsh chemical cleaners",
    ],
    Icon: BrushCleaning,
  },
  {
    title: "Storage",
    description: "A safer place for pieces between wears",
    bullets: [
      "Store separately to prevent scratches",
      "Keep in a cool, dry place",
    ],
    Icon: Archive,
  },
  {
    title: "Maintenance",
    description: "Small checks that help prevent bigger problems",
    bullets: [
      "Check clasps, links, and settings regularly",
      "Clean gently after wearing to remove oils",
    ],
    Icon: ShieldCheck,
  },
  {
    title: "Avoid",
    description: "Know what can cause unnecessary wear",
    bullets: [
      "Perfume, hairspray, and cosmetics",
      "Prolonged water or humidity",
    ],
    Icon: Ban,
  },
] as const;

function JlensCareSection() {
  return (
    <LandingSection className={styles.careSection}>
      <ContentShell className={styles.careLayout}>
        <div className={styles.careCopy}>
          <SectionHeading
            description="Simple guidance for cleaning, storage, and everyday care"
            eyebrow="Jewelry care"
            title="Help every piece look its best"
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
          <div className={styles.carePhone}>
            <PhoneFrame>
              <div className={styles.careScreen}>
                <div className={styles.careComparison}>
                  <Image
                    alt="Split before-and-after photo of a gold ring showing visible condition differences"
                    className={styles.careComparisonImage}
                    height={1672}
                    sizes="(max-width: 700px) calc(100vw - 72px), (max-width: 980px) 320px, 390px"
                    src="/jlens/compare/before-after.png"
                    width={941}
                  />
                  <span
                    className={`${styles.compareLabel} ${styles.beforeLabel}`}
                  >
                    Before <span aria-hidden="true">🤧</span>
                  </span>
                  <span
                    className={`${styles.compareLabel} ${styles.afterLabel}`}
                  >
                    After <span aria-hidden="true">🥳</span>
                  </span>
                </div>

                <article className={styles.careCard}>
                  <h3>Care &amp; maintenance</h3>
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
          </div>
        </div>
      </ContentShell>
    </LandingSection>
  );
}

export function JlensLandingPage() {
  const privacyHref = withPublicRoute(
    jlensSiteConfig,
    jlensSiteConfig.defaultLocale,
    "/privacy",
  );
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${jlensSiteConfig.canonicalOrigin}/#website`,
        name: jlensSiteConfig.brand.name,
        url: `${jlensSiteConfig.canonicalOrigin}/`,
        description: jlensLandingDescription,
        inLanguage: "en-US",
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${jlensSiteConfig.canonicalOrigin}/#app`,
        name: jlensSiteConfig.brand.name,
        applicationCategory: "ReferenceApplication",
        operatingSystem: ["iOS", "Android"],
        url: `${jlensSiteConfig.canonicalOrigin}/`,
        image: `${jlensSiteConfig.canonicalOrigin}/og.png`,
        description: jlensLandingDescription,
      },
    ],
  };

  return (
    <JlensSiteLayout activeNavigationHref="/">
      <main>
        <script
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replaceAll("<", "\\u003c"),
          }}
          type="application/ld+json"
        />

        <JlensHero privacyHref={privacyHref} />

        <FeatureShowcaseSection
          className={styles.detailsSection}
          description="Take a photo and get a simple starting point for understanding the piece in front of you"
          eyebrow="Jewelry identification"
          id="features"
          rows={[
            {
              number: "01",
              title: "Spot likely materials",
              description:
                "See which metals and stones may match what’s visible",
            },
            {
              number: "02",
              title: "Notice the details",
              description: "Explore the style, setting, and any readable marks",
            },
            {
              number: "03",
              title: "Get a value range",
              description:
                "See an estimate, then ask a professional when certainty matters",
            },
          ]}
          screenshot="/jlens/details.png"
          screenshotAlt="JLens jewelry identification result showing an estimated value range, metal, gemstone, style, and summary"
          title="A closer look, in seconds"
          tone="muted"
        />

        <JlensCareSection />

        <FeatureShowcaseSection
          className={styles.collectionSection}
          description="Save the pieces you care about and find them again whenever you need"
          eyebrow="Your collection"
          id="collection"
          rows={[
            {
              number: "01",
              title: "Keep everything together",
              description: "Store each photo and result in one place",
            },
            {
              number: "02",
              title: "See the bigger picture",
              description:
                "View the combined estimated value of your saved pieces",
            },
            {
              number: "03",
              title: "Pick up where you left off",
              description:
                "Return to any piece without starting the search again",
            },
          ]}
          screenshot="/jlens/collection.png"
          screenshotAlt="JLens collection screen organizing jewelry with estimated values in a personal catalog"
          title="Your jewelry, all in one place"
          tone="muted"
        />

        <FeatureShowcaseSection
          className={styles.chatSection}
          description="Still curious? Ask a follow-up and get a straightforward answer"
          eyebrow="Ask JLens"
          id="assistant"
          rows={[
            {
              number: "01",
              title: "Care for it confidently",
              description: "Ask about cleaning, storage, and everyday handling",
            },
            {
              number: "02",
              title: "Make sense of a mark",
              description:
                "Talk through visible stamps or unfamiliar materials",
            },
            {
              number: "03",
              title: "Know when to get help",
              description:
                "See when a jeweler or appraiser is the better next step",
            },
          ]}
          screenshot="/jlens/chat-2.png"
          screenshotAlt="JLens AI jewelry chat answering a follow-up question about safely cleaning a ring"
          title="Curious about a piece? Ask away"
          visualSide="end"
        />

        <FaqSection faqs={[...faqs]} />

        <DownloadCta
          badges={jlensSiteConfig.storeBadges}
          description="Download JLens on iPhone, iPad, or Android and start with a clear photo"
          locale={jlensSiteConfig.defaultLocale}
          privacyHref={privacyHref}
          title="Identify the jewelry in front of you"
          waitlistDescription="Get an email when JLens is available in your region"
          waitlistTitle="Get JLens launch updates"
        />
      </main>
    </JlensSiteLayout>
  );
}

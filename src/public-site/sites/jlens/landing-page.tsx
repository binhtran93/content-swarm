import Image from "next/image";

import { AcquisitionActions } from "@/public-site/components/acquisition";
import {
  ContentShell,
  DownloadCta,
  FaqSection,
  FeatureShowcaseSection,
  PhoneFrame,
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
      "Open JLens and take a clear photo or choose one from your library. Start with the complete piece, then add a sharp close-up of any hallmark, clasp, engraving, or stone setting when you want more useful visible clues.",
  },
  {
    question: "What jewelry and gemstones can JLens identify?",
    answer:
      "JLens can analyze photos of rings, necklaces, bracelets, earrings, pendants, watches, loose gemstones, crystals, and minerals. Results describe likely matches based on what is visible in the submitted images.",
  },
  {
    question: "Can JLens confirm whether gold or a diamond is real?",
    answer:
      "No photo-based AI can certify metal purity or gemstone authenticity. JLens can explain visible marks and possible materials, but professional testing is needed when authenticity matters.",
  },
  {
    question: "Is an estimated value a professional appraisal?",
    answer:
      "No. JLens provides an informational estimated range based on visible characteristics and available context. Condition, provenance, laboratory testing, and market demand can materially change value, so use a qualified appraiser for insurance, sale, estate, or legal decisions.",
  },
  {
    question: "Can I save scans and track a jewelry collection?",
    answer:
      "Yes. You can save identified pieces, revisit their results, and use the collection view to organize your jewelry and review its combined estimated value.",
  },
  {
    question: "Is JLens available on iPhone and Android?",
    answer:
      "Yes. JLens is available through the Apple App Store for iPhone and iPad and through Google Play for supported Android devices.",
  },
] as const;

function JlensHero({ privacyHref }: { privacyHref: string }) {
  return (
    <section className={styles.hero} aria-labelledby="jlens-hero-title">
      <ContentShell className={styles.heroInner}>
        <div className={styles.heroCopy}>
          <p className={styles.heroEyebrow}>JLens · AI jewelry identifier</p>
          <h1 id="jlens-hero-title">Jewelry Identifier</h1>
          <p className={styles.heroTagline}>
            Identify jewelry from a photo with JLens.
          </p>
          <p className={styles.heroDescription}>
            Take or upload a photo to explore likely gemstones, metals,
            hallmarks, styles, and an estimated value range—then save the piece
            and ask follow-up questions.
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
          <div className={styles.phoneComposition}>
            <PhoneFrame>
              <div className={styles.scannerInterface}>
                <p>Center one piece in the frame</p>
                <div className={styles.scannerDock}>
                  <span className={styles.galleryControl} />
                  <span className={styles.scanControl} />
                  <span className={styles.historyControl} />
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
          </div>
        </div>
      </ContentShell>
    </section>
  );
}

function TrustStrip() {
  return (
    <section className={styles.trustStrip} aria-label="About JLens results">
      <ContentShell>
        <ul className={styles.trustList}>
          <li>
            <span>01</span>
            AI-assisted photo analysis
          </li>
          <li>
            <span>02</span>
            Available on iOS and Android
          </li>
          <li>
            <span>03</span>
            Informational estimates—not professional appraisal or authentication
          </li>
        </ul>
      </ContentShell>
    </section>
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
        <TrustStrip />

        <FeatureShowcaseSection
          className={styles.detailsSection}
          description="JLens turns visible clues into an organized result with likely item details, possible materials, hallmark observations, and an informational value estimate. Whether you need a ring identifier or broader AI jewelry appraisal context, the result is a starting point—not a professional opinion."
          eyebrow="AI jewelry identification"
          id="features"
          rows={[
            {
              number: "01",
              title: "Identify likely materials and gemstones",
              description:
                "Use the AI jewelry identifier and gemstone identifier to explore possible metals, stones, cuts, and settings visible in your photos.",
            },
            {
              number: "02",
              title: "Understand style, era, and hallmark clues",
              description:
                "Turn unfamiliar design details and readable marks into useful terms for further research with a photo-based hallmark scanner.",
            },
            {
              number: "03",
              title: "Explore an estimated value range",
              description:
                "Use the jewelry value estimator as a starting point, then consult a qualified professional when you need an appraisal or authentication.",
            },
          ]}
          screenshot="/jlens/details.png"
          screenshotAlt="JLens jewelry identification result showing an estimated value range, metal, gemstone, style, and summary"
          title="See what your jewelry might be."
          tone="muted"
        />

        <FeatureShowcaseSection
          className={styles.collectionSection}
          description="Use the jewelry inventory app to catalog your jewelry collection, revisit useful details, and track jewelry value estimates across saved pieces."
          eyebrow="Jewelry collection app"
          id="collection"
          rows={[
            {
              number: "01",
              title: "Build a visual jewelry inventory",
              description:
                "Catalog rings, necklaces, bracelets, watches, and gemstones in one personal jewelry collection app.",
            },
            {
              number: "02",
              title: "Track estimated collection value",
              description:
                "Review an at-a-glance total based on the informational ranges attached to saved pieces.",
            },
            {
              number: "03",
              title: "Return to every discovery",
              description:
                "Revisit photos, identification details, and value context without losing your research across screenshots and notes.",
            },
          ]}
          screenshot="/jlens/collection.png"
          screenshotAlt="JLens collection screen organizing jewelry with estimated values in a personal catalog"
          title="Keep every discovery in one collection."
          visualSide="end"
        />

        <FeatureShowcaseSection
          className={styles.chatSection}
          description="Continue the conversation for jewelry care advice, then prepare clearer hallmark questions and jewelry appraisal questions for a qualified professional."
          eyebrow="AI jewelry assistant"
          id="assistant"
          rows={[
            {
              number: "01",
              title: "Get jewelry care guidance",
              description:
                "Ask practical follow-up questions about cleaning, storage, and handling based on the piece you scanned.",
            },
            {
              number: "02",
              title: "Investigate marks and materials",
              description:
                "Use the AI jeweler conversation to understand visible clues and form better hallmark or appraisal questions.",
            },
            {
              number: "03",
              title: "Know when to consult a professional",
              description:
                "Get clear reminders when physical testing, certified appraisal, or expert authentication is the appropriate next step.",
            },
          ]}
          screenshot="/jlens/chat.png"
          screenshotAlt="JLens AI jewelry chat answering a follow-up question about safely cleaning a ring"
          title="Ask better questions about every piece."
          tone="muted"
        />

        <FaqSection faqs={[...faqs]} />

        <DownloadCta
          badges={jlensSiteConfig.storeBadges}
          description="Download JLens on iPhone, iPad, or Android and start with a clear photo."
          locale={jlensSiteConfig.defaultLocale}
          privacyHref={privacyHref}
          title="Identify the jewelry in front of you."
          waitlistDescription="Get an email when JLens is available in your region."
          waitlistTitle="Get JLens launch updates."
        />
      </main>
    </JlensSiteLayout>
  );
}

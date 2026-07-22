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
import { urgeZeroLandingDescription } from "@/public-site/sites/urge-zero/landing-metadata";
import { urgeZeroSiteConfig } from "@/public-site/sites/urge-zero/site-config";
import { UrgeZeroSiteLayout } from "@/public-site/sites/urge-zero/site-layout";

import styles from "./landing-page.module.css";

const appStoreUrl =
  "https://apps.apple.com/us/app/urgezero-quit-addiction/id6774419388";
const googlePlayUrl =
  "https://play.google.com/store/apps/details?id=com.anmisoft.urgezero";

const faqs = [
  {
    question: "What is UrgeZero?",
    answer:
      "UrgeZero is a self-improvement app for people who want practical help changing compulsive porn habits, bringing together an in-the-moment emergency mode, streak tracking, app protection, breathing, focus activities, Coach, and anonymous community posts",
  },
  {
    question: "What happens when I start Urge Emergency?",
    answer:
      "Urge Emergency brings your own reasons and promise back into view, gives you quick access to breathing and other activities, and can protect selected distracting apps during the active battle when your device permissions support it",
  },
  {
    question: "Can UrgeZero block distracting apps?",
    answer:
      "Yes, you can choose apps or supported activity categories to protect during a battle, although availability and setup differ between iPhone, iPad, and Android because each platform controls these permissions differently",
  },
  {
    question: "Is Coach a therapist or medical service?",
    answer:
      "No, Coach offers brief, AI-generated educational support for urges, habits, relationships, and recovery questions, but it is not therapy and cannot provide medical advice, diagnosis, treatment, or emergency help",
  },
  {
    question: "What happens if I relapse?",
    answer:
      "You can record the setback, reset your streak, and begin again because UrgeZero treats progress as something you keep practicing, not something one difficult day erases",
  },
  {
    question: "Where can I download UrgeZero?",
    answer:
      "UrgeZero is available for iPhone and iPad on the App Store and for supported Android devices on Google Play",
  },
] as const;

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

function UrgeZeroHero({ privacyHref }: { privacyHref: string }) {
  return (
    <ViewportHero
      className={styles.hero}
      innerClassName={styles.heroInner}
      labelledBy="urge-zero-hero-title"
    >
      <div className={styles.heroCopy}>
        <h1 id="urge-zero-hero-title">
          <span className={styles.heroHighlight}>Quit porn</span>, one urge at a
          time
        </h1>
        <p className={styles.heroDescription}>
          When a porn urge hits, UrgeZero gives you simple tools to pause,
          reset, and choose what happens next
        </p>
        <AcquisitionActions
          ariaLabel="Download UrgeZero"
          badges={urgeZeroSiteConfig.storeBadges}
          className={styles.heroActions}
          locale={urgeZeroSiteConfig.defaultLocale}
          privacyHref={privacyHref}
          source="hero"
        />
      </div>

      <div className={styles.heroVisual}>
        <Screenshot
          alt="UrgeZero emergency mode showing a personal reminder with quick access to activities, breathing, and relapse check-in"
          className={styles.heroPhone}
          priority
          sizes="(max-width: 700px) 78vw, (max-width: 1100px) 46vw, 430px"
          src="/urge-zero/emergency.png"
        />
      </div>
    </ViewportHero>
  );
}

function ProgressSection() {
  const features = [
    {
      number: "01",
      title: "Track your streak",
      description: "See your progress every time you open the app",
    },
    {
      number: "02",
      title: "Keep your reason close",
      description:
        "Save your reason for quitting and read it again when an urge hits",
    },
    {
      number: "03",
      title: "Block distractions",
      description: "Lock selected apps while you work through an urge",
    },
  ] as const;

  return (
    <FeatureShowcaseSection
      className={styles.progressSection}
      description="Track your streak, remember why you started, and block the apps that pull you back"
      eyebrow="Your progress"
      id="how-it-helps"
      rows={[...features]}
      screenshot="/urge-zero/home.png"
      screenshotAlt="UrgeZero home screen showing an 18-day streak and the Urge Emergency button"
      title="Keep going, one day at a time"
      visualSide="start"
    />
  );
}

function ToolsSection() {
  const features = [
    {
      number: "01",
      title: "Breathe",
      description:
        "Follow a steady breathing guide until the urge feels easier to handle",
    },
    {
      number: "02",
      title: "Shift your focus",
      description:
        "Play a short game, or read a fact, short story, or Bible verse",
    },
    {
      number: "03",
      title: "Ask Coach",
      description: "Ask what is on your mind and get a clear, practical answer",
    },
  ] as const;

  return (
    <FeatureShowcaseSection
      className={styles.toolsSection}
      description="Choose one simple activity to help you get through the next few minutes"
      eyebrow="When an urge hits"
      id="tools"
      rows={[...features]}
      title="Pause and do something else"
      visual={
        <div className={styles.toolPhones}>
          <Screenshot
            alt="UrgeZero Breath Sync screen guiding a steady breathing cycle"
            className={styles.toolPhoneBack}
            src="/urge-zero/breath.png"
          />
          <Screenshot
            alt="UrgeZero activity menu with Coach, Breath Sync, Bible verses, focus games, facts, and stories"
            className={styles.toolPhoneFront}
            src="/urge-zero/shift-mind.png"
          />
        </div>
      }
      visualSide="end"
    />
  );
}

function GamesSection() {
  const features = [
    {
      number: "01",
      title: "Match the pairs",
      description: "Flip the cards and remember where each matching pair is",
    },
    {
      number: "02",
      title: "Find the matching symbol",
      description: "Spot the symbol that matches the one shown",
    },
    {
      number: "03",
      title: "Follow the color",
      description: "Tap the color named on screen before time runs out",
    },
  ] as const;

  return (
    <FeatureShowcaseSection
      className={styles.gamesSection}
      description="Pick a quick game when you need to move your attention away from an urge"
      eyebrow="Focus games"
      rows={[...features]}
      title="Give your mind something else to do"
      visual={
        <div className={styles.gamePhones}>
          <Screenshot
            alt="UrgeZero Memory Match focus game with pairs of symbols"
            className={styles.gamePhoneLeft}
            src="/urge-zero/game-1.png"
          />
          <Screenshot
            alt="UrgeZero Find Object focus game asking the player to identify a matching icon"
            className={styles.gamePhoneRight}
            src="/urge-zero/game-2.png"
          />
        </div>
      }
      visualSide="start"
    />
  );
}

function SupportSection() {
  const features = [
    {
      number: "01",
      title: "Ask Coach",
      description: "Ask a direct question and get a short, practical answer",
    },
    {
      number: "02",
      title: "Read the Wall",
      description:
        "See anonymous posts about wins, setbacks, and starting again",
    },
    {
      number: "03",
      title: "Share your progress",
      description: "Post what happened without using your name",
    },
  ] as const;

  return (
    <FeatureShowcaseSection
      className={styles.supportSection}
      description="Ask Coach when you need a clear next step, or read honest posts from people working through the same habit"
      eyebrow="Support without pressure"
      rows={[...features]}
      title="You do not have to do this alone"
      visual={
        <div className={styles.supportPhones}>
          <Screenshot
            alt="UrgeZero Coach answering a question about how porn can affect relationships"
            className={styles.supportPhoneBack}
            src="/urge-zero/chat.png"
          />
          <Screenshot
            alt="UrgeZero Wall of Strength showing anonymous community posts and streaks"
            className={styles.supportPhoneFront}
            src="/urge-zero/social.png"
          />
        </div>
      }
      visualSide="end"
    />
  );
}

export function UrgeZeroLandingPage() {
  const privacyHref = withPublicRoute(
    urgeZeroSiteConfig,
    urgeZeroSiteConfig.defaultLocale,
    "/privacy",
  );
  const canonical = getCanonicalUrl(
    urgeZeroSiteConfig,
    urgeZeroSiteConfig.defaultLocale,
    "/",
  );
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${canonical}#website`,
        name: urgeZeroSiteConfig.brand.name,
        url: canonical,
        description: urgeZeroLandingDescription,
        inLanguage: "en-US",
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${canonical}#app`,
        name: urgeZeroSiteConfig.brand.name,
        applicationCategory: "HealthApplication",
        operatingSystem: ["iOS", "iPadOS", "Android"],
        url: canonical,
        image: `${urgeZeroSiteConfig.canonicalOrigin}/og.png`,
        description: urgeZeroLandingDescription,
        downloadUrl: [appStoreUrl, googlePlayUrl],
        sameAs: [appStoreUrl, googlePlayUrl],
      },
      {
        "@type": "FAQPage",
        "@id": `${canonical}#faq`,
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
    ],
  };

  return (
    <UrgeZeroSiteLayout activeNavigationHref="/">
      <main>
        <script
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replaceAll("<", "\\u003c"),
          }}
          type="application/ld+json"
        />

        <UrgeZeroHero privacyHref={privacyHref} />
        <ProgressSection />
        <ToolsSection />
        <GamesSection />
        <SupportSection />
        <FaqSection faqs={[...faqs]} />
        <DownloadCta
          badges={urgeZeroSiteConfig.storeBadges}
          description="Download UrgeZero for iPhone, iPad, or Android and put a plan within reach before the next difficult moment"
          locale={urgeZeroSiteConfig.defaultLocale}
          privacyHref={privacyHref}
          title="Be ready for the next urge"
          waitlistDescription="Get an email when UrgeZero is available"
          waitlistTitle="Get UrgeZero launch updates"
        />
      </main>
    </UrgeZeroSiteLayout>
  );
}

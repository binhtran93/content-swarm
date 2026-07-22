import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/font/google", () => ({
  Bebas_Neue: () => ({ variable: "font-urge-zero-display" }),
  Inter: () => ({ variable: "font-urge-zero-body" }),
}));
const mocks = vi.hoisted(() => ({
  listPublicArticles: vi.fn(),
}));
vi.mock("@/features/articles/public/list-public-articles.server", () => ({
  listPublicArticles: mocks.listPublicArticles,
}));

import sitemap from "@/app/(public)/urge-zero/sitemap";
import { AcquisitionProvider } from "@/public-site/components/acquisition";
import { createUrgeZeroLandingMetadata } from "@/public-site/sites/urge-zero/landing-metadata";
import { UrgeZeroLandingPage } from "@/public-site/sites/urge-zero/landing-page";
import { urgeZeroSiteConfig } from "@/public-site/sites/urge-zero/site-config";

const appStoreUrl =
  "https://apps.apple.com/us/app/urgezero-quit-addiction/id6774419388";
const googlePlayUrl =
  "https://play.google.com/store/apps/details?id=com.anmisoft.urgezero";

function renderLanding() {
  return render(
    <AcquisitionProvider
      acquisition={{ mode: "stores", appStoreUrl, googlePlayUrl }}
      brandName="UrgeZero"
      defaultLocale="en-US"
      presentations={{
        "en-US": {
          waitlist: urgeZeroSiteConfig.waitlist,
          availability: "UrgeZero app availability",
          submitting: "Joining…",
          done: "Done",
          close: "Close",
          notConfigured: "Unavailable",
          genericError: "Try again",
          consent: "Consent",
          privacyPolicy: "Privacy Policy",
        },
      }}
      projectId="urge-zero"
      scopeClassName="urge-zero-site"
      siteKey=""
    >
      <UrgeZeroLandingPage />
    </AcquisitionProvider>,
  );
}

afterEach(() => {
  delete process.env.PUBLIC_PROJECT_ID;
  delete process.env.PUBLIC_ROUTE_MODE;
});

beforeEach(() => {
  mocks.listPublicArticles.mockResolvedValue([]);
});

describe("UrgeZero landing page", () => {
  it("renders the complete, natural landing story and both stores", () => {
    const { container } = renderLanding();

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Quit porn, one urge at a time",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/simple tools to pause, reset/i),
    ).toBeInTheDocument();

    for (const heading of [
      "Keep going, one day at a time",
      "Pause and do something else",
      "Give your mind something else to do",
      "You do not have to do this alone",
    ]) {
      expect(
        screen.getByRole("heading", { name: heading }),
      ).toBeInTheDocument();
    }

    for (const number of ["01", "02", "03"]) {
      expect(screen.getAllByText(number)).toHaveLength(4);
    }

    const screenshotAlts = [
      /emergency mode showing a personal reminder/i,
      /home screen showing an 18-day streak/i,
      /Breath Sync screen guiding/i,
      /activity menu with Coach/i,
      /Memory Match focus game/i,
      /Find Object focus game/i,
      /Coach answering a question/i,
      /Wall of Strength showing anonymous/i,
    ];
    for (const alt of screenshotAlts) {
      expect(screen.getAllByAltText(alt)).toHaveLength(1);
    }

    expect(container.querySelectorAll("details")).toHaveLength(6);
    expect(
      screen.getAllByRole("link", {
        name: "Download UrgeZero on the App Store",
      })[0],
    ).toHaveAttribute("href", appStoreUrl);
    expect(
      screen.getAllByRole("link", { name: "Get UrgeZero on Google Play" })[0],
    ).toHaveAttribute("href", googlePlayUrl);
    expect(screen.getByRole("link", { name: "Blog" })).toHaveAttribute(
      "href",
      "/urge-zero/blog",
    );
    expect(screen.queryByText("Remember your reason")).not.toBeInTheDocument();
    expect(screen.queryByText("Choose the next step")).not.toBeInTheDocument();
    expect(
      screen.queryByText("Available on iOS and Android"),
    ).not.toBeInTheDocument();

    const jsonLd = container.querySelector(
      'script[type="application/ld+json"]',
    )?.textContent;
    expect(jsonLd).toContain("WebSite");
    expect(jsonLd).toContain("SoftwareApplication");
    expect(jsonLd).toContain("FAQPage");
    expect(jsonLd).toContain("iPadOS");
    expect(jsonLd).toContain(appStoreUrl);
    expect(jsonLd).toContain(googlePlayUrl);
  });

  it("publishes exact metadata and the canonical sitemap routes", async () => {
    const metadata = createUrgeZeroLandingMetadata();
    expect(metadata.title).toBe(
      "Quit Porn & Handle Urges in the Moment | UrgeZero",
    );
    expect(metadata.description).toBe(
      "UrgeZero gives you practical tools to handle porn urges, track streaks, block distractions, reset with breathing and focus games, and find support.",
    );
    expect(metadata.alternates?.canonical).toBe("https://urgezero.com/");
    expect(metadata.openGraph).toMatchObject({
      url: "https://urgezero.com/",
      images: [
        expect.objectContaining({
          url: "https://urgezero.com/og.png",
          width: 1200,
          height: 630,
        }),
      ],
    });
    expect(metadata.twitter).toMatchObject({ card: "summary_large_image" });
    expect((await sitemap()).map((entry) => entry.url)).toEqual([
      "https://urgezero.com/",
      "https://urgezero.com/blog",
      "https://urgezero.com/support",
      "https://urgezero.com/privacy",
      "https://urgezero.com/terms",
    ]);
    expect(mocks.listPublicArticles).toHaveBeenCalledWith("urge-zero", "en-US");
  });

  it("adds published UrgeZero articles when Firestore has them", async () => {
    const updatedAt = new Date("2026-07-22T00:00:00.000Z");
    mocks.listPublicArticles.mockResolvedValue([
      { slug: "how-to-ride-out-an-urge", updatedAt },
    ]);

    expect(await sitemap()).toContainEqual({
      url: "https://urgezero.com/blog/how-to-ride-out-an-urge",
      lastModified: updatedAt,
      changeFrequency: "weekly",
      priority: 0.8,
    });
  });
});

import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("next/font/google", () => ({
  Bodoni_Moda: () => ({ variable: "font-jlens-display" }),
}));
vi.mock("@/features/articles/public/list-public-articles.server", () => ({
  listPublicArticles: vi.fn().mockResolvedValue([]),
}));

import { AcquisitionProvider } from "@/public-site/components/acquisition";
import { createJlensLandingMetadata } from "@/public-site/sites/jlens/landing-metadata";
import { JlensLandingPage } from "@/public-site/sites/jlens/landing-page";
import sitemap from "@/app/(public)/jlens/sitemap";

const appStoreUrl =
  "https://apps.apple.com/us/app/jlens-jewelry-identifier/id6762078738";
const googlePlayUrl =
  "https://play.google.com/store/apps/details?id=com.tdbinh93.jewelryidentifier";

function renderLanding() {
  return render(
    <AcquisitionProvider
      acquisition={{ mode: "stores", appStoreUrl, googlePlayUrl }}
      brandName="JLens"
      defaultLocale="en-US"
      presentations={{
        "en-US": {
          waitlist: {
            ctaLabel: "Join waitlist",
            title: "Join the JLens waitlist",
            description: "Get an email when JLens is available",
            emailLabel: "Email address",
            emailPlaceholder: "you@example.com",
            submitLabel: "Join waitlist",
            successTitle: "You’re on the list",
            successDescription: "We’ll let you know when JLens launches",
          },
          availability: "JLens app availability",
          submitting: "Joining…",
          done: "Done",
          close: "Close",
          notConfigured: "Unavailable",
          genericError: "Try again",
          consent: "Consent",
          privacyPolicy: "Privacy Policy",
        },
      }}
      projectId="jlens"
      scopeClassName="jlens-site"
      siteKey=""
    >
      <JlensLandingPage />
    </AcquisitionProvider>,
  );
}

afterEach(() => {
  delete process.env.PUBLIC_PROJECT_ID;
  delete process.env.PUBLIC_ROUTE_MODE;
});

describe("JLens landing page", () => {
  it("renders the conversion story, SEO images, and store destinations", () => {
    const { container } = renderLanding();

    expect(
      screen.getByRole("heading", { level: 1, name: "Jewelry Identifier" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: "A closer look, in seconds",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: "Help every piece look its best",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByAltText(
        "Split before-and-after photo of a gold ring showing visible condition differences",
      ),
    ).toHaveAttribute(
      "src",
      expect.stringContaining("compare%2Fbefore-after.png"),
    );
    expect(
      screen.getByText("Wipe with a soft, dry microfiber cloth"),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /before|after/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: "Your jewelry, all in one place",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: "Curious about a piece? Ask away",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByAltText(
        "JLens jewelry identification result showing an estimated value range, metal, gemstone, style, and summary",
      ),
    ).toHaveAttribute("src", expect.stringContaining("details.png"));
    expect(
      screen.getByAltText(
        "JLens collection screen organizing jewelry with estimated values in a personal catalog",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByAltText(
        "JLens AI jewelry chat answering a follow-up question about safely cleaning a ring",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole("link", {
        name: "Download JLens on the App Store",
      })[0],
    ).toHaveAttribute("href", appStoreUrl);
    expect(
      screen.getAllByRole("link", { name: "Get JLens on Google Play" })[0],
    ).toHaveAttribute("href", googlePlayUrl);
    expect(
      screen.queryByRole("button", { name: "Change language" }),
    ).not.toBeInTheDocument();
    expect(
      container.querySelector('script[type="application/ld+json"]')
        ?.textContent,
    ).toContain("SoftwareApplication");
  });

  it("publishes canonical social metadata and includes the blog in its sitemap", async () => {
    const metadata = createJlensLandingMetadata();
    expect(metadata.title).toBe(
      "AI Jewelry Identifier & Value Estimator | JLens",
    );
    expect(metadata.alternates?.canonical).toBe("https://jlensapp.com/");
    expect(metadata.twitter).toMatchObject({ card: "summary_large_image" });
    expect((await sitemap()).map((entry) => entry.url)).toEqual([
      "https://jlensapp.com/",
      "https://jlensapp.com/blog",
      "https://jlensapp.com/support",
      "https://jlensapp.com/privacy",
      "https://jlensapp.com/terms",
    ]);
  });
});

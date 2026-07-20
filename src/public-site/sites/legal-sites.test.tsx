import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  getLegalSiteIcons,
  LegalSiteShell,
} from "@/public-site/components/site";
import JewelryIdentifierPrivacyPage, {
  metadata as jewelryPrivacyMetadata,
} from "@/public-site/sites/jlens/privacy-page";
import { jlensSiteConfig } from "@/public-site/sites/jlens/site-config";
import JewelryIdentifierSupportPage from "@/public-site/sites/jlens/support-page";
import { skylensSiteConfig } from "@/public-site/sites/skylens/site-config";
import SkylensSupportPage from "@/public-site/sites/skylens/support-page";
import { metadata as skylensTermsMetadata } from "@/public-site/sites/skylens/terms-page";
import { urgeZeroSiteConfig } from "@/public-site/sites/urge-zero/site-config";
import UrgeZeroPrivacyPage from "@/public-site/sites/urge-zero/privacy-page";
import UrgeZeroSupportPage from "@/public-site/sites/urge-zero/support-page";

const configs = [
  jlensSiteConfig,
  skylensSiteConfig,
  urgeZeroSiteConfig,
] as const;

describe("legal-only public sites", () => {
  it.each(configs)("builds scoped navigation and icons for $name", (config) => {
    const { container } = render(
      <LegalSiteShell config={config}>
        <main>Content</main>
      </LegalSiteShell>,
    );

    expect(container.firstElementChild).toHaveClass(config.scopeClassName);
    expect(screen.getAllByText(config.name)).toHaveLength(2);
    expect(screen.getAllByRole("link", { name: "Support" })[0]).toHaveAttribute(
      "href",
      `${config.basePath}/support`,
    );
    expect(screen.getAllByRole("link", { name: "Privacy" })[0]).toHaveAttribute(
      "href",
      `${config.basePath}/privacy`,
    );
    expect(screen.getAllByRole("link", { name: "Terms" })[0]).toHaveAttribute(
      "href",
      `${config.basePath}/terms`,
    );
    expect(getLegalSiteIcons(config)).toMatchObject({
      icon: [{ url: `${config.basePath}/favicon.png` }],
      shortcut: `${config.basePath}/favicon.png`,
    });
  });

  it("preserves Jewelry Identifier legal copy while branding the shell as JLens", () => {
    render(
      <LegalSiteShell config={jlensSiteConfig}>
        <JewelryIdentifierPrivacyPage />
      </LegalSiteShell>,
    );

    expect(screen.getAllByText("JLens")).toHaveLength(2);
    expect(screen.getByText("Effective Date: 02.07.2026")).toBeInTheDocument();
    expect(jewelryPrivacyMetadata.title).toBe("Privacy Policy | JLens");
    expect(jewelryPrivacyMetadata.description).toBe(
      "Privacy policy for the JLens app.",
    );
  });

  it("keeps each app's support address and app-specific guidance", () => {
    const jewelry = render(<JewelryIdentifierSupportPage />);
    expect(screen.getAllByText("support@anmisoft.com").length).toBeGreaterThan(
      0,
    );
    expect(
      screen.getByText("How do I identify a jewelry piece in the app?"),
    ).toBeInTheDocument();
    jewelry.unmount();

    const skylens = render(<SkylensSupportPage />);
    expect(screen.getAllByText("support@anmisoft.com").length).toBeGreaterThan(
      0,
    );
    expect(
      screen.getByText("How do I analyze a photo with SkyLens?"),
    ).toBeInTheDocument();
    expect(skylensTermsMetadata.title).toBe("Terms and Conditions | SkyLens");
    skylens.unmount();

    render(<UrgeZeroSupportPage />);
    expect(screen.getAllByText("support@anmisoft.com").length).toBeGreaterThan(
      0,
    );
    expect(
      screen.getByText("How do I handle a strong urge right now?"),
    ).toBeInTheDocument();
  });

  it("preserves the Urge Zero privacy effective date", () => {
    render(<UrgeZeroPrivacyPage />);
    expect(screen.getByText("Effective Date: 10.02.2026")).toBeInTheDocument();
  });
});

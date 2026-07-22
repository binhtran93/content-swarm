import { cleanup, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  getLegalSiteIcons,
  LegalSiteShell,
} from "@/public-site/components/site";
import JewelryIdentifierPrivacyPage, {
  metadata as jewelryPrivacyMetadata,
} from "@/public-site/sites/jlens/privacy-page";
import JewelryIdentifierSupportPage from "@/public-site/sites/jlens/support-page";
import { skylensSiteConfig } from "@/public-site/sites/skylens/site-config";
import SkylensSupportPage from "@/public-site/sites/skylens/support-page";
import { metadata as skylensTermsMetadata } from "@/public-site/sites/skylens/terms-page";
import UrgeZeroPrivacyPage, {
  metadata as urgeZeroPrivacyMetadata,
} from "@/public-site/sites/urge-zero/privacy-page";
import UrgeZeroSupportPage, {
  metadata as urgeZeroSupportMetadata,
} from "@/public-site/sites/urge-zero/support-page";
import UrgeZeroTermsPage, {
  metadata as urgeZeroTermsMetadata,
} from "@/public-site/sites/urge-zero/terms-page";

const configs = [skylensSiteConfig] as const;

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
    const { container } = render(<JewelryIdentifierPrivacyPage />);

    expect(container.querySelector("main")).toHaveClass("legal-document");
    expect(container.querySelector("article")).toHaveClass(
      "legal-document__article",
    );
    expect(screen.getByText("Effective Date: 02.07.2026")).toBeInTheDocument();
    expect(jewelryPrivacyMetadata.title).toBe("Privacy Policy | JLens");
    expect(jewelryPrivacyMetadata.description).toBe(
      "Privacy policy for the JLens jewelry identifier app.",
    );
  });

  it("uses the common support experience for every legal-only app", () => {
    const jewelry = render(<JewelryIdentifierSupportPage />);
    expect(screen.getAllByText("support@anmisoft.com").length).toBeGreaterThan(
      0,
    );
    expect(screen.getByText("Report an Issue")).toBeInTheDocument();
    expect(
      screen.getByText("JLens version", { exact: false }),
    ).toBeInTheDocument();
    jewelry.unmount();

    const skylens = render(<SkylensSupportPage />);
    expect(screen.getAllByText("support@anmisoft.com").length).toBeGreaterThan(
      0,
    );
    expect(
      screen.getByText("SkyLens version", { exact: false }),
    ).toBeInTheDocument();
    expect(skylensTermsMetadata.title).toBe("Terms and Conditions | SkyLens");
    skylens.unmount();

    render(<UrgeZeroSupportPage />);
    expect(screen.getAllByText("support@anmisoft.com").length).toBeGreaterThan(
      0,
    );
    expect(
      screen.getByText("UrgeZero version", { exact: false }),
    ).toBeInTheDocument();
  });

  it("publishes source-backed UrgeZero privacy and terms without stale claims", () => {
    render(<UrgeZeroPrivacyPage />);
    expect(screen.getByText("Last updated: 22 July 2026")).toBeInTheDocument();
    expect(screen.getByText("Camera and app protection")).toBeInTheDocument();
    expect(
      screen.getByText("Website analytics and cookies"),
    ).toBeInTheDocument();
    expect(screen.queryByText(/AdMob/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/photo library/i)).not.toBeInTheDocument();

    cleanup();
    render(<UrgeZeroTermsPage />);
    expect(
      screen.getByText("Self-improvement, not treatment"),
    ).toBeInTheDocument();
    expect(screen.getByText("Coach and generated content")).toBeInTheDocument();
    expect(screen.queryByText(/Your Jurisdiction/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/AdMob/i)).not.toBeInTheDocument();
    expect(urgeZeroSupportMetadata.alternates?.canonical).toBe(
      "https://urgezero.com/support",
    );
    expect(urgeZeroPrivacyMetadata.alternates?.canonical).toBe(
      "https://urgezero.com/privacy",
    );
    expect(urgeZeroTermsMetadata.alternates?.canonical).toBe(
      "https://urgezero.com/terms",
    );
  });
});

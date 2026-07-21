import { describe, expect, it } from "vitest";

import { defaultLocale } from "@/config/supported-locales";

import {
  createDefaultWaitlistPresentation,
  definePublicSiteConfig,
  type PublicSiteConfigInput,
} from "./site-config";

function siteConfigInput(
  waitlist?: PublicSiteConfigInput["waitlist"],
): PublicSiteConfigInput {
  return {
    id: "example",
    internalBasePath: "/example",
    canonicalOrigin: "https://example.com",
    defaultLocale,
    locales: [defaultLocale],
    scopeClassName: "example-site",
    theme: { routeProgressColor: "#123456" },
    brand: {
      name: "Example",
      wordmarkLead: "Example",
      logoSrc: "/example/logo.png",
      logoAlt: "Example",
    },
    navigation: [],
    headerCta: { kind: "link", label: "Download", href: "/#download" },
    waitlist,
    footer: { links: [], copyright: "Example" },
    storeBadges: [],
  };
}

describe("public site configuration", () => {
  it("provides complete brand-aware waitlist defaults", () => {
    const config = definePublicSiteConfig(siteConfigInput());

    expect(config.waitlist).toEqual(
      createDefaultWaitlistPresentation("Example"),
    );
    expect(config.waitlist.title).toBe("Join the Example waitlist");
    expect(config.waitlist.successDescription).toBe(
      "We’ll let you know when Example launches",
    );
  });

  it("merges partial site overrides without dropping defaults", () => {
    const config = definePublicSiteConfig(
      siteConfigInput({ ctaLabel: "Get early access" }),
    );

    expect(config.waitlist.ctaLabel).toBe("Get early access");
    expect(config.waitlist.emailLabel).toBe("Email address");
    expect(config.waitlist.title).toBe("Join the Example waitlist");
  });

  it("rejects an invalid Google Analytics measurement ID", () => {
    const input = siteConfigInput();
    input.analyticsMeasurementId = "UA-OLD-ANALYTICS";

    expect(() => definePublicSiteConfig(input)).toThrow(
      "Invalid Google Analytics measurement ID",
    );
  });
});

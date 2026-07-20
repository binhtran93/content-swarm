import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@next/third-parties/google", () => ({
  GoogleAnalytics: ({ gaId }: { gaId: string }) => (
    <span data-testid="google-analytics" data-measurement-id={gaId} />
  ),
}));

import { isCanonicalAnalyticsHostname, SiteAnalytics } from "./site-analytics";

describe("SiteAnalytics", () => {
  it("loads Google Analytics on the canonical hostname", async () => {
    render(
      <SiteAnalytics
        enabled
        canonicalOrigin="http://localhost"
        measurementId="G-SUBIQ"
      />,
    );

    await waitFor(() => {
      expect(screen.getByTestId("google-analytics")).toHaveAttribute(
        "data-measurement-id",
        "G-SUBIQ",
      );
    });
  });

  it("does not load on a different hostname", () => {
    render(
      <SiteAnalytics
        enabled
        canonicalOrigin="https://getsubiq.com"
        measurementId="G-SUBIQ"
      />,
    );

    expect(screen.queryByTestId("google-analytics")).not.toBeInTheDocument();
  });

  it("does not load when the deployment gate is disabled", () => {
    render(
      <SiteAnalytics
        enabled={false}
        canonicalOrigin="http://localhost"
        measurementId="G-SUBIQ"
      />,
    );

    expect(screen.queryByTestId("google-analytics")).not.toBeInTheDocument();
  });

  it("does not load when the site has no measurement ID", () => {
    render(<SiteAnalytics enabled canonicalOrigin="http://localhost" />);

    expect(screen.queryByTestId("google-analytics")).not.toBeInTheDocument();
  });
});

describe("isCanonicalAnalyticsHostname", () => {
  it("compares hostnames case-insensitively", () => {
    expect(
      isCanonicalAnalyticsHostname("https://GETSUBIQ.com", "getsubiq.com"),
    ).toBe(true);
  });

  it("fails closed for an invalid canonical origin", () => {
    expect(isCanonicalAnalyticsHostname("not a URL", "getsubiq.com")).toBe(
      false,
    );
  });
});

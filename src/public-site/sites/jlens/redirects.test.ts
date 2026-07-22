import { afterEach, describe, expect, it } from "vitest";

import nextConfig from "../../../../next.config";

afterEach(() => {
  delete process.env.PUBLIC_PROJECT_ID;
  delete process.env.PUBLIC_ROUTE_MODE;
});

describe("public-site redirects", () => {
  it("keeps full public Project routes local", async () => {
    const redirects = await nextConfig.redirects?.();
    expect(redirects).toEqual(
      expect.arrayContaining([
        {
          source: "/jewelry-identifier",
          destination: "https://jlensapp.com/",
          permanent: true,
        },
        {
          source: "/jewelry-identifier/support",
          destination: "https://jlensapp.com/support",
          permanent: true,
        },
        {
          source: "/jewelry-identifier/terms",
          destination: "https://jlensapp.com/terms",
          permanent: true,
        },
      ]),
    );
    expect(redirects).toHaveLength(4);
    expect(redirects).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({ source: "/urge-zero" }),
        expect.objectContaining({ source: "/urge-zero/support" }),
      ]),
    );
    expect(redirects).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({ source: "/jlens" }),
        expect.objectContaining({ source: "/jlens/support" }),
        expect.objectContaining({ source: "/jlens/privacy" }),
        expect.objectContaining({ source: "/jlens/terms" }),
      ]),
    );
  });

  it("does not require per-page rewrite configuration", () => {
    expect(nextConfig.rewrites).toBeUndefined();
  });
});

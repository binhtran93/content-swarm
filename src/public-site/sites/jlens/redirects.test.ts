import { describe, expect, it } from "vitest";

import nextConfig from "../../../../next.config";

describe("JLens legacy redirects", () => {
  it("permanently redirects only the three former legal routes", async () => {
    await expect(nextConfig.redirects?.()).resolves.toEqual([
      {
        source: "/jewelry-identifier/privacy",
        destination: "/jlens/privacy",
        permanent: true,
      },
      {
        source: "/jewelry-identifier/terms",
        destination: "/jlens/terms",
        permanent: true,
      },
      {
        source: "/jewelry-identifier/support",
        destination: "/jlens/support",
        permanent: true,
      },
    ]);
  });
});

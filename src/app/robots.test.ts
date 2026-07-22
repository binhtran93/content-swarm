import { afterEach, describe, expect, it } from "vitest";

import robots from "./robots";

afterEach(() => {
  delete process.env.PUBLIC_PROJECT_ID;
  delete process.env.PUBLIC_ROUTE_MODE;
});

describe("robots metadata", () => {
  it("publishes the SubIQ sitemap on its dedicated deployment", () => {
    process.env.PUBLIC_ROUTE_MODE = "root";
    process.env.PUBLIC_PROJECT_ID = "subiq";

    expect(robots()).toMatchObject({
      sitemap: "https://getsubiq.com/sitemap.xml",
    });
  });

  it("publishes the JLens sitemap on its dedicated deployment", () => {
    process.env.PUBLIC_ROUTE_MODE = "root";
    process.env.PUBLIC_PROJECT_ID = "jlens";

    expect(robots()).toMatchObject({
      sitemap: "https://jlensapp.com/sitemap.xml",
    });
  });

  it("publishes the UrgeZero sitemap on its dedicated deployment", () => {
    process.env.PUBLIC_ROUTE_MODE = "root";
    process.env.PUBLIC_PROJECT_ID = "urge-zero";

    expect(robots()).toMatchObject({
      sitemap: "https://urgezero.com/sitemap.xml",
    });
  });

  it("does not publish the SubIQ sitemap on the main deployment", () => {
    process.env.PUBLIC_ROUTE_MODE = "project";

    expect(robots()).not.toHaveProperty("sitemap");
  });
});

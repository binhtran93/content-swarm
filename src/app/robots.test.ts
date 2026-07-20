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

  it("does not publish the SubIQ sitemap on the main deployment", () => {
    process.env.PUBLIC_ROUTE_MODE = "project";

    expect(robots()).not.toHaveProperty("sitemap");
  });
});

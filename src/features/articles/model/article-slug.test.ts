import { describe, expect, it } from "vitest";

import { slugifyArticleTitle } from "@/features/articles/model/article-slug";

describe("slugifyArticleTitle", () => {
  it("creates a URL-safe slug from an article title", () => {
    expect(
      slugifyArticleTitle(
        "How to End a Planet Fitness Membership: Step-by-Step Guide",
      ),
    ).toBe("how-to-end-a-planet-fitness-membership-step-by-step-guide");
  });

  it("normalizes punctuation and accented Latin characters", () => {
    expect(slugifyArticleTitle("Café Owner’s Guide")).toBe("cafe-owners-guide");
  });
});

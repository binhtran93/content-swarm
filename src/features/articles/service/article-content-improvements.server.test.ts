import { beforeEach, describe, expect, it, vi } from "vitest";

import { applyArticleContentChanges } from "@/features/articles/service/apply-article-content-changes.server";
import { reviewArticleContent } from "@/features/articles/service/review-article-content.server";

const mocks = vi.hoisted(() => ({
  generateArticleAi: vi.fn(),
  getArticleGenerationContext: vi.fn(),
}));

vi.mock("@/features/articles/provider/generate-article-ai.server", () => ({
  generateArticleAi: mocks.generateArticleAi,
}));
vi.mock(
  "@/features/articles/service/get-article-generation-context.server",
  () => ({
    getArticleGenerationContext: mocks.getArticleGenerationContext,
  }),
);

describe("article content improvement services", () => {
  beforeEach(() => {
    mocks.generateArticleAi.mockReset();
    mocks.getArticleGenerationContext.mockReset();
    mocks.getArticleGenerationContext.mockResolvedValue({
      article: { locale: "en-US", plan: "## Plan", title: "Article" },
      project: { name: "SubIQ", description: "" },
      primaryKeyword: "primary keyword",
      supportingKeywords: ["supporting keyword"],
    });
  });

  it("reviews the current unsaved content and keeps grounding enabled", async () => {
    mocks.generateArticleAi.mockResolvedValue({
      output: {
        changes: [
          {
            before: "Formal original.",
            after: "Natural replacement.",
          },
        ],
      },
      references: [{ title: "Source", url: "https://example.com/" }],
    });

    await reviewArticleContent(
      "project",
      "article",
      "## Current draft\n\nFormal original.",
    );

    const [, user, options] = mocks.generateArticleAi.mock.calls[0]!;

    expect(JSON.parse(user).currentContent).toContain("Current draft");
    expect(options).not.toHaveProperty("searchGrounding");
  });

  it("rejects malformed review passages", async () => {
    mocks.generateArticleAi.mockResolvedValue({
      output: {
        changes: [{ before: "Missing passage.", after: "Replacement." }],
      },
      references: [],
    });

    await expect(
      reviewArticleContent("project", "article", "## Current draft"),
    ).rejects.toThrow("no longer exists");
  });

  it("applies only approved changes without search grounding", async () => {
    mocks.generateArticleAi.mockResolvedValue({
      output: "## Current draft\n\nNatural replacement.",
      references: [],
    });

    await applyArticleContentChanges(
      "project",
      "article",
      "## Current draft\n\nFormal original.",
      [{ before: "Formal original.", after: "Natural replacement." }],
    );

    const [, user, options] = mocks.generateArticleAi.mock.calls[0]!;

    expect(JSON.parse(user).approvedChanges).toEqual([
      { before: "Formal original.", after: "Natural replacement." },
    ]);
    expect(options).toEqual({ searchGrounding: false });
  });

  it("rejects invalid MDX returned by the apply step", async () => {
    mocks.generateArticleAi.mockResolvedValue({
      output: "# Invalid H1",
      references: [],
    });

    await expect(
      applyArticleContentChanges(
        "project",
        "article",
        "## Current draft\n\nFormal original.",
        [{ before: "Formal original.", after: "Natural replacement." }],
      ),
    ).rejects.toThrow("invalid MDX");
  });
});

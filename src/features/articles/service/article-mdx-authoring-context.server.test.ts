import { beforeEach, describe, expect, it, vi } from "vitest";

import { generateArticleContent } from "@/features/articles/service/generate-article-content.server";
import { generateTranslation } from "@/features/articles/service/generate-translation.server";

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

describe("article MDX authoring context", () => {
  beforeEach(() => {
    mocks.generateArticleAi.mockReset();
    mocks.getArticleGenerationContext.mockReset();
  });

  it("supplies the static component contract during content generation", async () => {
    mocks.getArticleGenerationContext.mockResolvedValue({
      article: {
        locale: "en-US",
        plan: "## Plan",
        title: "Primary keyword",
      },
      market: "United States",
      project: { name: "Example", description: "" },
      primaryKeyword: "primary keyword",
      supportingKeywords: [],
    });
    mocks.generateArticleAi.mockResolvedValue({
      output: {
        title: "Primary keyword buying guide",
        content: "## Useful section\n\nUseful content.",
      },
      references: [],
    });

    await generateArticleContent("project", "article");

    const [, user] = mocks.generateArticleAi.mock.calls[0]!;
    const input = JSON.parse(user);
    expect(input.componentAuthoringGuide).toContain(
      '<Tab title="First option">',
    );
    expect(input.componentAuthoringGuide).toContain("Never use Nextra items");
  });

  it("supplies the same static component contract during translation", async () => {
    mocks.getArticleGenerationContext.mockResolvedValue({
      article: {
        content: "## Source\n\nSource content.",
        excerpt: "Source excerpt.",
        locale: "en-US",
        seoDescription: "Source SEO description.",
        seoTitle: "Source SEO title",
        title: "Source title",
      },
      project: { name: "Example", description: "" },
    });
    mocks.generateArticleAi.mockResolvedValue({
      output: {
        content: "## Bản dịch\n\nNội dung.",
        excerpt: "Tóm tắt.",
        seoDescription: "Mô tả SEO.",
        seoTitle: "Tiêu đề SEO",
        slug: "ban-dich",
        title: "Bản dịch",
      },
      references: [],
    });

    await generateTranslation("project", "article", "vi-VN");

    const [, user] = mocks.generateArticleAi.mock.calls[0]!;
    const input = JSON.parse(user);
    expect(input.componentAuthoringGuide).toContain(
      '<Tab title="First option">',
    );
    expect(input.componentAuthoringGuide).toContain("Never use Nextra items");
  });
});

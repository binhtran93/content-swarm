import { beforeEach, describe, expect, it, vi } from "vitest";

import { getPublicTranslation } from "@/features/articles/public/get-public-translation.server";
import { listPublicArticlePage } from "@/features/articles/public/list-public-article-page.server";
import { listPublicTopics } from "@/features/articles/public/list-public-topics.server";
import { loadBlogPage } from "@/public-site/blog/load-blog-page.server";
import { jlensBlogConfig } from "@/public-site/sites/jlens/blog-config";
import { subiqBlogConfig } from "@/public-site/sites/subiq/blog-config";

vi.mock("@/features/articles/public/get-public-translation.server", () => ({
  getPublicTranslation: vi.fn(),
}));
vi.mock("@/features/articles/public/list-public-article-page.server", () => ({
  listPublicArticlePage: vi.fn(),
}));
vi.mock("@/features/articles/public/list-public-topics.server", () => ({
  listPublicTopics: vi.fn(),
}));

const article = (articleId: string, slug: string) => ({
  articleId,
  locale: "en-US",
  keywordId: "keyword",
  title: `Source ${articleId}`,
  slug,
  topics: ["Renewals"],
  excerpt: "Source excerpt",
  plan: null,
  planReferences: [],
  content: "## Source",
  contentReferences: [],
  seoTitle: "Source SEO",
  seoDescription: "Source SEO description",
  status: "published" as const,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-02T00:00:00.000Z",
});

describe("localized blog page composition", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(listPublicArticlePage).mockResolvedValue({
      items: [article("one", "one"), article("two", "two")],
      hasNext: true,
      nextCursor: "cursor",
    });
    vi.mocked(listPublicTopics).mockResolvedValue(["Renewals"]);
    vi.mocked(getPublicTranslation).mockImplementation(
      async (_projectId, articleId, locale) =>
        articleId === "one"
          ? {
              locale,
              title: "Bản dịch",
              slug: "ban-dich",
              excerpt: "Tóm tắt",
              content: "## Nội dung",
              seoTitle: "SEO",
              seoDescription: "SEO",
              status: "approved",
              createdAt: "2026-01-01T00:00:00.000Z",
              updatedAt: "2026-01-03T00:00:00.000Z",
            }
          : null,
    );
  });

  it("uses an approved translation and marks only missing translations as fallback", async () => {
    const result = await loadBlogPage({
      config: subiqBlogConfig,
      locale: "vi-VN",
      topic: "Renewals",
    });

    expect(result.items[0]).toMatchObject({
      title: "Bản dịch",
      slug: "ban-dich",
      isSourceFallback: false,
    });
    expect(result.items[1]).toMatchObject({
      title: "Source two",
      slug: "two",
      isSourceFallback: true,
    });
    expect(listPublicArticlePage).toHaveBeenCalledWith(
      expect.objectContaining({
        projectId: "subiq",
        sourceLocale: "en-US",
        topic: "Renewals",
      }),
    );
  });

  it("scopes JLens blog reads to the JLens project", async () => {
    await loadBlogPage({
      config: jlensBlogConfig,
      locale: "en-US",
    });

    expect(listPublicArticlePage).toHaveBeenCalledWith(
      expect.objectContaining({
        projectId: "jlens",
        sourceLocale: "en-US",
      }),
    );
    expect(listPublicTopics).toHaveBeenCalledWith("jlens", "en-US");
    expect(getPublicTranslation).not.toHaveBeenCalled();
  });
});

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ArticleList } from "@/features/articles/backoffice/article-list";

vi.mock("@/features/articles/backoffice/delete-article-action.server", () => ({
  deleteArticleAction: vi.fn(),
}));

describe("ArticleList", () => {
  it("requires confirmation and explains that the topic is released", () => {
    HTMLDialogElement.prototype.showModal = vi.fn();
    render(
      <ArticleList
        articles={[
          {
            articleId: "article-1",
            keywordId: "keyword-1",
            locale: "en-US",
            title: null,
            slug: null,
            topics: [],
            excerpt: null,
            plan: null,
            planReferences: [],
            content: null,
            contentReferences: [],
            seoTitle: null,
            seoDescription: null,
            status: "draft",
            createdAt: "2026-07-18T00:00:00.000Z",
            updatedAt: "2026-07-18T00:00:00.000Z",
          },
        ]}
        projectId="subiq"
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Delete" }));

    expect(screen.getByText("Delete Untitled?")).toBeInTheDocument();
    expect(screen.getByText(/will be released/i)).toBeInTheDocument();
    expect(screen.getByText("Delete article")).toBeInTheDocument();
  });
});

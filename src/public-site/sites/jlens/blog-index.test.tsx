import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { BlogIndex } from "@/public-site/components/blog/blog-index";
import { jlensBlogConfig } from "@/public-site/sites/jlens/blog-config";

describe("JLens blog index", () => {
  it("does not invent a topic for an article without topics", () => {
    render(
      <BlogIndex
        config={jlensBlogConfig}
        routePrefix="/jlens"
        locale="en-US"
        result={{
          items: [
            {
              id: "article-1",
              title: "Sterling Silver Bracelets",
              slug: "sterling-silver-bracelets",
              excerpt: "How to identify and care for sterling silver.",
              topics: [],
              updatedAt: "2026-07-21T00:00:00.000Z",
              isSourceFallback: false,
            },
          ],
          topics: [],
          hasNext: false,
          nextCursor: null,
        }}
        copy={{
          articlesLabel: "Jewelry guides",
          browseByTopic: "Browse by topic",
          allTopics: "All topics",
          englishOnlyShort: "Available in English",
          emptyTitle: "Guides are coming soon",
          emptyDescription: "We’re preparing practical jewelry guides.",
          paginationLabel: "Blog pagination",
          nextPage: "Next page",
        }}
      />,
    );

    expect(screen.getByText("Sterling Silver Bracelets")).toBeInTheDocument();
    expect(screen.queryByText("Jewelry guide")).not.toBeInTheDocument();
  });
});

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { articleMdxComponents } from "@/public-site/components/mdx/article-mdx-components";
import { renderArticleMdx } from "@/public-site/components/mdx/render-article-mdx.server";

describe("articleMdxComponents", () => {
  it("does not nest a rendered Markdown table inside another table", () => {
    const TableGroup = articleMdxComponents.Table;
    const MarkdownTable = articleMdxComponents.table;
    const { container } = render(
      <TableGroup>
        <MarkdownTable>
          <tbody>
            <tr>
              <td>Value</td>
            </tr>
          </tbody>
        </MarkdownTable>
      </TableGroup>,
    );

    expect(container.querySelectorAll("table")).toHaveLength(1);
  });

  it("renders the approved Table MDX wrapper as valid HTML", async () => {
    const article = await renderArticleMdx(`<Table>

| Metal | Care |
| --- | --- |
| Silver | Polish gently |

</Table>`);
    const { container } = render(article.content);

    expect(container.querySelectorAll("table")).toHaveLength(1);
    expect(container.querySelector("table table")).toBeNull();
  });
});

import { createRef } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { MDXEditorMethods } from "@mdxeditor/editor";
import { describe, expect, it, vi } from "vitest";

import InitializedMarkdownEditor from "@/features/articles/backoffice/initialized-markdown-editor";

const articleMdx = `Opening paragraph.

<Callout type="warning">
Do not skip this warning.
</Callout>

## Content after the callout

This section must remain visible and editable.

<Steps>
### First step
Complete the first step.

### Second step
Complete the second step.
</Steps>

<Tabs>
<Tab title="Platinum">
Naturally white.
</Tab>
<Tab title="White gold">
Rhodium plated.
</Tab>
</Tabs>

| Option | Cost |
| --- | ---: |
| Example | $0 |

\`\`\`text
The code block also survives.
\`\`\`

Final paragraph.`;

describe("InitializedMarkdownEditor", () => {
  it("renders and round-trips content after custom MDX components", async () => {
    const editorRef = createRef<MDXEditorMethods>();

    render(
      <InitializedMarkdownEditor
        editorRef={editorRef}
        markdown={articleMdx}
        onChange={vi.fn()}
      />,
    );

    expect(await screen.findByText("Content after the callout")).toBeVisible();
    expect(screen.getByText("Final paragraph.")).toBeVisible();

    await waitFor(() => expect(editorRef.current).not.toBeNull());

    const roundTrip = editorRef.current!.getMarkdown();
    expect(roundTrip).toContain('<Callout type="warning">');
    expect(roundTrip).toContain("## Content after the callout");
    expect(roundTrip).toContain("<Steps>");
    expect(roundTrip).toContain('<Tab title="Platinum">');
    expect(roundTrip).toContain("The code block also survives.");
    expect(roundTrip).toContain("Final paragraph.");

    const tabTitles = screen.getAllByLabelText("Tab title");
    fireEvent.change(tabTitles[0]!, { target: { value: "Updated metal" } });

    await waitFor(() =>
      expect(editorRef.current!.getMarkdown()).toContain(
        '<Tab title="Updated metal">',
      ),
    );
  });
});

export const articleContentApplyPrompt = {
  version: "article-content-apply-v2",
  system: `Apply only the supplied approved before-and-after changes to the supplied current article MDX.

Use each before excerpt to locate the intended passage, allowing for insignificant whitespace or Markdown-formatting differences, then apply its corresponding after passage. Preserve every unselected passage. Do not make additional edits, rewrite transitions, add facts, remove content, or change formatting outside the approved replacements.

Follow the supplied componentAuthoringGuide exactly. Return the complete updated MDX only. Do not include an explanation, review report, code fence, or H1.`,
};

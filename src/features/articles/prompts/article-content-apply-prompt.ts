export const articleContentApplyPrompt = {
  version: "article-content-apply-v1",
  system: `Apply only the supplied approved before-and-after changes to the supplied current article MDX.

Replace each approved before passage with its corresponding after passage. Preserve every unselected passage exactly. Do not make additional edits, rewrite transitions, add facts, remove content, or change formatting outside the approved replacements.

Return the complete updated MDX only. Do not include an explanation, review report, code fence, or H1.`,
};

export const articleContentPrompt = {
  version: "article-content-v1",
  system: `Write one complete, genuinely useful article body as valid MDX from the supplied title and article plan.

Write in natural, idiomatic language for the requested locale. The result must read as though it was written and edited by a fluent native professional. Avoid awkward, translated, overly formal, robotic, or unnatural phrasing that a native reader would not normally use.

Respect the reader's time. Begin with useful substance rather than a generic introduction. Every section and paragraph must add distinct information, explanation, guidance, or a concrete example. Remove filler, obvious statements, empty transitions, unnecessary summaries, and repeated ideas. Do not restate the title, article plan, or the same advice in different words.

Use Google Search to verify current, product-specific, regulated, time-sensitive, or otherwise factual claims. Use keywords naturally only when they fit the meaning. Never repeat keywords for SEO purposes or distort a sentence to include one. Prefer clear, specific, actionable explanations over broad claims. Use examples when they materially improve understanding, but do not invent facts, statistics, quotes, product behavior, or unsupported details. If a factual claim cannot be verified, omit it. The application displays grounding references separately, so do not add a sources section or citation footnotes.

Do not include an H1 because the page renders the title. Use only approved MDX components. Return only the complete article MDX with no commentary.`,
};

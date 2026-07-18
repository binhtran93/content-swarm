export const articleContentImprovePrompt = {
  version: "article-content-improve-v1",
  system: `Rewrite the supplied MDX into a clearer, more useful, and more natural article while preserving its valid facts, meaning, links, and intended outcome.

The result must read as though it was written and edited by a fluent native professional for the requested locale. Replace awkward, translated, robotic, overly formal, or unnatural phrasing with idiomatic language a native reader would actually use.

Respect the reader's time. Remove filler, generic introductions, empty conclusions, unnecessary transitions, obvious statements, repeated ideas, and sections that provide no distinct value. Combine overlapping passages. Ensure every remaining paragraph contributes useful information, explanation, guidance, or a concrete supported example.

Improve structure and flow while staying aligned with the saved brief and outline. Use keywords naturally and never repeat them merely for SEO. Do not add facts, statistics, quotes, product behavior, or other details unsupported by the saved context.

Return the complete improved MDX, not a review report, explanation, summary, or patch. Do not add an H1 or unsupported MDX components.`,
};

export const articleTranslationPrompt = {
  version: "article-translation-v2",
  system: `Translate and localize the supplied article for the exact target locale.

The result must read as though it was originally written and edited by a fluent native professional, not translated word for word. Use natural, idiomatic phrasing that native readers would normally use. Rewrite idioms, sentence structure, transitions, and expressions when a literal translation would sound awkward, robotic, overly formal, or unnatural.

Preserve the source meaning, factual claims, intent, tone, section hierarchy, lists, emphasis, links, and complete MDX structure. Do not add, remove, merge, or invent facts, examples, statistics, quotes, product behavior, or sections. Keep the translation clear, concise, and useful; avoid filler and repetition.

Localize visible prose for the target audience. Preserve product names, trademarks, technical identifiers, MDX component names, tag names, prop names, code, commands, file paths, identifiers, and URLs exactly. Translate human-readable component text only when syntax and behavior remain unchanged. Follow the supplied componentAuthoringGuide exactly.

Create a concise URL-safe slug suggestion using natural target-language search phrasing. Write an idiomatic SEO title and SEO description. Return exactly one structured object containing title, slug, excerpt, content, seoTitle, and seoDescription, with no commentary.`,
};

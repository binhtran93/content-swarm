export const articleContentReviewPrompt = {
  version: "article-content-review-v2",
  system: `Review the supplied current article MDX and propose only focused, meaningful improvements.

Follow the supplied writing rules and saved article plan. Look for robotic, repetitive, overly formal, vague, inaccurate, risky, or unhelpful passages. Also identify missing reader value only when it can be expressed as a focused replacement of an existing passage. Use Google Search to verify current, product-specific, regulated, time-sensitive, or otherwise factual claims.

Each proposal must contain:
- before: the current passage or a clear excerpt that lets the user recognize what would change.
- after: the complete replacement MDX for that passage.

Keep proposals small enough to review independently. Preserve valid links and approved MDX components. Follow the supplied componentAuthoringGuide exactly for every replacement. Do not return ratings, explanations, summaries, categories, or general feedback. If no meaningful changes are needed, return an empty changes array. Return only the requested structured result.`,
};

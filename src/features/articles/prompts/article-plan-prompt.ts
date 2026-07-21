export const articlePlanPrompt = {
  version: "article-plan-v3",
  system: `Create one concise, actionable article plan from the project and keyword context.

The plan combines editorial direction and article structure. Include the target reader, search intent, article goal and angle, required facts and boundaries, tone, introduction intent, ordered H2 sections, optional H3 sections, and short instructions for what each section must accomplish. Treat keywords as intent signals rather than phrases that must be repeated.

If a FAQ would genuinely help the reader and suits the current article, add it as the final H2 section and outline only useful questions that the article should answer. Omit the FAQ when it would be forced, repetitive, or irrelevant.

Use Google Search to verify current, product-specific, regulated, time-sensitive, or otherwise factual requirements. Do not invent facts. Keep research findings concise and include only details that materially guide the writer. The application displays grounding references separately, so do not add a sources section or citation footnotes to the plan.

Use the provided article title as context. Do not generate or rewrite it.

Do not write article prose, SEO filler, an H1, or an article conclusion. Return only the requested structured result.`,
};

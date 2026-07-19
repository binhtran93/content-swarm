export const articleExcerptPrompt = {
  version: "article-excerpt-v1",
  system: `Write one concise article excerpt from the supplied keyword context and current article MDX.

Summarize what the reader will learn in plain, natural language. Match the article's actual content. Use the primary keyword naturally when it fits, but do not stuff keywords. Do not use markdown, quotation marks, headings, calls to action, em dashes, en dashes, or legalistic language.

Return only the requested structured result.`,
};

export const articleOutlinePrompt = {
  version: "article-outline-v1",
  system: `You create a structured article outline from the saved brief. Return one clear proposed title, introduction intent, H2 sections, optional H3 sections, and key points. Suggest an approved semantic MDX component only when it improves the explanation. Do not write full article prose, invent facts, add an H1, or depart from the brief. Return only the requested structured result.`,
};

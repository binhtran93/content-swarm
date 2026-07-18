import "server-only";

import type { z } from "zod";

import { keywordInputSchema } from "@/features/keywords/model/keyword-input";
import type { Keyword } from "@/features/keywords/model/keyword";
import { addKeywords } from "@/features/keywords/service/add-keywords.server";
import { KeywordServiceError } from "@/features/keywords/service/keyword-service-error";

export async function addKeyword(
  projectId: string,
  input: z.input<typeof keywordInputSchema>,
): Promise<Keyword> {
  const validated = keywordInputSchema.parse(input);
  const result = await addKeywords(projectId, [validated]);
  if (!result.created[0]) {
    throw new KeywordServiceError(
      "conflict",
      "That keyword is already in the backlog.",
    );
  }
  return result.created[0];
}

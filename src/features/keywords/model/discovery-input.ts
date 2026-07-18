import { z } from "zod";

import { discoveryMethodSchema } from "@/features/keywords/model/keyword-discovery-document";
import {
  countryCodeSchema,
  languageCodeSchema,
} from "@/features/keywords/model/keyword-input";

export const discoveryOrderBy = {
  keyword_ideas: ["relevance,desc", "keyword_info.search_volume,desc"],
  related_keywords: ["keyword_data.keyword_info.search_volume,desc"],
  competitor_website: [
    "ranked_serp_element.serp_item.rank_group,asc",
    "keyword_data.keyword_info.search_volume,desc",
  ],
} as const;

export const keywordIdeaSeeds = (input: string) => [
  ...new Set(
    input
      .split(/\r?\n/)
      .map((value) =>
        value.trim().replace(/\s+/g, " ").toLocaleLowerCase("en-US"),
      )
      .filter(Boolean),
  ),
];

export const discoveryRequestSchema = z
  .object({
    method: discoveryMethodSchema,
    input: z.string().trim().min(1, "Enter a keyword or website.").max(20_000),
    countryCode: countryCodeSchema,
    languageCode: languageCodeSchema,
    limit: z.union([
      z.literal(50),
      z.literal(100),
      z.literal(250),
      z.literal(500),
    ]),
    minimumVolume: z.number().int().nonnegative().nullable().default(null),
    maximumDifficulty: z.number().min(0).max(100).nullable().default(null),
  })
  .superRefine((request, context) => {
    if (
      request.method === "keyword_ideas" &&
      keywordIdeaSeeds(request.input).length > 200
    ) {
      context.addIssue({
        code: "custom",
        path: ["input"],
        message: "Use no more than 200 seed keywords.",
      });
    }
  });

export type DiscoveryRequest = z.infer<typeof discoveryRequestSchema>;

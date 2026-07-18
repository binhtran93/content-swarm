import type { z } from "zod";

import type { discoveryResultSchema } from "@/features/keywords/model/keyword-discovery-document";

export type DiscoveryResult = z.infer<typeof discoveryResultSchema>;

export type KeywordDiscovery = {
  discoveryId: string;
  requestKey: string;
  method: "keyword_ideas" | "related_keywords" | "competitor_website";
  input: string;
  countryCode: string;
  languageCode: string;
  limit: 50 | 100 | 250 | 500;
  minimumVolume: number | null;
  maximumDifficulty: number | null;
  orderBy: string[];
  results: DiscoveryResult[];
  createdAt: string;
};

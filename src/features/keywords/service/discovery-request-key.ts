import { createHash } from "node:crypto";

import {
  discoveryOrderBy,
  discoveryRequestSchema,
  keywordIdeaSeeds,
  type DiscoveryRequest,
} from "@/features/keywords/model/discovery-input";
import { normalizeKeyword } from "@/features/keywords/model/keyword-input";

export function normalizeDiscoveryRequest(input: DiscoveryRequest) {
  const request = discoveryRequestSchema.parse(input);
  return {
    ...request,
    input:
      request.method === "keyword_ideas"
        ? keywordIdeaSeeds(request.input).join("\n")
        : request.method === "competitor_website"
          ? request.input
              .trim()
              .toLocaleLowerCase("en-US")
              .replace(/^https?:\/\//, "")
              .replace(/\/$/, "")
          : normalizeKeyword(request.input),
    orderBy: [...discoveryOrderBy[request.method]],
  };
}

export function discoveryRequestKey(input: DiscoveryRequest): string {
  const normalized = normalizeDiscoveryRequest(input);
  return `discovery_${createHash("sha256")
    .update(JSON.stringify(normalized))
    .digest("hex")}`;
}

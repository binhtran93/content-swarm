import "server-only";

import { z } from "zod";

import { findSupportedMarket } from "@/config/supported-locales";
import {
  keywordIdeaSeeds,
  type DiscoveryRequest,
} from "@/features/keywords/model/discovery-input";
import type { DiscoveryResult } from "@/features/keywords/model/keyword-discovery";
import { normalizeDiscoveryRequest } from "@/features/keywords/service/discovery-request-key";
import { KeywordServiceError } from "@/features/keywords/service/keyword-service-error";

const credentialsSchema = z.object({
  DATAFORSEO_LOGIN: z.string().trim().min(1),
  DATAFORSEO_PASSWORD: z.string().min(1),
});

type JsonObject = Record<string, unknown>;

function object(value: unknown): JsonObject | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as JsonObject)
    : null;
}

function numberOrNull(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function taskResult(payload: unknown): unknown[] {
  const root = object(payload);
  const tasks = Array.isArray(root?.tasks) ? root.tasks : [];
  const task = object(tasks[0]);
  if (root?.status_code !== 20000 || task?.status_code !== 20000) {
    throw new KeywordServiceError(
      "provider",
      typeof task?.status_message === "string"
        ? task.status_message
        : "DataForSEO could not complete the request.",
    );
  }
  const result = Array.isArray(task.result) ? task.result : [];
  const first = object(result[0]);
  return Array.isArray(first?.items) ? first.items : result;
}

async function dataForSeoRequest(
  path: string,
  body?: unknown,
): Promise<unknown> {
  if (
    process.env.NODE_ENV === "test" &&
    process.env.DATAFORSEO_ALLOW_TEST_NETWORK !== "1"
  ) {
    throw new KeywordServiceError(
      "provider",
      "Paid provider network calls are disabled during tests.",
    );
  }
  const credentials = credentialsSchema.safeParse(process.env);
  if (!credentials.success) {
    throw new KeywordServiceError(
      "provider",
      "DataForSEO credentials are not configured.",
    );
  }
  let response: Response;
  try {
    response = await fetch(`https://api.dataforseo.com${path}`, {
      method: body ? "POST" : "GET",
      headers: {
        Authorization: `Basic ${Buffer.from(`${credentials.data.DATAFORSEO_LOGIN}:${credentials.data.DATAFORSEO_PASSWORD}`).toString("base64")}`,
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(45_000),
      cache: "no-store",
    });
  } catch {
    throw new KeywordServiceError(
      "provider",
      "DataForSEO could not be reached.",
    );
  }
  if (!response.ok) {
    throw new KeywordServiceError(
      "provider",
      `DataForSEO returned HTTP ${response.status}.`,
    );
  }
  return response.json();
}

function resolveProviderMarket(countryCode: string, languageCode: string) {
  const market = findSupportedMarket(countryCode, languageCode);

  if (!market) {
    throw new KeywordServiceError(
      "provider",
      `DataForSEO does not support ${countryCode}/${languageCode}.`,
    );
  }

  return market;
}

function filtersFor(request: ReturnType<typeof normalizeDiscoveryRequest>) {
  const prefix = request.method === "keyword_ideas" ? "" : "keyword_data.";
  const filters: unknown[] = [];
  if (request.minimumVolume !== null) {
    filters.push([
      `${prefix}keyword_info.search_volume`,
      ">=",
      request.minimumVolume,
    ]);
  }
  if (request.maximumDifficulty !== null) {
    if (filters.length) filters.push("and");
    filters.push([
      `${prefix}keyword_properties.keyword_difficulty`,
      "<=",
      request.maximumDifficulty,
    ]);
  }
  return filters.length ? filters : undefined;
}

function endpoint(method: DiscoveryRequest["method"]) {
  if (method === "keyword_ideas")
    return "/v3/dataforseo_labs/google/keyword_ideas/live";
  if (method === "related_keywords")
    return "/v3/dataforseo_labs/google/related_keywords/live";
  return "/v3/dataforseo_labs/google/ranked_keywords/live";
}

export async function fetchKeywordDiscovery(
  requestInput: DiscoveryRequest,
): Promise<DiscoveryResult[]> {
  const request = normalizeDiscoveryRequest(requestInput);
  const market = resolveProviderMarket(
    request.countryCode,
    request.languageCode,
  );
  const methodInput =
    request.method === "keyword_ideas"
      ? { keywords: keywordIdeaSeeds(request.input) }
      : request.method === "related_keywords"
        ? { keyword: request.input, depth: 4 }
        : { target: request.input };
  const payload = await dataForSeoRequest(endpoint(request.method), [
    {
      ...methodInput,
      location_code: market.dataForSeoLocationCode,
      language_code: market.dataForSeoLanguageCode,
      limit: request.limit,
      order_by: request.orderBy,
      filters: filtersFor(request),
    },
  ]);

  return parseDiscoveryPayload(request.method, payload, request.limit);
}

export function parseDiscoveryPayload(
  method: DiscoveryRequest["method"],
  payload: unknown,
  limit: number,
): DiscoveryResult[] {
  return taskResult(payload)
    .slice(0, limit)
    .flatMap((value): DiscoveryResult[] => {
      const item = object(value);
      const keywordData = object(item?.keyword_data) ?? item;
      const keyword =
        keywordData && typeof keywordData.keyword === "string"
          ? keywordData.keyword
          : null;
      if (!keyword) return [];
      const info = object(keywordData?.keyword_info);
      const properties = object(keywordData?.keyword_properties);
      const serp = object(object(item?.ranked_serp_element)?.serp_item);
      return [
        {
          keyword,
          searchVolume: numberOrNull(info?.search_volume),
          difficulty: numberOrNull(properties?.keyword_difficulty),
          rank:
            method === "competitor_website"
              ? numberOrNull(serp?.rank_group)
              : null,
        },
      ];
    });
}

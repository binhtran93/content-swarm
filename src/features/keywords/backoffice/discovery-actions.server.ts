"use server";

import { redirect } from "next/navigation";
import { ZodError } from "zod";

import { requireSupportedLocale } from "@/config/supported-locales";
import type { DiscoveryRequest } from "@/features/keywords/model/discovery-input";
import { addResultsToBacklog } from "@/features/keywords/service/add-results-to-backlog.server";
import { getOrReuseDiscovery } from "@/features/keywords/service/get-or-reuse-discovery.server";
import { KeywordServiceError } from "@/features/keywords/service/keyword-service-error";
import { removeDiscovery } from "@/features/keywords/service/remove-discovery.server";
import { appendProjectCompetitor } from "@/features/projects/service/append-project-competitor.server";

export type DiscoveryActionState = { error?: string } | null;
export type AddDiscoveryResultsActionState = { error?: string } | null;
export type RemoveDiscoveryActionState = { error?: string } | null;

function nullableNumber(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  return text ? Number(text) : null;
}

function requestFrom(formData: FormData): DiscoveryRequest {
  const market = requireSupportedLocale(String(formData.get("locale") ?? ""));

  return {
    method: String(formData.get("method")) as DiscoveryRequest["method"],
    input: String(formData.get("input") ?? ""),
    countryCode: market.countryCode,
    languageCode: market.languageCode,
    limit: Number(formData.get("limit")) as DiscoveryRequest["limit"],
    minimumVolume: nullableNumber(formData.get("minimumVolume")),
    maximumDifficulty: nullableNumber(formData.get("maximumDifficulty")),
  };
}

function message(error: unknown) {
  if (error instanceof ZodError)
    return error.issues[0]?.message ?? "Check the request.";
  if (error instanceof KeywordServiceError) return error.message;
  return "The discovery could not be completed.";
}

export async function runDiscoveryAction(
  _state: DiscoveryActionState,
  formData: FormData,
): Promise<DiscoveryActionState> {
  const projectId = String(formData.get("projectId") ?? "");
  let discoveryId: string;
  try {
    const request = requestFrom(formData);
    const result = await getOrReuseDiscovery(projectId, request);
    if (request.method === "competitor_website") {
      await appendProjectCompetitor(projectId, result.discovery.input);
    }
    discoveryId = result.discovery.discoveryId;
  } catch (error) {
    return { error: message(error) };
  }
  redirect(
    `/admin/projects/${projectId}/keywords?view=discover&discovery=${discoveryId}`,
  );
}

export async function addDiscoveryResultsAction(
  _state: AddDiscoveryResultsActionState,
  formData: FormData,
): Promise<AddDiscoveryResultsActionState> {
  const projectId = String(formData.get("projectId") ?? "");
  const discoveryId = String(formData.get("discoveryId") ?? "");
  try {
    await addResultsToBacklog(
      projectId,
      discoveryId,
      formData.getAll("keywords").map(String),
    );
  } catch (error) {
    return {
      error:
        error instanceof KeywordServiceError
          ? error.message
          : "The selected keywords could not be added to the backlog.",
    };
  }
  redirect(
    `/admin/projects/${projectId}/keywords?view=discover&discovery=${discoveryId}`,
  );
}

export async function removeDiscoveryAction(
  _state: RemoveDiscoveryActionState,
  formData: FormData,
): Promise<RemoveDiscoveryActionState> {
  const projectId = String(formData.get("projectId") ?? "");
  const discoveryId = String(formData.get("discoveryId") ?? "");

  try {
    await removeDiscovery(projectId, discoveryId);
  } catch (error) {
    return {
      error:
        error instanceof KeywordServiceError
          ? error.message
          : "The saved discovery could not be removed. Please try again.",
    };
  }

  redirect(`/admin/projects/${projectId}/keywords?view=discover`);
}

"use server";

import { redirect } from "next/navigation";
import { ZodError } from "zod";

import { addKeyword } from "@/features/keywords/service/add-keyword.server";
import { addKeywords } from "@/features/keywords/service/add-keywords.server";
import { createKeywordGroup } from "@/features/keywords/service/create-keyword-group.server";
import { dissolveKeywordGroup } from "@/features/keywords/service/dissolve-keyword-group.server";
import { KeywordServiceError } from "@/features/keywords/service/keyword-service-error";
import { removeKeywords } from "@/features/keywords/service/remove-keywords.server";

export type KeywordActionState = { error?: string } | null;

function message(error: unknown) {
  if (error instanceof ZodError)
    return error.issues[0]?.message ?? "Check the form values.";
  if (error instanceof KeywordServiceError) return error.message;
  return "The keyword backlog could not be changed. Please try again.";
}

export async function addKeywordAction(
  _state: KeywordActionState,
  formData: FormData,
): Promise<KeywordActionState> {
  const projectId = String(formData.get("projectId") ?? "");
  const countryCode = String(formData.get("countryCode") ?? "");
  const languageCode = String(formData.get("languageCode") ?? "");
  const pasted = String(formData.get("keywords") ?? "");
  let redirectPath: string;
  try {
    const lines = pasted.split(/\r?\n/);
    if (lines.length > 1) {
      const result = await addKeywords(
        projectId,
        lines.map((keyword) => ({ keyword, countryCode, languageCode })),
      );
      redirectPath = `/admin/projects/${projectId}/keywords?view=backlog&added=${result.created.length}&skipped=${result.skipped}`;
    } else {
      await addKeyword(projectId, {
        keyword: pasted,
        countryCode,
        languageCode,
      });
      redirectPath = `/admin/projects/${projectId}/keywords?view=backlog&added=1`;
    }
  } catch (error) {
    return { error: message(error) };
  }
  redirect(redirectPath);
}

export async function createKeywordGroupAction(
  _state: KeywordActionState,
  formData: FormData,
): Promise<KeywordActionState> {
  const projectId = String(formData.get("projectId") ?? "");
  try {
    await createKeywordGroup(
      projectId,
      formData.getAll("memberIds").map(String),
    );
  } catch (error) {
    return { error: message(error) };
  }
  redirect(`/admin/projects/${projectId}/keywords?view=backlog&grouped=1`);
}

export async function removeSelectedKeywordsAction(
  _state: KeywordActionState,
  formData: FormData,
): Promise<KeywordActionState> {
  const projectId = String(formData.get("projectId") ?? "");
  let removed: number;
  try {
    const result = await removeKeywords(
      projectId,
      formData.getAll("memberIds").map(String),
    );
    removed = result.removed;
  } catch (error) {
    return { error: message(error) };
  }
  redirect(
    `/admin/projects/${projectId}/keywords?view=backlog&removed=${removed}`,
  );
}

export async function dissolveKeywordGroupAction(formData: FormData) {
  const projectId = String(formData.get("projectId") ?? "");
  try {
    await dissolveKeywordGroup(
      projectId,
      String(formData.get("groupId") ?? ""),
    );
  } catch {
    redirect(`/admin/projects/${projectId}/keywords?view=backlog&error=group`);
  }
  redirect(`/admin/projects/${projectId}/keywords?view=backlog&dissolved=1`);
}

import "server-only";

import { Timestamp } from "firebase-admin/firestore";
import type { z } from "zod";

import { requireOwner } from "@/features/auth/server/require-owner.server";
import { keywordDocumentSchema } from "@/features/keywords/model/keyword-document";
import {
  keywordInputSchema,
  normalizeKeyword,
} from "@/features/keywords/model/keyword-input";
import type { Keyword } from "@/features/keywords/model/keyword";
import { assertActiveProject } from "@/features/keywords/service/assert-active-project.server";
import { keywordDocumentId } from "@/features/keywords/service/keyword-document-id";
import { toKeyword } from "@/features/keywords/service/to-keyword.server";
import { getServerFirestore } from "@/platform/firebase/firestore.server";

export type AddKeywordsResult = {
  created: Keyword[];
  skipped: number;
};

export async function addKeywords(
  projectId: string,
  inputs: z.input<typeof keywordInputSchema>[],
): Promise<AddKeywordsResult> {
  const owner = await requireOwner();
  const unique = new Map<string, z.infer<typeof keywordInputSchema>>();
  let skipped = 0;

  for (const input of inputs) {
    const parsed = keywordInputSchema.safeParse(input);
    if (!parsed.success) {
      skipped += 1;
      continue;
    }
    const id = keywordDocumentId(
      parsed.data.keyword,
      parsed.data.countryCode,
      parsed.data.languageCode,
    );
    if (unique.has(id)) skipped += 1;
    else unique.set(id, parsed.data);
  }

  if (unique.size > 250)
    throw new Error("Add no more than 250 keywords at once.");
  if (unique.size === 0) return { created: [], skipped };

  const firestore = getServerFirestore();
  const collection = firestore
    .collection("projects")
    .doc(projectId)
    .collection("keywords");
  const entries = [...unique.entries()].map(([id, input]) => ({
    id,
    input,
    reference: collection.doc(id),
  }));

  const created = await firestore.runTransaction(async (transaction) => {
    await assertActiveProject(transaction, projectId, owner.uid);
    const snapshots = await transaction.getAll(
      ...entries.map((entry) => entry.reference),
    );
    const now = Timestamp.now();
    const documents: Array<{
      id: string;
      document: z.infer<typeof keywordDocumentSchema>;
    }> = [];

    entries.forEach((entry, index) => {
      if (snapshots[index]?.exists) {
        skipped += 1;
        return;
      }
      const document = keywordDocumentSchema.parse({
        schemaVersion: 1,
        keyword: entry.input.keyword,
        normalizedKeyword: normalizeKeyword(entry.input.keyword),
        countryCode: entry.input.countryCode,
        languageCode: entry.input.languageCode,
        searchVolume: entry.input.searchVolume,
        difficulty: entry.input.difficulty,
        sourceDiscoveryId: entry.input.sourceDiscoveryId,
        groupId: null,
        articleId: null,
        createdAt: now,
        updatedAt: now,
      });
      transaction.create(entry.reference, document);
      documents.push({ id: entry.id, document });
    });
    return documents;
  });

  return {
    created: created.map(({ id, document }) => toKeyword(id, document)),
    skipped,
  };
}

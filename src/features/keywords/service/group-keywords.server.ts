import "server-only";

import { Timestamp } from "firebase-admin/firestore";
import type { DocumentReference, Transaction } from "firebase-admin/firestore";
import type { z } from "zod";

import { keywordDocumentSchema } from "@/features/keywords/model/keyword-document";
import { keywordGroupDocumentSchema } from "@/features/keywords/model/keyword-group-document";
import { KeywordServiceError } from "@/features/keywords/service/keyword-service-error";
import { readFirestoreDocument } from "@/platform/firebase/read-firestore-document.server";

type KeywordDocument = z.infer<typeof keywordDocumentSchema>;

export function validateGroupSelection(selectedIds: string[]) {
  const uniqueIds = [...new Set(selectedIds)];
  if (uniqueIds.length < 2 || uniqueIds.length > 25) {
    throw new KeywordServiceError(
      "invalid-group",
      "Select 2 to 25 keywords or groups.",
    );
  }
  return uniqueIds;
}

export function validateMergedMemberIds(memberIds: string[]) {
  const uniqueIds = [...new Set(memberIds)];
  if (uniqueIds.length < 2 || uniqueIds.length > 25) {
    throw new KeywordServiceError(
      "invalid-group",
      "A merged group needs 2 to 25 unique keywords.",
    );
  }
  return uniqueIds;
}

export function selectPrimaryKeywordId(
  memberIds: string[],
  documents: KeywordDocument[],
) {
  const candidates = memberIds.map((keywordId, index) => ({
    keywordId,
    document: documents[index]!,
  }));
  candidates.sort((left, right) => {
    const volumeDifference =
      (right.document.searchVolume ?? -1) - (left.document.searchVolume ?? -1);
    if (volumeDifference) return volumeDifference;
    const difficultyDifference =
      (left.document.difficulty ?? Number.POSITIVE_INFINITY) -
      (right.document.difficulty ?? Number.POSITIVE_INFINITY);
    if (difficultyDifference) return difficultyDifference;
    const keywordDifference = left.document.normalizedKeyword.localeCompare(
      right.document.normalizedKeyword,
    );
    return keywordDifference || left.keywordId.localeCompare(right.keywordId);
  });
  return candidates[0]!.keywordId;
}

export function validateGroupKeywords(
  documents: KeywordDocument[],
  allowedGroupIds: Set<string> | null,
) {
  if (documents.length === 0) return;
  const locale = `${documents[0]!.countryCode}:${documents[0]!.languageCode}`;
  for (const keyword of documents) {
    if (`${keyword.countryCode}:${keyword.languageCode}` !== locale) {
      throw new KeywordServiceError(
        "invalid-group",
        "Grouped keywords must use the same country and language.",
      );
    }
    if (keyword.articleId) {
      throw new KeywordServiceError(
        "assigned",
        "Assigned keywords cannot be regrouped.",
      );
    }
    if (
      keyword.groupId &&
      (!allowedGroupIds || !allowedGroupIds.has(keyword.groupId))
    ) {
      throw new KeywordServiceError(
        "conflict",
        "A selected keyword already belongs to another group.",
      );
    }
  }
}

export async function readKeywordDocuments(
  transaction: Transaction,
  references: DocumentReference[],
): Promise<KeywordDocument[]> {
  const snapshots = await transaction.getAll(...references);
  return snapshots.map((snapshot) => {
    const document = readFirestoreDocument(keywordDocumentSchema, snapshot);
    if (!document) {
      throw new KeywordServiceError(
        "unavailable",
        "A selected keyword is unavailable.",
      );
    }
    return document;
  });
}

export function createGroupDocument(
  primaryKeywordId: string,
  memberKeywordIds: string[],
  name: string | null,
  createdAt = Timestamp.now(),
) {
  return keywordGroupDocumentSchema.parse({
    schemaVersion: 1,
    name: name?.trim() || null,
    primaryKeywordId,
    memberKeywordIds,
    createdAt,
    updatedAt: Timestamp.now(),
  });
}

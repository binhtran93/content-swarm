import "server-only";

import { Timestamp } from "firebase-admin/firestore";
import type { z } from "zod";

import { requireOwner } from "@/features/auth/server/require-owner.server";
import { keywordDocumentSchema } from "@/features/keywords/model/keyword-document";
import {
  keywordUpdateInputSchema,
  normalizeKeyword,
} from "@/features/keywords/model/keyword-input";
import type { Keyword } from "@/features/keywords/model/keyword";
import { assertActiveProject } from "@/features/keywords/service/assert-active-project.server";
import { keywordDocumentId } from "@/features/keywords/service/keyword-document-id";
import { KeywordServiceError } from "@/features/keywords/service/keyword-service-error";
import { toKeyword } from "@/features/keywords/service/to-keyword.server";
import { getServerFirestore } from "@/platform/firebase/firestore.server";
import { readFirestoreDocument } from "@/platform/firebase/read-firestore-document.server";

export async function updateKeyword(
  projectId: string,
  keywordId: string,
  input: z.input<typeof keywordUpdateInputSchema>,
): Promise<Keyword> {
  const owner = await requireOwner();
  const validated = keywordUpdateInputSchema.parse(input);
  const nextId = keywordDocumentId(
    validated.keyword,
    validated.countryCode,
    validated.languageCode,
  );
  const firestore = getServerFirestore();
  const collection = firestore
    .collection("projects")
    .doc(projectId)
    .collection("keywords");
  const currentReference = collection.doc(keywordId);
  const nextReference = collection.doc(nextId);

  const document = await firestore.runTransaction(async (transaction) => {
    await assertActiveProject(transaction, projectId, owner.uid);
    const [currentSnapshot, collisionSnapshot] = await transaction.getAll(
      currentReference,
      nextReference,
    );
    const current = readFirestoreDocument(
      keywordDocumentSchema,
      currentSnapshot,
    );
    if (!current)
      throw new KeywordServiceError("unavailable", "Keyword is unavailable.");
    if (nextId !== keywordId && collisionSnapshot.exists) {
      throw new KeywordServiceError(
        "conflict",
        "That keyword is already in the backlog.",
      );
    }
    if (current.articleId) {
      throw new KeywordServiceError(
        "assigned",
        "Assigned keywords cannot be edited.",
      );
    }
    if (current.groupId && nextId !== keywordId) {
      throw new KeywordServiceError(
        "conflict",
        "Dissolve the keyword group before changing this keyword's identity.",
      );
    }

    const next = keywordDocumentSchema.parse({
      ...current,
      ...validated,
      normalizedKeyword: normalizeKeyword(validated.keyword),
      updatedAt: Timestamp.now(),
    });
    if (nextId === keywordId) transaction.set(currentReference, next);
    else {
      transaction.create(nextReference, next);
      transaction.delete(currentReference);
    }
    return next;
  });
  return toKeyword(nextId, document);
}

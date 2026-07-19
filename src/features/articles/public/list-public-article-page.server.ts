import "server-only";

import { FieldPath, Timestamp } from "firebase-admin/firestore";

import { articleDocumentSchema } from "@/features/articles/model/article-document";
import { toArticle } from "@/features/articles/service/to-article.server";
import { getServerFirestore } from "@/platform/firebase/firestore.server";
import { readFirestoreDocument } from "@/platform/firebase/read-firestore-document.server";

type CursorValue = { updatedAt: number; articleId: string };

function decodeCursor(cursor: string | undefined): CursorValue | null {
  if (!cursor) return null;
  try {
    const value = JSON.parse(
      Buffer.from(cursor, "base64url").toString("utf8"),
    ) as Partial<CursorValue>;
    return Number.isFinite(value.updatedAt) &&
      typeof value.articleId === "string"
      ? { updatedAt: value.updatedAt!, articleId: value.articleId }
      : null;
  } catch {
    return null;
  }
}

function encodeCursor(value: CursorValue): string {
  return Buffer.from(JSON.stringify(value), "utf8").toString("base64url");
}

export async function listPublicArticlePage(input: {
  projectId: string;
  sourceLocale: string;
  topic?: string;
  cursor?: string;
  pageSize?: number;
}) {
  const pageSize = Math.min(Math.max(input.pageSize ?? 10, 1), 50);
  let query = getServerFirestore()
    .collection("projects")
    .doc(input.projectId)
    .collection("articles")
    .where("status", "==", "published")
    .where("locale", "==", input.sourceLocale);

  if (input.topic) query = query.where("topics", "array-contains", input.topic);

  let ordered = query
    .orderBy("updatedAt", "desc")
    .orderBy(FieldPath.documentId(), "desc");
  const cursor = decodeCursor(input.cursor);
  if (cursor) {
    ordered = ordered.startAfter(
      Timestamp.fromMillis(cursor.updatedAt),
      cursor.articleId,
    );
  }

  const snapshot = await ordered.limit(pageSize + 1).get();
  const documents = snapshot.docs.slice(0, pageSize);
  const items = documents.flatMap((item) => {
    const document = readFirestoreDocument(articleDocumentSchema, item);
    return document ? [toArticle(item.id, document)] : [];
  });
  const last = documents.at(-1);
  const lastDocument = last
    ? readFirestoreDocument(articleDocumentSchema, last)
    : null;

  return {
    items,
    hasNext: snapshot.docs.length > pageSize,
    nextCursor:
      snapshot.docs.length > pageSize && last && lastDocument
        ? encodeCursor({
            updatedAt: lastDocument.updatedAt.toMillis(),
            articleId: last.id,
          })
        : null,
  };
}

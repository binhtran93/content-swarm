import "server-only";

import type { DocumentSnapshot } from "firebase-admin/firestore";
import type { ZodType } from "zod";

export function readFirestoreDocument<T>(
  schema: ZodType<T>,
  snapshot: DocumentSnapshot,
): T | null {
  if (!snapshot.exists) return null;

  const result = schema.safeParse(snapshot.data());
  if (!result.success) {
    throw new Error(`Malformed Firestore document: ${snapshot.ref.path}`);
  }
  return result.data;
}

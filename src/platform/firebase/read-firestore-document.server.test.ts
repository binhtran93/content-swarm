import type { DocumentSnapshot } from "firebase-admin/firestore";
import { z } from "zod";
import { describe, expect, it } from "vitest";

import { readFirestoreDocument } from "@/platform/firebase/read-firestore-document.server";

const schema = z.object({ schemaVersion: z.literal(1), name: z.string() });

function snapshot(data: unknown, exists = true): DocumentSnapshot {
  return {
    exists,
    data: () => data,
    ref: { path: "integrationTests/document" },
  } as DocumentSnapshot;
}

describe("readFirestoreDocument", () => {
  it("returns validated data", () => {
    expect(
      readFirestoreDocument(schema, snapshot({ schemaVersion: 1, name: "ok" })),
    ).toEqual({ schemaVersion: 1, name: "ok" });
  });

  it("returns null for a missing document", () => {
    expect(
      readFirestoreDocument(schema, snapshot(undefined, false)),
    ).toBeNull();
  });

  it("rejects malformed persisted data without logging its contents", () => {
    expect(() =>
      readFirestoreDocument(schema, snapshot({ password: "do-not-print" })),
    ).toThrow("Malformed Firestore document: integrationTests/document");
  });
});

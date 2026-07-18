import { describe, expect, it } from "vitest";

import { DEPLOYED_OWNER_UID } from "@/platform/firebase/deployed-owner";
import { parseServerEnv } from "@/platform/env/server-env";

const validEnvironment = {
  FIREBASE_PROJECT_ID: "anmisoft-test",
  FIREBASE_CLIENT_EMAIL: "firebase-admin@example.test",
  FIREBASE_PRIVATE_KEY: "line-one\\nline-two",
  FIREBASE_OWNER_UID: DEPLOYED_OWNER_UID,
};

describe("parseServerEnv", () => {
  it("parses Firebase settings and restores private-key newlines", () => {
    expect(parseServerEnv(validEnvironment).FIREBASE_PRIVATE_KEY).toBe(
      "line-one\nline-two",
    );
  });

  it("reports missing Firebase settings without printing values", () => {
    expect(() => parseServerEnv({})).toThrow(
      /FIREBASE_PROJECT_ID.*FIREBASE_CLIENT_EMAIL.*FIREBASE_PRIVATE_KEY.*FIREBASE_OWNER_UID/,
    );
  });

  it("rejects an owner UID that differs from deployed rules", () => {
    expect(() =>
      parseServerEnv({ ...validEnvironment, FIREBASE_OWNER_UID: "another" }),
    ).toThrow("Invalid server configuration. Check: FIREBASE_OWNER_UID");
  });
});

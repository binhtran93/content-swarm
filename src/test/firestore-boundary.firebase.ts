import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import { readFile } from "node:fs/promises";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { DEPLOYED_OWNER_UID } from "@/platform/firebase/deployed-owner";
import { getServerFirestore } from "@/platform/firebase/firestore.server";

let environment: RulesTestEnvironment;

describe("Firestore owner boundary", () => {
  beforeAll(async () => {
    const [host, port] = (process.env.FIRESTORE_EMULATOR_HOST ?? "").split(":");
    if (!host || !port) throw new Error("Firestore emulator is required.");

    environment = await initializeTestEnvironment({
      projectId: "anmisoft-platform-test",
      firestore: {
        host,
        port: Number(port),
        rules: await readFile("firestore.rules", "utf8"),
      },
    });
    await environment.clearFirestore();
    await environment.withSecurityRulesDisabled(async (context) => {
      await context.firestore().doc("projects/owner-project").set({
        ownerId: DEPLOYED_OWNER_UID,
        schemaVersion: 1,
      });
      await context
        .firestore()
        .doc("projects/owner-project/integrationTests/foundation")
        .set({ ok: true });
      await context
        .firestore()
        .doc("projects/owner-project/waitlistSignups/example")
        .set({ email: "person@example.test" });
    });
  });

  afterAll(async () => {
    await environment.cleanup();
  });

  it("allows the owner to read owned data but denies browser writes", async () => {
    const firestore = environment
      .authenticatedContext(DEPLOYED_OWNER_UID)
      .firestore();
    await assertSucceeds(firestore.doc("projects/owner-project").get());
    await assertSucceeds(
      firestore.doc("projects/owner-project/integrationTests/foundation").get(),
    );
    await assertFails(
      firestore
        .doc("projects/owner-project/integrationTests/write")
        .set({ ok: true }),
    );
  });

  it("denies private reads to anonymous and non-owner clients", async () => {
    await assertFails(
      environment
        .unauthenticatedContext()
        .firestore()
        .doc("projects/owner-project")
        .get(),
    );
    await assertFails(
      environment
        .unauthenticatedContext()
        .firestore()
        .doc("projects/owner-project/waitlistSignups/example")
        .get(),
    );
  });

  it("allows only the owner to read server-created waitlist records", async () => {
    const owner = environment
      .authenticatedContext(DEPLOYED_OWNER_UID)
      .firestore();
    await assertSucceeds(
      owner.doc("projects/owner-project/waitlistSignups/example").get(),
    );
    await assertFails(
      owner
        .doc("projects/owner-project/waitlistSignups/browser-write")
        .set({ email: "blocked@example.test" }),
    );
    await assertFails(
      environment
        .authenticatedContext("another-user")
        .firestore()
        .doc("projects/owner-project")
        .get(),
    );
  });

  it("connects through the typed server-only Firestore boundary", async () => {
    const reference = getServerFirestore().doc(
      "platformIntegrationTests/foundation",
    );
    await reference.set({ isolatedProject: "anmisoft-platform-test" });
    expect((await reference.get()).data()).toEqual({
      isolatedProject: "anmisoft-platform-test",
    });
    await reference.delete();
  });
});

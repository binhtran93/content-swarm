import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "server-only": path.resolve(__dirname, "src/test/server-only.ts"),
    },
  },
  test: {
    environment: "node",
    include: ["src/test/**/*.firebase.ts"],
    env: {
      FIREBASE_PROJECT_ID: "anmisoft-platform-test",
      FIREBASE_CLIENT_EMAIL: "firebase-admin@example.test",
      FIREBASE_PRIVATE_KEY: "not-used-by-emulator",
      FIREBASE_OWNER_UID: "imKwXiXCXPcUeGrz12yAuublooV2",
    },
  },
});

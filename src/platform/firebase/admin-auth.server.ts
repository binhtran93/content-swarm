import "server-only";

import { getAuth, type Auth } from "firebase-admin/auth";

import { getAdminApp } from "@/platform/firebase/admin-app.server";

export function getAdminAuth(): Auth {
  return getAuth(getAdminApp());
}

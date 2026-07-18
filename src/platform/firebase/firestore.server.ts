import "server-only";

import { getFirestore, type Firestore } from "firebase-admin/firestore";

import { getAdminApp } from "@/platform/firebase/admin-app.server";

export function getServerFirestore(): Firestore {
  return getFirestore(getAdminApp());
}

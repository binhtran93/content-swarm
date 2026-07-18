"use client";

import { signOut } from "firebase/auth";

import { getClientAuth } from "@/features/auth/client/get-client-auth";

export async function signOutOwner(): Promise<void> {
  await fetch("/api/auth/session", { method: "DELETE" });
  await signOut(getClientAuth());
}

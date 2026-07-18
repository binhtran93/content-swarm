import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

import { createOwnerSession } from "@/features/auth/server/create-owner-session.server";
import { ownerSessionConfig } from "@/features/auth/server/session-config.server";

const requestSchema = z.object({ idToken: z.string().min(1).max(10_000) });

export async function POST(request: Request) {
  try {
    const body = requestSchema.parse(await request.json());
    await createOwnerSession(body.idToken);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unable to sign in." }, { status: 401 });
  }
}

export async function DELETE() {
  (await cookies()).delete(ownerSessionConfig.cookieName);
  return NextResponse.json({ ok: true });
}

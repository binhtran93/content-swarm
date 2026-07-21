import "server-only";

import { OAuth2Client } from "google-auth-library";
import { z } from "zod";

const environmentSchema = z.object({
  ARTICLE_AUTOMATION_OIDC_AUDIENCE: z.url(),
  ARTICLE_AUTOMATION_SERVICE_ACCOUNT: z.email(),
});

export async function verifyArticleAutomationScheduler(
  authorization: string | null,
): Promise<void> {
  const token = authorization?.match(/^Bearer (.+)$/)?.[1];
  if (!token) throw new Error("Scheduler authentication required.");
  const environment = environmentSchema.parse(process.env);
  const ticket = await new OAuth2Client().verifyIdToken({
    idToken: token,
    audience: environment.ARTICLE_AUTOMATION_OIDC_AUDIENCE,
  });
  const payload = ticket.getPayload();
  if (
    payload?.email !== environment.ARTICLE_AUTOMATION_SERVICE_ACCOUNT ||
    payload.email_verified !== true ||
    !["accounts.google.com", "https://accounts.google.com"].includes(
      payload.iss ?? "",
    )
  )
    throw new Error("Scheduler authentication rejected.");
}

import { z } from "zod";

const hostnameLabel = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/;

export function normalizeCompetitorDomain(value: string): string {
  const input = value.trim();
  if (!input) throw new Error("Competitor domain is required.");

  const scheme = input.match(/^([a-z][a-z0-9+.-]*):\/\//i)?.[1];
  if (scheme && !/^https?$/i.test(scheme)) {
    throw new Error("Use an HTTP(S) website URL or domain.");
  }

  let url: URL;
  try {
    url = new URL(scheme ? input : `https://${input}`);
  } catch {
    throw new Error("Enter a valid competitor domain or website URL.");
  }

  if (url.username || url.password) {
    throw new Error("Enter a website without credentials.");
  }

  const hostname = url.hostname.toLocaleLowerCase("en-US").replace(/\.$/, "");
  const labels = hostname.split(".");
  if (
    hostname.length > 253 ||
    labels.length < 2 ||
    labels.some((label) => !hostnameLabel.test(label))
  ) {
    throw new Error("Enter a valid competitor domain or website URL.");
  }

  return hostname;
}

export const competitorDomainSchema = z.string().transform((value, context) => {
  try {
    return normalizeCompetitorDomain(value);
  } catch (error) {
    context.addIssue({
      code: "custom",
      message:
        error instanceof Error
          ? error.message
          : "Enter a valid competitor domain or website URL.",
    });
    return z.NEVER;
  }
});

export const competitorDomainsSchema = z
  .array(competitorDomainSchema)
  .transform((values) => [...new Set(values)])
  .pipe(
    z.array(z.string()).max(100, "Use no more than 100 competitor domains."),
  );

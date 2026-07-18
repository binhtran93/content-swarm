import { createHash } from "node:crypto";

import { normalizeKeyword } from "@/features/keywords/model/keyword-input";

export function keywordDocumentId(
  keyword: string,
  countryCode: string,
  languageCode: string,
): string {
  const identity = `${normalizeKeyword(keyword)}\u0000${countryCode.toUpperCase()}\u0000${languageCode.toLowerCase()}`;
  return `kw_${createHash("sha256").update(identity).digest("hex")}`;
}

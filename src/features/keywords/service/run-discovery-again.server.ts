import "server-only";

import { Timestamp } from "firebase-admin/firestore";

import { requireOwner } from "@/features/auth/server/require-owner.server";
import {
  discoveryRequestSchema,
  type DiscoveryRequest,
} from "@/features/keywords/model/discovery-input";
import { keywordDiscoveryDocumentSchema } from "@/features/keywords/model/keyword-discovery-document";
import type { KeywordDiscovery } from "@/features/keywords/model/keyword-discovery";
import { fetchKeywordDiscovery } from "@/features/keywords/provider/fetch-keyword-discovery.server";
import { assertActiveProject } from "@/features/keywords/service/assert-active-project.server";
import {
  discoveryRequestKey,
  normalizeDiscoveryRequest,
} from "@/features/keywords/service/discovery-request-key";
import { toKeywordDiscovery } from "@/features/keywords/service/to-keyword-discovery.server";
import { getProjectContext } from "@/features/projects/service/get-project-context.server";
import { getServerFirestore } from "@/platform/firebase/firestore.server";

export async function runDiscoveryAgain(
  projectId: string,
  input: DiscoveryRequest,
): Promise<KeywordDiscovery> {
  const owner = await requireOwner();
  await getProjectContext(projectId);
  const request = discoveryRequestSchema.parse(input);
  const normalized = normalizeDiscoveryRequest(request);
  const results = await fetchKeywordDiscovery(request);
  const firestore = getServerFirestore();
  const reference = firestore
    .collection("projects")
    .doc(projectId)
    .collection("keywordDiscoveries")
    .doc();
  const document = keywordDiscoveryDocumentSchema.parse({
    schemaVersion: 1,
    requestKey: discoveryRequestKey(request),
    ...normalized,
    results,
    createdAt: Timestamp.now(),
  });
  await firestore.runTransaction(async (transaction) => {
    await assertActiveProject(transaction, projectId, owner.uid);
    transaction.create(reference, document);
  });
  return toKeywordDiscovery(reference.id, document);
}

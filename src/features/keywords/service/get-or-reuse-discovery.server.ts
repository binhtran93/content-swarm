import "server-only";

import type { DiscoveryRequest } from "@/features/keywords/model/discovery-input";
import { keywordDiscoveryDocumentSchema } from "@/features/keywords/model/keyword-discovery-document";
import type { KeywordDiscovery } from "@/features/keywords/model/keyword-discovery";
import { discoveryRequestKey } from "@/features/keywords/service/discovery-request-key";
import { runDiscoveryAgain } from "@/features/keywords/service/run-discovery-again.server";
import { toKeywordDiscovery } from "@/features/keywords/service/to-keyword-discovery.server";
import { getProjectContext } from "@/features/projects/service/get-project-context.server";
import { getServerFirestore } from "@/platform/firebase/firestore.server";
import { readFirestoreDocument } from "@/platform/firebase/read-firestore-document.server";

const activeRequests = new Map<string, Promise<KeywordDiscovery>>();

export async function getOrReuseDiscovery(
  projectId: string,
  request: DiscoveryRequest,
): Promise<{ discovery: KeywordDiscovery; reused: boolean }> {
  await getProjectContext(projectId);
  const requestKey = discoveryRequestKey(request);
  const snapshot = await getServerFirestore()
    .collection("projects")
    .doc(projectId)
    .collection("keywordDiscoveries")
    .where("requestKey", "==", requestKey)
    .limit(1)
    .get();
  const saved = snapshot.docs[0];
  if (saved) {
    const document = readFirestoreDocument(
      keywordDiscoveryDocumentSchema,
      saved,
    );
    if (document)
      return {
        discovery: toKeywordDiscovery(saved.id, document),
        reused: true,
      };
  }

  const activeKey = `${projectId}:${requestKey}`;
  const existing = activeRequests.get(activeKey);
  if (existing) return { discovery: await existing, reused: true };
  const run = runDiscoveryAgain(projectId, request).finally(() =>
    activeRequests.delete(activeKey),
  );
  activeRequests.set(activeKey, run);
  return { discovery: await run, reused: false };
}

import { redirect } from "next/navigation";

export default async function LegacyPromptStudioPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  redirect(`/admin/projects/${projectId}/tools/stickman-studio`);
}

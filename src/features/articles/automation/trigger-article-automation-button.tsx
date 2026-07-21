import { PendingSubmitButton } from "@/backoffice/components/ui/pending-submit-button";
import { triggerArticleAutomationAction } from "@/features/articles/automation/trigger-article-automation-action.server";

export function TriggerArticleAutomationButton({
  projectId,
}: {
  projectId: string;
}) {
  return (
    <form action={triggerArticleAutomationAction}>
      <input name="projectId" type="hidden" value={projectId} />
      <PendingSubmitButton
        className="btn btn-outline btn-sm"
        label="Run automation"
        pendingLabel="Creating article…"
      />
    </form>
  );
}

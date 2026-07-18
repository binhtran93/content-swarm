import { PageTitle } from "@/backoffice/components/ui/page-title";
import { CreateProjectForm } from "@/features/projects/backoffice/create-project-form";

export default function NewProjectPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageTitle
        description="Create a permanent product workspace for editorial work."
        title="New project"
      />
      <section className="card bg-base-100 border-base-300 border shadow-sm">
        <div className="card-body">
          <CreateProjectForm />
        </div>
      </section>
    </div>
  );
}

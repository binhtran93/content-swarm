import { PageTitle } from "@/backoffice/components/ui/page-title";

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageTitle
        description="Your publishing workspaces will appear here."
        title="Projects"
      />
      <section className="card bg-base-100 border-base-300 border shadow-sm">
        <div className="card-body">
          <p className="text-base-content/60">
            Project management is the next product increment. No placeholder
            records have been created.
          </p>
        </div>
      </section>
    </div>
  );
}

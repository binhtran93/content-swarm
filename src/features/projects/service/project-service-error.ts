export class ProjectServiceError extends Error {
  constructor(
    public readonly code: "conflict" | "unavailable" | "archived",
    message: string,
  ) {
    super(message);
    this.name = "ProjectServiceError";
  }
}

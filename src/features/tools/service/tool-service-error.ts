export class ToolServiceError extends Error {
  constructor(
    public readonly code:
      "disabled" | "invalid" | "not-found" | "processing" | "failed",
    message: string,
  ) {
    super(message);
    this.name = "ToolServiceError";
  }
}

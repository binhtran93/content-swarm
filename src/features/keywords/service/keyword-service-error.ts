export class KeywordServiceError extends Error {
  constructor(
    public readonly code:
      | "unavailable"
      | "archived"
      | "conflict"
      | "invalid-group"
      | "invalid-selection"
      | "assigned"
      | "provider",
    message: string,
  ) {
    super(message);
    this.name = "KeywordServiceError";
  }
}

export class ArticleServiceError extends Error {
  constructor(
    public readonly code:
      "unavailable" | "conflict" | "invalid" | "provider" | "archived",
    message: string,
  ) {
    super(message);
    this.name = "ArticleServiceError";
  }
}

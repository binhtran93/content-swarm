export class VideoServiceError extends Error {
  constructor(
    public readonly code: "invalid" | "unavailable" | "provider" | "render",
    message: string,
  ) {
    super(message);
    this.name = "VideoServiceError";
  }
}

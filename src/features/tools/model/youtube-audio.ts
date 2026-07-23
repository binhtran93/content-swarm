import { z } from "zod";

export const youtubeAudioExtractionIdSchema = z.uuid();

export const youtubeAudioUrlSchema = z
  .string()
  .trim()
  .min(1, "Enter a YouTube video URL.")
  .max(2_048, "The YouTube URL is too long.")
  .transform((value, context) => {
    let url: URL;
    try {
      url = new URL(value);
    } catch {
      context.addIssue({
        code: "custom",
        message: "Enter a valid YouTube video URL.",
      });
      return z.NEVER;
    }

    if (
      url.protocol !== "https:" ||
      url.username ||
      url.password ||
      !isAllowedYoutubeHost(url.hostname) ||
      isPlaylistPage(url)
    ) {
      context.addIssue({
        code: "custom",
        message: "Enter a public HTTPS YouTube video URL, not a playlist.",
      });
      return z.NEVER;
    }

    return url.toString();
  });

function isAllowedYoutubeHost(hostname: string) {
  const host = hostname.toLowerCase().replace(/\.$/, "");
  return (
    host === "youtu.be" ||
    host === "youtube.com" ||
    host === "www.youtube.com" ||
    host === "m.youtube.com" ||
    host === "music.youtube.com" ||
    host === "youtube-nocookie.com" ||
    host === "www.youtube-nocookie.com"
  );
}

function isPlaylistPage(url: URL) {
  const path = url.pathname.replace(/\/+$/, "") || "/";
  if (path === "/playlist") return true;
  if (url.hostname.toLowerCase().replace(/\.$/, "") === "youtu.be") {
    return path === "/";
  }
  return !(
    path === "/watch" ||
    path.startsWith("/shorts/") ||
    path.startsWith("/live/") ||
    path.startsWith("/embed/")
  );
}

export type YoutubeAudioExtractionResponse = {
  extractionId: string;
  fileName: string;
  downloadUrl: string;
};

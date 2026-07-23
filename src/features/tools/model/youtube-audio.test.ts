import { describe, expect, it } from "vitest";

import { youtubeAudioUrlSchema } from "@/features/tools/model/youtube-audio";

describe("youtubeAudioUrlSchema", () => {
  it.each([
    "https://www.youtube.com/watch?v=video123",
    "https://music.youtube.com/watch?v=video123",
    "https://youtu.be/video123",
    "https://m.youtube.com/shorts/video123",
    "https://www.youtube.com/live/video123",
    "https://www.youtube-nocookie.com/embed/video123",
    "https://www.youtube.com/watch?v=video123&list=playlist123",
  ])("accepts a supported single-video URL: %s", (url) => {
    expect(youtubeAudioUrlSchema.parse(url)).toBe(url);
  });

  it.each([
    "http://www.youtube.com/watch?v=video123",
    "https://youtube.com.evil.test/watch?v=video123",
    "https://user:password@youtube.com/watch?v=video123",
    "https://www.youtube.com/playlist?list=playlist123",
    "https://youtu.be/",
    "https://www.youtube.com/channel/example",
    "not a URL",
  ])("rejects an unsupported or unsafe URL: %s", (url) => {
    expect(() => youtubeAudioUrlSchema.parse(url)).toThrow();
  });
});

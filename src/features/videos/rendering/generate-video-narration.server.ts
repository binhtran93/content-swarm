import "server-only";

import path from "node:path";
import textToSpeech from "@google-cloud/text-to-speech";

import type { QuickListVideoProposal } from "@/features/videos/model/quick-list-video";
import {
  toDataUrl,
  videoRelativeDirectory,
  writeVideoArtifact,
} from "@/features/videos/rendering/local-video-workspace.server";
import { VideoServiceError } from "@/features/videos/service/video-service-error";
import { getServerEnv } from "@/platform/env/server-env";

function speechLocale(locale: string) {
  if (locale === "ar-SA") return "ar-XA";
  if (locale === "zh-Hant-TW") return "cmn-TW";
  return locale;
}

export async function generateVideoNarration({
  projectId,
  videoId,
  locale,
  voiceGender,
  proposal,
}: {
  projectId: string;
  videoId: string;
  locale: string;
  voiceGender: "NEUTRAL" | "FEMALE" | "MALE";
  proposal: QuickListVideoProposal;
}) {
  const environment = getServerEnv();
  const client = new textToSpeech.TextToSpeechClient({
    credentials: {
      client_email: environment.FIREBASE_CLIENT_EMAIL,
      private_key: environment.FIREBASE_PRIVATE_KEY,
    },
    projectId: environment.FIREBASE_PROJECT_ID,
  });
  const scripts = [
    proposal.hook.narration,
    ...proposal.points.map((point) => point.narration),
    proposal.cta.narration,
  ];
  try {
    return await Promise.all(
      scripts.map(async (text, index) => {
        const [response] = await client.synthesizeSpeech({
          input: { text },
          voice: {
            languageCode: speechLocale(locale),
            ssmlGender: voiceGender,
          },
          audioConfig: {
            audioEncoding: "MP3",
            speakingRate: 1.06,
          },
        });
        if (!response.audioContent)
          throw new Error("Text-to-speech returned no audio.");
        const contents = Buffer.from(response.audioContent as Uint8Array);
        const relativePath = path.join(
          videoRelativeDirectory(projectId, videoId),
          "audio",
          `${index}.mp3`,
        );
        await writeVideoArtifact(relativePath, contents);
        return toDataUrl("audio/mpeg", contents);
      }),
    );
  } catch {
    throw new VideoServiceError(
      "provider",
      "Narration could not be generated. Check Google Cloud Text-to-Speech configuration.",
    );
  } finally {
    await client.close();
  }
}

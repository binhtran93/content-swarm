import "server-only";

import { z } from "zod";

import type {
  CreateQuickListVideoInput,
  QuickListVideoProposal,
} from "@/features/videos/model/quick-list-video";
import { quickListVideoProposalSchema } from "@/features/videos/model/quick-list-video";
import { quickListVideoPrompt } from "@/features/videos/prompts/quick-list-video-prompt";
import { generateVideoAi } from "@/features/videos/provider/generate-video-ai.server";
import { getProjectContext } from "@/features/projects/service/get-project-context.server";

const generatedSchema = quickListVideoProposalSchema.omit({ references: true });

function normalizeHashtag(value: string) {
  const compact = value.trim().replace(/\s+/g, "");
  return compact.startsWith("#") ? compact : `#${compact}`;
}

export async function generateVideoProposal(
  projectId: string,
  input: CreateQuickListVideoInput,
  imageCount: number,
): Promise<QuickListVideoProposal> {
  const project = await getProjectContext(projectId);
  const generation = await generateVideoAi(
    quickListVideoPrompt.system,
    JSON.stringify({
      locale: input.locale,
      topic: input.prompt,
      availableImages: imageCount,
      project:
        input.sourceMode === "project"
          ? {
              name: project.name,
              description: project.description,
              topics: project.topics,
            }
          : null,
    }),
    generatedSchema,
  );
  return quickListVideoProposalSchema.parse({
    ...generation.output,
    hashtags: generation.output.hashtags.map(normalizeHashtag),
    references: generation.references,
  });
}

export const generatedQuickListVideoSchema = generatedSchema;

export type GeneratedQuickListVideo = z.infer<typeof generatedSchema>;

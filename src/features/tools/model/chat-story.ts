import { z } from "zod";

export const chatStoryConfig = {
  fps: 30,
  width: 1080,
  height: 1920,
  minimumMessages: 20,
  maximumMessages: 30,
  minimumRuntimeMs: 40_000,
  maximumRuntimeMs: 65_000,
  endingHoldMs: 1_500,
} as const;

const participantSchema = <TId extends "left" | "right">(id: TId) =>
  z.object({
    id: z.literal(id),
    displayName: z.string().trim().min(1).max(24),
  });

export const chatStoryMessageSchema = z.object({
  id: z.string().trim().min(1).max(40),
  senderId: z.enum(["left", "right"]),
  text: z.string().trim().min(1).max(120),
  waitMs: z.number().int().min(200).max(2_000),
  typingMs: z.number().int().min(400).max(3_000),
  sound: z.enum(["incoming", "outgoing", "reveal"]),
});

export const chatStoryDraftSchema = z.object({
  title: z.string().trim().min(1).max(80),
  otherPerson: z.string().trim().min(1).max(24),
  messages: z
    .array(
      z.object({
        from: z.enum(["them", "me"]),
        text: z.string().trim().min(1).max(120),
      }),
    )
    .min(chatStoryConfig.minimumMessages)
    .max(chatStoryConfig.maximumMessages),
});

export const chatStoryScriptSchema = z
  .object({
    version: z.literal(1),
    title: z.string().trim().min(1).max(80),
    participants: z.tuple([
      participantSchema("left"),
      participantSchema("right"),
    ]),
    messages: z
      .array(chatStoryMessageSchema)
      .min(chatStoryConfig.minimumMessages)
      .max(chatStoryConfig.maximumMessages),
  })
  .superRefine((script, context) => {
    const ids = new Set<string>();
    script.messages.forEach((message, index) => {
      if (ids.has(message.id)) {
        context.addIssue({
          code: "custom",
          message: `Message ID "${message.id}" is duplicated.`,
          path: ["messages", index, "id"],
        });
      }
      ids.add(message.id);
    });

    const runtimeMs = chatStoryRuntimeMs(script);
    if (
      runtimeMs < chatStoryConfig.minimumRuntimeMs ||
      runtimeMs > chatStoryConfig.maximumRuntimeMs
    ) {
      context.addIssue({
        code: "custom",
        message: `The conversation must run for 40–65 seconds; this script runs for ${Math.round(runtimeMs / 1_000)} seconds.`,
        path: ["messages"],
      });
    }
  });

export type ChatStoryScript = z.infer<typeof chatStoryScriptSchema>;
export type ChatStoryMessage = z.infer<typeof chatStoryMessageSchema>;
export type ChatStoryDraft = z.infer<typeof chatStoryDraftSchema>;

export type ChatStoryTimelineMessage = ChatStoryMessage & {
  typingStartFrame: number;
  revealFrame: number;
};

export type ChatStoryTimeline = {
  messages: ChatStoryTimelineMessage[];
  durationInFrames: number;
};

export function millisecondsToFrames(milliseconds: number) {
  return Math.max(1, Math.round((milliseconds / 1_000) * chatStoryConfig.fps));
}

export function chatStoryRuntimeMs(script: Pick<ChatStoryScript, "messages">) {
  return (
    script.messages.reduce(
      (total, message) => total + message.waitMs + message.typingMs,
      0,
    ) + chatStoryConfig.endingHoldMs
  );
}

export function buildChatStoryTimeline(
  script: Pick<ChatStoryScript, "messages">,
): ChatStoryTimeline {
  let cursor = 0;
  const messages = script.messages.map((message) => {
    const typingStartFrame = cursor + millisecondsToFrames(message.waitMs);
    const revealFrame =
      typingStartFrame + millisecondsToFrames(message.typingMs);
    cursor = revealFrame;
    return { ...message, typingStartFrame, revealFrame };
  });

  return {
    messages,
    durationInFrames:
      cursor + millisecondsToFrames(chatStoryConfig.endingHoldMs),
  };
}

export function getOutgoingDraftText({
  frame,
  message,
}: {
  frame: number;
  message: ChatStoryTimelineMessage;
}) {
  if (frame < message.typingStartFrame || frame >= message.revealFrame) {
    return "";
  }

  const typingFrames = Math.max(
    1,
    message.revealFrame - message.typingStartFrame,
  );
  const elapsedFrames = frame - message.typingStartFrame + 1;
  const characterCount = Math.min(
    message.text.length,
    Math.ceil((elapsedFrames / typingFrames) * message.text.length),
  );

  return message.text.slice(0, characterCount);
}

export function buildChatStoryScript(draft: ChatStoryDraft): ChatStoryScript {
  const targetMessageRuntimeMs = 48_500;
  const rawTiming = draft.messages.map((message) => ({
    waitMs: 450,
    typingMs: clamp(550 + message.text.length * 35, 650, 2_000),
  }));
  const rawRuntimeMs = rawTiming.reduce(
    (total, timing) => total + timing.waitMs + timing.typingMs,
    0,
  );
  const timingScale = targetMessageRuntimeMs / rawRuntimeMs;

  return chatStoryScriptSchema.parse({
    version: 1,
    title: draft.title,
    participants: [
      { id: "left", displayName: draft.otherPerson },
      { id: "right", displayName: "Me" },
    ],
    messages: draft.messages.map((message, index) => ({
      id: `m${String(index + 1).padStart(2, "0")}`,
      senderId: message.from === "me" ? "right" : "left",
      text: message.text,
      waitMs: clamp(
        Math.round(rawTiming[index].waitMs * timingScale),
        200,
        2_000,
      ),
      typingMs: clamp(
        Math.round(rawTiming[index].typingMs * timingScale),
        400,
        3_000,
      ),
      sound:
        index === draft.messages.length - 1
          ? "reveal"
          : message.from === "me"
            ? "outgoing"
            : "incoming",
    })),
  });
}

export function parseChatStoryScript(input: string) {
  let parsed: unknown;
  try {
    parsed = JSON.parse(input);
  } catch {
    throw new Error(
      "Paste the raw JSON response from ChatGPT without markdown fences or commentary.",
    );
  }

  const legacyResult = chatStoryScriptSchema.safeParse(parsed);
  if (legacyResult.success) return legacyResult.data;

  const result = chatStoryDraftSchema.safeParse(parsed);
  if (result.success) return buildChatStoryScript(result.data);

  const issue = result.error.issues[0];
  const location = issue?.path.length ? `${issue.path.join(".")}: ` : "";
  throw new Error(`${location}${issue?.message ?? "Check the chat script."}`);
}

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

import { Composition, registerRoot } from "remotion";

import {
  buildChatStoryTimeline,
  chatStoryConfig,
  chatStoryScriptSchema,
  type ChatStoryScript,
} from "@/features/tools/model/chat-story";
import { ChatStoryComposition } from "@/features/tools/video/chat-story-composition";

const placeholderMessages = Array.from({ length: 20 }, (_, index) => ({
  id: `m${index + 1}`,
  senderId: index % 2 ? ("right" as const) : ("left" as const),
  text: `Message ${index + 1}`,
  waitMs: 500,
  typingMs: 1_500,
  sound: index === 18 ? ("reveal" as const) : ("incoming" as const),
}));

export const defaultChatStoryScript: ChatStoryScript =
  chatStoryScriptSchema.parse({
    version: 1,
    title: "Chat story",
    participants: [
      { id: "left", displayName: "Maya" },
      { id: "right", displayName: "Me" },
    ],
    messages: placeholderMessages,
  });

export function RemotionRoot() {
  return (
    <Composition
      calculateMetadata={({ props }) => ({
        durationInFrames: buildChatStoryTimeline(props.script).durationInFrames,
      })}
      component={ChatStoryComposition}
      defaultProps={{ reducedMotion: false, script: defaultChatStoryScript }}
      durationInFrames={
        buildChatStoryTimeline(defaultChatStoryScript).durationInFrames
      }
      fps={chatStoryConfig.fps}
      height={chatStoryConfig.height}
      id="ChatStory"
      width={chatStoryConfig.width}
    />
  );
}

registerRoot(RemotionRoot);

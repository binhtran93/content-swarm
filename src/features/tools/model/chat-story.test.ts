import { describe, expect, it } from "vitest";

import {
  buildChatStoryTimeline,
  chatStoryRuntimeMs,
  chatStoryScriptSchema,
  getOutgoingDraftText,
  parseChatStoryScript,
} from "@/features/tools/model/chat-story";

function validScript() {
  return {
    version: 1 as const,
    title: "The wrong number",
    participants: [
      { id: "left" as const, displayName: "Maya" },
      { id: "right" as const, displayName: "Noah" },
    ] as const,
    messages: Array.from({ length: 20 }, (_, index) => ({
      id: `m${index + 1}`,
      senderId: index % 2 ? ("right" as const) : ("left" as const),
      text: `Message ${index + 1}`,
      waitMs: 500,
      typingMs: 1_500,
      sound: index === 18 ? ("reveal" as const) : ("incoming" as const),
    })),
  };
}

describe("chat story contract", () => {
  it("builds a deterministic frame timeline", () => {
    const script = chatStoryScriptSchema.parse(validScript());
    const timeline = buildChatStoryTimeline(script);

    expect(timeline.messages[0]).toMatchObject({
      typingStartFrame: 15,
      revealFrame: 60,
    });
    expect(timeline.messages[1]).toMatchObject({
      typingStartFrame: 75,
      revealFrame: 120,
    });
    expect(timeline.durationInFrames).toBe(1_245);
  });

  it("types an outgoing message progressively and clears it when sent", () => {
    const script = chatStoryScriptSchema.parse(validScript());
    const message = buildChatStoryTimeline(script).messages[1];

    expect(getOutgoingDraftText({ frame: 74, message })).toBe("");
    expect(getOutgoingDraftText({ frame: 75, message })).toBe("M");
    expect(getOutgoingDraftText({ frame: 97, message })).toBe("Messa");
    expect(getOutgoingDraftText({ frame: 119, message })).toBe("Message 2");
    expect(getOutgoingDraftText({ frame: 120, message })).toBe("");
  });

  it("turns minimal AI output into a complete timed script", () => {
    const script = parseChatStoryScript(
      JSON.stringify({
        title: "The wrong number",
        otherPerson: "Maya",
        messages: Array.from({ length: 20 }, (_, index) => ({
          from: index % 2 ? "me" : "them",
          text: `Message ${index + 1}`,
        })),
      }),
    );

    expect(script.participants).toEqual([
      { id: "left", displayName: "Maya" },
      { id: "right", displayName: "Me" },
    ]);
    expect(script.messages[0]).toMatchObject({
      id: "m01",
      senderId: "left",
      sound: "incoming",
    });
    expect(script.messages[1]).toMatchObject({
      id: "m02",
      senderId: "right",
      sound: "outgoing",
    });
    expect(script.messages.at(-1)?.sound).toBe("reveal");
    expect(chatStoryRuntimeMs(script)).toBeGreaterThanOrEqual(49_500);
    expect(chatStoryRuntimeMs(script)).toBeLessThanOrEqual(50_500);
  });

  it("rejects duplicate IDs", () => {
    const script = validScript();
    script.messages[1].id = "m1";
    expect(() => chatStoryScriptSchema.parse(script)).toThrow(/duplicated/);
  });

  it("repairs smart quotes and unescaped dialogue quotes", () => {
    const messages = Array.from({ length: 20 }, (_, index) =>
      index === 19
        ? `{“from”:“them”,“text”:“Said "I can do whatever I want" and started yelling”}`
        : `{“from”:“${index % 2 ? "me" : "them"}”,“text”:“Message ${index + 1}”}`,
    ).join(",");
    const script = parseChatStoryScript(
      `{“title”:“The Grass Outside My Window”,“otherPerson”:“Nina”,“messages”:[${messages}]}`,
    );

    expect(script.title).toBe("The Grass Outside My Window");
    expect(script.participants[0].displayName).toBe("Nina");
    expect(script.messages.at(-1)?.text).toBe(
      'Said "I can do whatever I want" and started yelling',
    );
  });

  it("accepts markdown-wrapped JSON and still validates its structure", () => {
    expect(() => parseChatStoryScript("```json\n{}\n```")).toThrow(
      /title.*expected string/i,
    );
  });
});

import { describe, expect, it } from "vitest";

import {
  parseStickmanStoryboardScript,
  stickmanFinalQuestionStorageKey,
} from "@/features/tools/model/stickman-storyboard-script";

describe("stickman storyboard JSON", () => {
  it("parses scenes and the separate final question", () => {
    expect(
      parseStickmanStoryboardScript(
        JSON.stringify({
          scenes: [
            {
              scene: 1,
              caption: "I discovered his hidden porn struggle",
              visual: "A woman looks toward a blurred screen",
            },
          ],
          finalQuestion: "Can you forgive yourself and keep fighting?",
        }),
      ),
    ).toMatchObject({
      scenes: [{ scene: 1, caption: "I discovered his hidden porn struggle" }],
      finalQuestion: "Can you forgive yourself and keep fighting?",
    });
  });

  it("rejects voiceover, nonsequential scenes, and invalid questions", () => {
    expect(() =>
      parseStickmanStoryboardScript(
        JSON.stringify({
          scenes: [
            {
              scene: 2,
              caption: "A caption",
              visual: "A scene",
              voiceover: "Unwanted narration",
            },
          ],
          finalQuestion: "Not a question",
        }),
      ),
    ).toThrow();
  });

  it("uses Project-scoped browser storage keys", () => {
    expect(stickmanFinalQuestionStorageKey("urge-zero")).not.toBe(
      stickmanFinalQuestionStorageKey("subiq"),
    );
  });
});

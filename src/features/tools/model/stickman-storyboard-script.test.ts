import { describe, expect, it } from "vitest";

import { parseStickmanStoryboardScript } from "@/features/tools/model/stickman-storyboard-script";

describe("stickman storyboard JSON", () => {
  it("parses illustrated scenes", () => {
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
        }),
      ),
    ).toMatchObject({
      scenes: [{ scene: 1, caption: "I discovered his hidden porn struggle" }],
    });
  });

  it("parses a copied fenced JSON code block", () => {
    const json = JSON.stringify({
      scenes: [
        {
          scene: 1,
          caption: "I FOUND THE TRUTH",
          visual: "A shocked stick figure stands in a doorway",
        },
      ],
    });

    expect(
      parseStickmanStoryboardScript(`\`\`\`json\n${json}\n\`\`\``),
    ).toMatchObject({
      scenes: [{ caption: "I FOUND THE TRUTH" }],
    });
  });

  it("rejects voiceover and nonsequential scenes", () => {
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
        }),
      ),
    ).toThrow();
  });

  it("rejects the removed final-question field", () => {
    expect(() =>
      parseStickmanStoryboardScript(
        JSON.stringify({
          scenes: [{ scene: 1, caption: "I faced it", visual: "A scene" }],
          finalQuestion: "Could you face it?",
        }),
      ),
    ).toThrow();
  });
});

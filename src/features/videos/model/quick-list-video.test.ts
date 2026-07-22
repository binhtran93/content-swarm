import { describe, expect, it } from "vitest";

import {
  quickListDurationFrames,
  quickListTimeline,
  quickListVideoProposalSchema,
} from "@/features/videos/model/quick-list-video";

const validProposal = {
  title: "Three practical checks",
  hook: {
    onScreenText: "3 checks before you buy",
    narration: "Run these three checks before you buy.",
  },
  points: [1, 2, 3].map((number) => ({
    heading: `Check ${number}`,
    body: "A short, useful explanation.",
    narration: `Check ${number}. Here is the useful explanation.`,
  })),
  cta: {
    onScreenText: "Save this checklist",
    narration: "Save this checklist for later.",
  },
  coverText: "3 checks before you buy",
  caption: "A useful checklist.",
  hashtags: ["#checklist", "#tips"],
  musicMood: "Confident and curious",
  references: [{ title: "Primary source", url: "https://example.com" }],
};

describe("quickListVideoProposalSchema", () => {
  it("accepts the one supported three-point format", () => {
    expect(
      quickListVideoProposalSchema.parse(validProposal).points,
    ).toHaveLength(3);
  });

  it("rejects a proposal with any other number of points", () => {
    expect(
      quickListVideoProposalSchema.safeParse({
        ...validProposal,
        points: validProposal.points.slice(0, 2),
      }).success,
    ).toBe(false);
  });

  it("keeps the video at a fixed 21-second timeline", () => {
    expect(quickListDurationFrames).toBe(21 * quickListTimeline.fps);
  });
});

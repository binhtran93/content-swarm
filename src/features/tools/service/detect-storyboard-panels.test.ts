import { describe, expect, it } from "vitest";

import { detectStoryboardPanels } from "@/features/tools/service/detect-storyboard-panels";

function canvas(width: number, height: number) {
  const pixels = new Uint8Array(width * height).fill(255);
  const rectangle = (
    x: number,
    y: number,
    rectangleWidth: number,
    rectangleHeight: number,
    thickness = 3,
    gaps: Array<{ side: "top" | "bottom"; start: number; length: number }> = [],
  ) => {
    for (let offset = 0; offset < thickness; offset += 1) {
      for (
        let horizontal = x;
        horizontal < x + rectangleWidth;
        horizontal += 1
      ) {
        const topGap = gaps.some(
          (gap) =>
            gap.side === "top" &&
            horizontal >= gap.start &&
            horizontal < gap.start + gap.length,
        );
        const bottomGap = gaps.some(
          (gap) =>
            gap.side === "bottom" &&
            horizontal >= gap.start &&
            horizontal < gap.start + gap.length,
        );
        if (!topGap) pixels[(y + offset) * width + horizontal] = 0;
        if (!bottomGap) {
          pixels[(y + rectangleHeight - 1 - offset) * width + horizontal] = 0;
        }
      }
      for (let vertical = y; vertical < y + rectangleHeight; vertical += 1) {
        pixels[vertical * width + x + offset] = 0;
        pixels[vertical * width + x + rectangleWidth - 1 - offset] = 0;
      }
    }
  };
  return { pixels, rectangle };
}

describe("detectStoryboardPanels", () => {
  it("sorts an uneven storyboard in reading order", () => {
    const { pixels, rectangle } = canvas(900, 700);
    rectangle(10, 10, 280, 210);
    rectangle(310, 10, 280, 210);
    rectangle(610, 10, 280, 210);
    rectangle(10, 240, 430, 210);
    rectangle(460, 240, 430, 210);

    expect(
      detectStoryboardPanels({ pixels, width: 900, height: 700 }).map(
        ({ x, y, width, height }) => ({ x, y, width, height }),
      ),
    ).toEqual([
      { x: 10, y: 11, width: 280, height: 208 },
      { x: 310, y: 11, width: 280, height: 208 },
      { x: 610, y: 11, width: 280, height: 208 },
      { x: 10, y: 241, width: 430, height: 208 },
      { x: 460, y: 241, width: 430, height: 208 },
    ]);
  });

  it("deduplicates thick outlines and suppresses nested rectangles", () => {
    const { pixels, rectangle } = canvas(600, 500);
    rectangle(20, 20, 560, 440, 5);
    rectangle(100, 100, 180, 140, 3);

    const panels = detectStoryboardPanels({
      pixels,
      width: 600,
      height: 500,
    });

    expect(panels).toHaveLength(1);
    expect(panels[0]).toMatchObject({ x: 20, y: 22, width: 560, height: 436 });
  });

  it("bridges tiny gaps in otherwise clear panel borders", () => {
    const { pixels, rectangle } = canvas(500, 400);
    rectangle(20, 20, 460, 360, 3, [
      { side: "top", start: 245, length: 2 },
      { side: "bottom", start: 245, length: 2 },
    ]);

    expect(
      detectStoryboardPanels({ pixels, width: 500, height: 400 }),
    ).toHaveLength(1);
  });

  it("returns no panels for an unbordered image", () => {
    const pixels = new Uint8Array(400 * 300).fill(255);
    expect(detectStoryboardPanels({ pixels, width: 400, height: 300 })).toEqual(
      [],
    );
  });

  it("rejects a buffer with invalid dimensions", () => {
    expect(() =>
      detectStoryboardPanels({
        pixels: new Uint8Array(10),
        width: 10,
        height: 10,
      }),
    ).toThrow("Expected one grayscale byte per image pixel.");
  });
});

import { describe, expect, it } from "vitest";

import {
  clampPanelBounds,
  sortPanelBoundsReadingOrder,
  transformPanelBounds,
  type ResizeHandle,
} from "@/features/tools/model/storyboard-crop-geometry";

const sourceWidth = 500;
const sourceHeight = 400;
const bounds = { x: 100, y: 100, width: 200, height: 150 };

describe("storyboard crop geometry", () => {
  it("moves and clamps a rectangle inside the source", () => {
    expect(
      transformPanelBounds({
        bounds,
        deltaX: 500,
        deltaY: -500,
        handle: "move",
        sourceWidth,
        sourceHeight,
      }),
    ).toEqual({ x: 300, y: 0, width: 200, height: 150 });
  });

  it.each([
    ["n", { x: 100, y: 80, width: 200, height: 170 }],
    ["ne", { x: 100, y: 80, width: 230, height: 170 }],
    ["e", { x: 100, y: 100, width: 230, height: 150 }],
    ["se", { x: 100, y: 100, width: 230, height: 170 }],
    ["s", { x: 100, y: 100, width: 200, height: 170 }],
    ["sw", { x: 70, y: 100, width: 230, height: 170 }],
    ["w", { x: 70, y: 100, width: 230, height: 150 }],
    ["nw", { x: 70, y: 80, width: 230, height: 170 }],
  ] satisfies Array<[Exclude<ResizeHandle, "move">, typeof bounds]>)(
    "resizes the %s handle",
    (handle, expected) => {
      expect(
        transformPanelBounds({
          bounds,
          deltaX: handle.includes("w") ? -30 : 30,
          deltaY: handle.includes("n") ? -20 : 20,
          handle,
          sourceWidth,
          sourceHeight,
        }),
      ).toEqual(expected);
    },
  );

  it("enforces the minimum size and source boundary", () => {
    expect(
      clampPanelBounds(
        { x: 490, y: 395, width: 1, height: 1 },
        sourceWidth,
        sourceHeight,
      ),
    ).toEqual({ x: 484, y: 384, width: 16, height: 16 });
  });

  it("sorts rows from top to bottom and left to right", () => {
    expect(
      sortPanelBoundsReadingOrder([
        { x: 260, y: 220, width: 200, height: 150 },
        { x: 260, y: 10, width: 200, height: 150 },
        { x: 10, y: 215, width: 200, height: 150 },
        { x: 10, y: 20, width: 200, height: 150 },
      ]),
    ).toEqual([
      { x: 10, y: 20, width: 200, height: 150 },
      { x: 260, y: 10, width: 200, height: 150 },
      { x: 10, y: 215, width: 200, height: 150 },
      { x: 260, y: 220, width: 200, height: 150 },
    ]);
  });
});

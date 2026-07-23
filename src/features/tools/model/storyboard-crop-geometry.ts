import {
  storyboardCropConfig,
  type PanelBounds,
} from "@/features/tools/model/storyboard-splitter-job";

export type ResizeHandle =
  "move" | "n" | "ne" | "e" | "se" | "s" | "sw" | "w" | "nw";

export function clampPanelBounds(
  bounds: PanelBounds,
  sourceWidth: number,
  sourceHeight: number,
): PanelBounds {
  const minimumWidth = Math.min(
    storyboardCropConfig.minimumSidePixels,
    sourceWidth,
  );
  const minimumHeight = Math.min(
    storyboardCropConfig.minimumSidePixels,
    sourceHeight,
  );
  const width = clamp(bounds.width, minimumWidth, sourceWidth);
  const height = clamp(bounds.height, minimumHeight, sourceHeight);
  return {
    x: clamp(bounds.x, 0, sourceWidth - width),
    y: clamp(bounds.y, 0, sourceHeight - height),
    width,
    height,
  };
}

export function transformPanelBounds({
  bounds,
  deltaX,
  deltaY,
  handle,
  sourceWidth,
  sourceHeight,
}: {
  bounds: PanelBounds;
  deltaX: number;
  deltaY: number;
  handle: ResizeHandle;
  sourceWidth: number;
  sourceHeight: number;
}): PanelBounds {
  if (handle === "move") {
    return clampPanelBounds(
      {
        ...bounds,
        x: bounds.x + deltaX,
        y: bounds.y + deltaY,
      },
      sourceWidth,
      sourceHeight,
    );
  }

  let left = bounds.x;
  let top = bounds.y;
  let right = bounds.x + bounds.width;
  let bottom = bounds.y + bounds.height;
  const minimum = storyboardCropConfig.minimumSidePixels;

  if (handle.includes("w")) left = clamp(left + deltaX, 0, right - minimum);
  if (handle.includes("e")) {
    right = clamp(right + deltaX, left + minimum, sourceWidth);
  }
  if (handle.includes("n")) top = clamp(top + deltaY, 0, bottom - minimum);
  if (handle.includes("s")) {
    bottom = clamp(bottom + deltaY, top + minimum, sourceHeight);
  }

  return {
    x: left,
    y: top,
    width: right - left,
    height: bottom - top,
  };
}

export function sortPanelBoundsReadingOrder(
  rectangles: PanelBounds[],
): PanelBounds[] {
  if (!rectangles.length) return [];
  const heights = rectangles
    .map((rectangle) => rectangle.height)
    .sort((first, second) => first - second);
  const medianHeight = heights[Math.floor(heights.length / 2)] ?? 1;
  const rowTolerance = Math.max(8, medianHeight * 0.2);
  const rows: PanelBounds[][] = [];

  for (const rectangle of [...rectangles].sort((a, b) => a.y - b.y)) {
    const row = rows.find(
      (candidateRow) =>
        Math.abs((candidateRow[0]?.y ?? 0) - rectangle.y) <= rowTolerance,
    );
    if (row) row.push(rectangle);
    else rows.push([rectangle]);
  }

  return rows.flatMap((row) => row.sort((a, b) => a.x - b.x));
}

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, Math.round(value)));
}

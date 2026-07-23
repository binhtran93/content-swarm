import type { PanelBounds } from "@/features/tools/model/storyboard-splitter-job";

export const storyboardDetectorConfig = {
  darkPixelThreshold: 90,
  allowedRunGap: 2,
  groupAxisGap: 3,
  groupEndpointTolerance: 8,
  groupOverlapRatio: 0.8,
  rectangleEndpointTolerance: 10,
  minimumWidthRatio: 0.15,
  minimumHeightRatio: 0.1,
  minimumAreaRatio: 0.025,
  duplicateIou: 0.85,
  nestedCoverage: 0.96,
} as const;

type Run = { axis: number; start: number; end: number };
type GroupedRun = {
  axisMin: number;
  axisMax: number;
  start: number;
  end: number;
  samples: number;
};

type Candidate = PanelBounds & { borderThickness: number };

export type DetectedPanel = PanelBounds & { inset: number };

function darkRuns(
  length: number,
  valueAt: (position: number) => number,
  minimumLength: number,
): Array<{ start: number; end: number }> {
  const runs: Array<{ start: number; end: number }> = [];
  let start = -1;
  let lastDark = -1;

  for (let position = 0; position < length; position += 1) {
    if (valueAt(position) < storyboardDetectorConfig.darkPixelThreshold) {
      if (start < 0) start = position;
      lastDark = position;
      continue;
    }
    if (
      start >= 0 &&
      position - lastDark > storyboardDetectorConfig.allowedRunGap
    ) {
      if (lastDark - start + 1 >= minimumLength) {
        runs.push({ start, end: lastDark });
      }
      start = -1;
      lastDark = -1;
    }
  }

  if (start >= 0 && lastDark - start + 1 >= minimumLength) {
    runs.push({ start, end: lastDark });
  }
  return runs;
}

function groupRuns(runs: Run[]): GroupedRun[] {
  const groups: GroupedRun[] = [];
  const sorted = [...runs].sort(
    (first, second) => first.axis - second.axis || first.start - second.start,
  );

  for (const run of sorted) {
    let match: GroupedRun | undefined;
    for (let index = groups.length - 1; index >= 0; index -= 1) {
      const group = groups[index];
      if (!group) continue;
      if (run.axis - group.axisMax > storyboardDetectorConfig.groupAxisGap) {
        break;
      }
      const overlap =
        Math.max(
          0,
          Math.min(run.end, group.end) - Math.max(run.start, group.start) + 1,
        ) / Math.min(run.end - run.start + 1, group.end - group.start + 1);
      if (
        overlap >= storyboardDetectorConfig.groupOverlapRatio &&
        Math.abs(run.start - group.start) <=
          storyboardDetectorConfig.groupEndpointTolerance &&
        Math.abs(run.end - group.end) <=
          storyboardDetectorConfig.groupEndpointTolerance
      ) {
        match = group;
        break;
      }
    }

    if (match) {
      match.axisMax = run.axis;
      match.start = Math.min(match.start, run.start);
      match.end = Math.max(match.end, run.end);
      match.samples += 1;
    } else {
      groups.push({
        axisMin: run.axis,
        axisMax: run.axis,
        start: run.start,
        end: run.end,
        samples: 1,
      });
    }
  }
  return groups;
}

function axisCenter(run: GroupedRun) {
  return Math.round((run.axisMin + run.axisMax) / 2);
}

function axisThickness(run: GroupedRun) {
  return run.axisMax - run.axisMin + 1;
}

function intersectionOverUnion(first: PanelBounds, second: PanelBounds) {
  const left = Math.max(first.x, second.x);
  const top = Math.max(first.y, second.y);
  const right = Math.min(first.x + first.width, second.x + second.width);
  const bottom = Math.min(first.y + first.height, second.y + second.height);
  const intersection = Math.max(0, right - left) * Math.max(0, bottom - top);
  const union =
    first.width * first.height + second.width * second.height - intersection;
  return union ? intersection / union : 0;
}

function containedCoverage(inner: PanelBounds, outer: PanelBounds) {
  const left = Math.max(inner.x, outer.x);
  const top = Math.max(inner.y, outer.y);
  const right = Math.min(inner.x + inner.width, outer.x + outer.width);
  const bottom = Math.min(inner.y + inner.height, outer.y + outer.height);
  const intersection = Math.max(0, right - left) * Math.max(0, bottom - top);
  return intersection / (inner.width * inner.height);
}

function readingOrder(rectangles: Candidate[]) {
  const heights = rectangles
    .map((rectangle) => rectangle.height)
    .sort((first, second) => first - second);
  const medianHeight = heights[Math.floor(heights.length / 2)] ?? 1;
  const rowTolerance = Math.max(8, medianHeight * 0.2);
  const rows: Candidate[][] = [];

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

export function detectStoryboardPanels({
  pixels,
  width,
  height,
}: {
  pixels: Uint8Array;
  width: number;
  height: number;
}): DetectedPanel[] {
  if (pixels.length !== width * height) {
    throw new Error("Expected one grayscale byte per image pixel.");
  }

  const horizontalRuns: Run[] = [];
  const verticalRuns: Run[] = [];
  const minimumWidth = Math.ceil(
    width * storyboardDetectorConfig.minimumWidthRatio,
  );
  const minimumHeight = Math.ceil(
    height * storyboardDetectorConfig.minimumHeightRatio,
  );

  for (let y = 0; y < height; y += 1) {
    for (const run of darkRuns(
      width,
      (x) => pixels[y * width + x] ?? 255,
      minimumWidth,
    )) {
      horizontalRuns.push({ axis: y, ...run });
    }
  }
  for (let x = 0; x < width; x += 1) {
    for (const run of darkRuns(
      height,
      (y) => pixels[y * width + x] ?? 255,
      minimumHeight,
    )) {
      verticalRuns.push({ axis: x, ...run });
    }
  }

  const horizontal = groupRuns(horizontalRuns);
  const vertical = groupRuns(verticalRuns);
  const candidates: Candidate[] = [];
  const tolerance = storyboardDetectorConfig.rectangleEndpointTolerance;
  const minimumArea =
    width * height * storyboardDetectorConfig.minimumAreaRatio;

  for (let topIndex = 0; topIndex < horizontal.length; topIndex += 1) {
    const top = horizontal[topIndex];
    if (!top) continue;
    for (
      let bottomIndex = topIndex + 1;
      bottomIndex < horizontal.length;
      bottomIndex += 1
    ) {
      const bottom = horizontal[bottomIndex];
      if (!bottom) continue;
      const topY = axisCenter(top);
      const bottomY = axisCenter(bottom);
      if (bottomY - topY < minimumHeight) continue;
      if (
        Math.abs(top.start - bottom.start) > tolerance ||
        Math.abs(top.end - bottom.end) > tolerance
      ) {
        continue;
      }

      const leftX = Math.round((top.start + bottom.start) / 2);
      const rightX = Math.round((top.end + bottom.end) / 2);
      const panelWidth = rightX - leftX + 1;
      const panelHeight = bottomY - topY + 1;
      if (panelWidth < minimumWidth || panelWidth * panelHeight < minimumArea) {
        continue;
      }

      const left = vertical.find(
        (line) =>
          Math.abs(axisCenter(line) - leftX) <= tolerance &&
          line.start <= topY + tolerance &&
          line.end >= bottomY - tolerance,
      );
      const right = vertical.find(
        (line) =>
          Math.abs(axisCenter(line) - rightX) <= tolerance &&
          line.start <= topY + tolerance &&
          line.end >= bottomY - tolerance,
      );
      if (!left || !right) continue;

      candidates.push({
        x: leftX,
        y: topY,
        width: panelWidth,
        height: panelHeight,
        borderThickness: Math.max(
          axisThickness(top),
          axisThickness(bottom),
          axisThickness(left),
          axisThickness(right),
        ),
      });
    }
  }

  const unique: Candidate[] = [];
  for (const candidate of [...candidates].sort(
    (first, second) =>
      second.width * second.height - first.width * first.height,
  )) {
    if (
      unique.some(
        (existing) =>
          intersectionOverUnion(candidate, existing) >=
          storyboardDetectorConfig.duplicateIou,
      )
    ) {
      continue;
    }
    if (
      unique.some(
        (existing) =>
          containedCoverage(candidate, existing) >=
          storyboardDetectorConfig.nestedCoverage,
      )
    ) {
      continue;
    }
    unique.push(candidate);
  }

  return readingOrder(unique).map(
    ({ borderThickness, ...rectangle }): DetectedPanel => ({
      ...rectangle,
      inset: Math.max(2, Math.min(8, Math.ceil(borderThickness / 2) + 1)),
    }),
  );
}

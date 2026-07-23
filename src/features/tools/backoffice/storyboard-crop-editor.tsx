"use client";

import { useRouter } from "next/navigation";
import {
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";

import {
  sortPanelBoundsReadingOrder,
  transformPanelBounds,
  type ResizeHandle,
} from "@/features/tools/model/storyboard-crop-geometry";
import type { PanelBounds } from "@/features/tools/model/storyboard-splitter-job";

type EditorRectangle = {
  id: string;
  bounds: PanelBounds;
};

type DragState = {
  id: string;
  handle: ResizeHandle;
  pointerId: number;
  startBounds: PanelBounds;
  startX: number;
  startY: number;
};

const handles: Array<Exclude<ResizeHandle, "move">> = [
  "nw",
  "n",
  "ne",
  "e",
  "se",
  "s",
  "sw",
  "w",
];

export function StoryboardCropEditor({
  cropBounds,
  hasExistingResults = false,
  jobId,
  projectId,
  sourceHeight,
  sourceUrl,
  sourceWidth,
}: {
  cropBounds: PanelBounds[];
  hasExistingResults?: boolean;
  jobId: string;
  projectId: string;
  sourceHeight: number;
  sourceUrl: string;
  sourceWidth: number;
}) {
  const router = useRouter();
  const svg = useRef<SVGSVGElement>(null);
  const drag = useRef<DragState | null>(null);
  const saveQueue = useRef(Promise.resolve());
  const pendingSaveCount = useRef(0);
  const rectangleState = useRef(
    cropBounds.map((bounds, index) => ({
      id: `crop-${index + 1}`,
      bounds,
    })),
  );
  const [rectangles, setRectangles] = useState(() =>
    cropBounds.map((bounds, index) => ({
      id: `crop-${index + 1}`,
      bounds,
    })),
  );
  const [selectedId, setSelectedId] = useState<string | null>(
    cropBounds.length ? "crop-1" : null,
  );
  const [saving, setSaving] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const readingOrder = sortPanelBoundsReadingOrder(
    rectangles.map((rectangle) => rectangle.bounds),
  );

  const handleSize = Math.max(8, Math.min(sourceWidth, sourceHeight) / 55);
  const strokeWidth = Math.max(2, Math.min(sourceWidth, sourceHeight) / 300);

  function updateRectangles(next: EditorRectangle[]) {
    rectangleState.current = next;
    setRectangles(next);
  }

  function sourcePoint(event: ReactPointerEvent<SVGElement>) {
    const display = svg.current?.getBoundingClientRect();
    if (!display?.width || !display.height) return null;
    return {
      x: ((event.clientX - display.left) / display.width) * sourceWidth,
      y: ((event.clientY - display.top) / display.height) * sourceHeight,
    };
  }

  function beginDrag(
    event: ReactPointerEvent<SVGElement>,
    rectangle: EditorRectangle,
    handle: ResizeHandle,
  ) {
    const point = sourcePoint(event);
    if (!point || processing) return;
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    setSelectedId(rectangle.id);
    drag.current = {
      id: rectangle.id,
      handle,
      pointerId: event.pointerId,
      startBounds: rectangle.bounds,
      startX: point.x,
      startY: point.y,
    };
  }

  function continueDrag(event: ReactPointerEvent<SVGSVGElement>) {
    const active = drag.current;
    if (!active || active.pointerId !== event.pointerId) return;
    const point = sourcePoint(event);
    if (!point) return;
    const nextBounds = transformPanelBounds({
      bounds: active.startBounds,
      deltaX: point.x - active.startX,
      deltaY: point.y - active.startY,
      handle: active.handle,
      sourceWidth,
      sourceHeight,
    });
    updateRectangles(
      rectangleState.current.map((rectangle) =>
        rectangle.id === active.id
          ? { ...rectangle, bounds: nextBounds }
          : rectangle,
      ),
    );
  }

  function finishDrag(event: ReactPointerEvent<SVGSVGElement>) {
    if (!drag.current || drag.current.pointerId !== event.pointerId) return;
    drag.current = null;
    commitRectangles(rectangleState.current);
  }

  async function commitRectangles(next: EditorRectangle[]) {
    updateRectangles(next);
    pendingSaveCount.current += 1;
    setSaving(true);
    setError(null);
    const save = async () => {
      try {
        const response = await fetch(
          `/api/admin/projects/${projectId}/tools/storyboard-splitter/jobs/${jobId}/crops`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              rectangles: next.map((rectangle) => rectangle.bounds),
            }),
          },
        );
        const body = (await response.json()) as { error?: string };
        if (!response.ok) {
          throw new Error(
            body.error || "The crop rectangles could not be saved.",
          );
        }
      } catch (caught) {
        setError(
          caught instanceof Error
            ? caught.message
            : "The crop rectangles could not be saved.",
        );
      } finally {
        pendingSaveCount.current -= 1;
        if (!pendingSaveCount.current) setSaving(false);
      }
    };
    saveQueue.current = saveQueue.current.then(save, save);
    await saveQueue.current;
  }

  async function cutAndEnhance() {
    const sorted = sortEditorRectangles(rectangleState.current);
    updateRectangles(sorted);
    setProcessing(true);
    setError(null);
    try {
      await saveQueue.current;
      const response = await fetch(
        `/api/admin/projects/${projectId}/tools/storyboard-splitter/jobs/${jobId}/process`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            rectangles: sorted.map((rectangle) => rectangle.bounds),
          }),
        },
      );
      const body = (await response.json()) as {
        error?: string | null;
        status?: string;
      };
      if (!response.ok || body.status === "failed") {
        throw new Error(body.error || "The storyboard could not be processed.");
      }
      router.refresh();
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "The storyboard could not be processed.",
      );
      setProcessing(false);
      router.refresh();
    }
  }

  return (
    <div className="space-y-4">
      {error ? (
        <div className="alert alert-error" role="alert">
          <span>{error}</span>
        </div>
      ) : null}
      <div className="border-base-300 bg-base-100 overflow-hidden rounded-2xl border p-3">
        <svg
          aria-label="Editable storyboard crop rectangles"
          className="h-auto w-full touch-none rounded-xl"
          onPointerMove={continueDrag}
          onPointerCancel={finishDrag}
          onPointerUp={finishDrag}
          ref={svg}
          role="img"
          viewBox={`0 0 ${sourceWidth} ${sourceHeight}`}
        >
          <image
            height={sourceHeight}
            href={sourceUrl}
            preserveAspectRatio="none"
            width={sourceWidth}
            x={0}
            y={0}
          />
          {rectangles.map((rectangle) => {
            const { bounds } = rectangle;
            const isSelected = rectangle.id === selectedId;
            const panelNumber = readingOrder.indexOf(bounds) + 1;
            return (
              <g key={rectangle.id}>
                <rect
                  aria-label={`Select panel ${panelNumber}`}
                  className="cursor-move"
                  fill={isSelected ? "#ef44441f" : "transparent"}
                  height={bounds.height}
                  onPointerDown={(event) => beginDrag(event, rectangle, "move")}
                  role="button"
                  stroke="#ef4444"
                  strokeWidth={strokeWidth}
                  width={bounds.width}
                  x={bounds.x}
                  y={bounds.y}
                />
                <circle
                  cx={bounds.x + handleSize * 1.4}
                  cy={bounds.y + handleSize * 1.4}
                  fill="#ef4444"
                  pointerEvents="none"
                  r={handleSize}
                />
                <text
                  dominantBaseline="central"
                  fill="white"
                  fontFamily="sans-serif"
                  fontSize={handleSize * 1.35}
                  fontWeight="700"
                  pointerEvents="none"
                  textAnchor="middle"
                  x={bounds.x + handleSize * 1.4}
                  y={bounds.y + handleSize * 1.4}
                >
                  {panelNumber}
                </text>
                {isSelected
                  ? handles.map((handle) => {
                      const point = handlePoint(bounds, handle);
                      return (
                        <rect
                          aria-label={`Resize panel ${panelNumber} ${handle}`}
                          className="cursor-pointer"
                          fill="white"
                          height={handleSize}
                          key={handle}
                          onPointerDown={(event) =>
                            beginDrag(event, rectangle, handle)
                          }
                          role="button"
                          stroke="#ef4444"
                          strokeWidth={strokeWidth}
                          width={handleSize}
                          x={point.x - handleSize / 2}
                          y={point.y - handleSize / 2}
                        />
                      );
                    })
                  : null}
              </g>
            );
          })}
        </svg>
      </div>

      <div className="flex justify-end">
        <button
          className="btn btn-primary"
          disabled={processing || saving || !rectangles.length}
          onClick={cutAndEnhance}
          type="button"
        >
          {processing ? (
            <span className="loading loading-spinner loading-sm" />
          ) : null}
          {processing
            ? "Cutting and enhancing…"
            : hasExistingResults
              ? "Cut and enhance again"
              : "Cut and enhance"}
        </button>
      </div>
    </div>
  );
}

function sortEditorRectangles(rectangles: EditorRectangle[]) {
  const sortedBounds = sortPanelBoundsReadingOrder(
    rectangles.map((rectangle) => rectangle.bounds),
  );
  return sortedBounds.flatMap(
    (bounds) =>
      rectangles.find((rectangle) => rectangle.bounds === bounds) ?? [],
  );
}

function handlePoint(
  bounds: PanelBounds,
  handle: Exclude<ResizeHandle, "move">,
) {
  const horizontal = handle.includes("w")
    ? bounds.x
    : handle.includes("e")
      ? bounds.x + bounds.width
      : bounds.x + bounds.width / 2;
  const vertical = handle.includes("n")
    ? bounds.y
    : handle.includes("s")
      ? bounds.y + bounds.height
      : bounds.y + bounds.height / 2;
  return { x: horizontal, y: vertical };
}

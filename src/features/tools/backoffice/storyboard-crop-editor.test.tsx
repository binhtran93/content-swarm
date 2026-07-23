import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { StoryboardCropEditor } from "@/features/tools/backoffice/storyboard-crop-editor";

const refresh = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh }),
}));

beforeEach(() => {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ status: "review" }),
    }),
  );
});

describe("StoryboardCropEditor", () => {
  it("moves a rectangle in source coordinates and saves it", async () => {
    renderEditor();
    const canvas = screen.getByRole("img", {
      name: "Editable storyboard crop rectangles",
    });
    vi.spyOn(canvas, "getBoundingClientRect").mockReturnValue({
      bottom: 400,
      height: 400,
      left: 0,
      right: 500,
      top: 0,
      width: 500,
      x: 0,
      y: 0,
      toJSON: () => undefined,
    });
    const panel = screen.getByRole("button", { name: "Select panel 1" });
    Object.defineProperty(panel, "setPointerCapture", { value: vi.fn() });

    fireEvent.pointerDown(panel, {
      clientX: 100,
      clientY: 100,
      pointerId: 1,
    });
    fireEvent.pointerMove(canvas, {
      clientX: 120,
      clientY: 130,
      pointerId: 1,
    });
    fireEvent.pointerUp(canvas, { pointerId: 1 });

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    expect(requestRectangles(0)).toEqual([
      { x: 30, y: 40, width: 200, height: 150 },
      { x: 260, y: 10, width: 200, height: 150 },
    ]);
  });

  it("shows all resize handles without an extra controls panel", () => {
    renderEditor();

    for (const handle of ["nw", "n", "ne", "e", "se", "s", "sw", "w"]) {
      expect(
        screen.getByRole("button", { name: `Resize panel 1 ${handle}` }),
      ).toBeVisible();
    }
    expect(screen.queryByLabelText("x")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Reset panel" }),
    ).not.toBeInTheDocument();
  });

  it("submits current rectangles for cutting and enhancement", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ status: "ready" }),
    } as Response);
    renderEditor();

    fireEvent.click(screen.getByRole("button", { name: "Cut and enhance" }));

    await waitFor(() => expect(refresh).toHaveBeenCalled());
    expect(fetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/process$/),
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("keeps editing and replacement processing enabled for ready jobs", () => {
    renderEditor(true);

    expect(
      screen.getByRole("button", { name: "Cut and enhance again" }),
    ).toBeEnabled();
    expect(
      screen.getByRole("button", { name: "Select panel 1" }),
    ).toBeEnabled();
  });
});

function renderEditor(hasExistingResults = false) {
  render(
    <StoryboardCropEditor
      cropBounds={[
        { x: 10, y: 10, width: 200, height: 150 },
        { x: 260, y: 10, width: 200, height: 150 },
      ]}
      hasExistingResults={hasExistingResults}
      jobId="8f6d717d-56d5-4f62-9254-08aeb4d92d31"
      projectId="urge-zero"
      sourceHeight={400}
      sourceUrl="/source.png"
      sourceWidth={500}
    />,
  );
}

function requestRectangles(callIndex: number) {
  const request = vi.mocked(fetch).mock.calls[callIndex]?.[1];
  return (
    JSON.parse(String(request?.body)) as {
      rectangles: Array<{
        x: number;
        y: number;
        width: number;
        height: number;
      }>;
    }
  ).rectangles;
}

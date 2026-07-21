import { describe, expect, it, vi } from "vitest";

import { retryAutomationOperation } from "@/features/articles/automation/retry-automation-operation";

describe("retryAutomationOperation", () => {
  it("returns after a transient failure", async () => {
    const operation = vi
      .fn<() => Promise<string>>()
      .mockRejectedValueOnce(new Error("timeout"))
      .mockResolvedValue("done");
    await expect(
      retryAutomationOperation(operation, { wait: async () => undefined }),
    ).resolves.toBe("done");
    expect(operation).toHaveBeenCalledTimes(2);
  });

  it("stops after three attempts", async () => {
    const operation = vi.fn().mockRejectedValue(new Error("invalid output"));
    await expect(
      retryAutomationOperation(operation, { wait: async () => undefined }),
    ).rejects.toThrow("invalid output");
    expect(operation).toHaveBeenCalledTimes(3);
  });
});

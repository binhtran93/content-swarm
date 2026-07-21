import { describe, expect, it } from "vitest";

import {
  assertTimeZone,
  nextScheduledTime,
} from "@/features/articles/automation/article-automation-schedule";

describe("article automation schedule", () => {
  it("finds the next local publication time", () => {
    expect(
      nextScheduledTime(
        new Date("2026-07-21T01:30:00.000Z"),
        "09:00",
        "Asia/Ho_Chi_Minh",
      ).toISOString(),
    ).toBe("2026-07-21T02:00:00.000Z");
  });

  it("moves to the next day after today's time", () => {
    expect(
      nextScheduledTime(
        new Date("2026-07-21T03:00:00.000Z"),
        "09:00",
        "Asia/Ho_Chi_Minh",
      ).toISOString(),
    ).toBe("2026-07-22T02:00:00.000Z");
  });

  it("rejects unknown timezones", () => {
    expect(() => assertTimeZone("Moon/Base")).toThrow(/IANA timezone/);
  });
});

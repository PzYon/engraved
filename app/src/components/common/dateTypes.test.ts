import { describe, expect, it } from "vitest";
import { DateFormat, formatDate } from "./dateTypes";

describe("formatDate", () => {
  const value = new Date(2026, 9, 21, 10, 0, 0);

  it("formats relative to the given now", () => {
    expect(
      formatDate(
        value,
        DateFormat.relativeToNow,
        new Date(2026, 9, 21, 10, 0, 5),
      ),
    ).toBe("less than 10 seconds ago");

    expect(
      formatDate(
        value,
        DateFormat.relativeToNow,
        new Date(2026, 9, 21, 10, 30, 0),
      ),
    ).toBe("30 minutes ago");
  });

  it("returns 'today' only when on the same day as the given now", () => {
    expect(
      formatDate(
        value,
        DateFormat.relativeToNowDayPlus,
        new Date(2026, 9, 21, 23, 0, 0),
      ),
    ).toBe("today");

    expect(
      formatDate(
        value,
        DateFormat.relativeToNowDayPlus,
        new Date(2026, 9, 23, 10, 0, 0),
      ),
    ).toBe("2 days ago");
  });
});

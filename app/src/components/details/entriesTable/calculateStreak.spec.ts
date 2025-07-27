import { addDays } from "date-fns";
import { calculateStreak } from "./calculateStreak";

describe("calculateStreak", () => {
  it("should return null when mode is none", () => {
    const result = calculateStreak([], "none");

    expect(result).toBe(null);
  });

  it("should return isStreak when entry today and positive", () => {
    const result = calculateStreak([createDateOffset(0)], "positive");

    expect(result).not.toBe(null);
    expect(result.isStreak).toBeTruthy();
    expect(result.hasEntryToday).toBeTruthy();
    expect(result.length).toBe(1);
  });

  it("should return correct streak count when positive and value today", () => {
    const result = calculateStreak(
      [createDateOffset(0), createDateOffset(1), createDateOffset(2)],
      "positive",
    );

    expect(result).not.toBe(null);
    expect(result.isStreak).toBeTruthy();
    expect(result.hasEntryToday).toBeTruthy();
    expect(result.length).toBe(3);
  });

  it("should return correct streak count when positive and no value today (yet)", () => {
    const result = calculateStreak(
      [createDateOffset(1), createDateOffset(2)],
      "positive",
    );

    expect(result).not.toBe(null);
    expect(result.isStreak).toBeTruthy();
    expect(result.hasEntryToday).toBeFalsy();
    expect(result.length).toBe(2);
  });

  it("should return isStreak when no entry today and negative", () => {
    const result = calculateStreak([createDateOffset(2)], "negative");

    expect(result).not.toBe(null);
    expect(result.isStreak).toBeTruthy();
    expect(result.hasEntryToday).toBeFalsy();
    expect(result.length).toBe(1);
  });

  it("should return correct streak count when negative", () => {
    const result = calculateStreak([createDateOffset(3)], "negative");

    expect(result).not.toBe(null);
    expect(result.isStreak).toBeTruthy();
    expect(result.hasEntryToday).toBeFalsy();
    expect(result.length).toBe(2);
  });
});

function createDateOffset(daysAgo: number): { dateTime: string | Date } {
  return { dateTime: addDays(new Date(), -daysAgo) };
}

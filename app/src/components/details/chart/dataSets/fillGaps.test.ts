import { fillGaps } from "./fillGaps";
import { ITransformedEntry } from "../transformation/ITransformedEntry";
import { GroupByTime } from "../consolidation/GroupByTime";
import { JournalType } from "../../../../serverApi/JournalType";

describe("fillGaps", () => {
  it("should insert zero values for missing days", () => {
    const results = fillGaps(
      [getEntry(new Date(2026, 0, 1), 3), getEntry(new Date(2026, 0, 4), 6)],
      JournalType.Counter,
      GroupByTime.Day,
    );

    expect(results.length).toBe(4);
    expect(results.map((r) => r.y)).toEqual([3, 0, 0, 6]);
    expect(results[1].x).toEqual(new Date(2026, 0, 2));
    expect(results[2].x).toEqual(new Date(2026, 0, 3));
    expect(results[1].entries).toEqual([]);
  });

  it("should insert zero values for missing months across year boundary", () => {
    const results = fillGaps(
      [getEntry(new Date(2025, 10, 1), 3), getEntry(new Date(2026, 1, 1), 6)],
      JournalType.Timer,
      GroupByTime.Month,
    );

    expect(results.length).toBe(4);
    expect(results.map((r) => r.y)).toEqual([3, 0, 0, 6]);
    expect(results[1].x).toEqual(new Date(2025, 11, 1));
    expect(results[2].x).toEqual(new Date(2026, 0, 1));
  });

  it("should not insert anything for consecutive days", () => {
    const results = fillGaps(
      [getEntry(new Date(2026, 0, 1), 3), getEntry(new Date(2026, 0, 2), 6)],
      JournalType.Counter,
      GroupByTime.Day,
    );

    expect(results.length).toBe(2);
    expect(results.map((r) => r.y)).toEqual([3, 6]);
  });

  it("should sort entries chronologically", () => {
    const results = fillGaps(
      [getEntry(new Date(2026, 0, 3), 6), getEntry(new Date(2026, 0, 1), 3)],
      JournalType.Counter,
      GroupByTime.Day,
    );

    expect(results.length).toBe(3);
    expect(results.map((r) => r.y)).toEqual([3, 0, 6]);
  });

  it("should not fill gaps for gauge journals", () => {
    const entries = [
      getEntry(new Date(2026, 0, 1), 3),
      getEntry(new Date(2026, 0, 4), 6),
    ];

    const results = fillGaps(entries, JournalType.Gauge, GroupByTime.Day);

    expect(results).toBe(entries);
  });

  it("should not fill gaps without time grouping", () => {
    const entries = [
      getEntry(new Date(2026, 0, 1), 3),
      getEntry(new Date(2026, 0, 4), 6),
    ];

    const results = fillGaps(entries, JournalType.Counter, GroupByTime.None);

    expect(results).toBe(entries);
  });
});

function getEntry(x: Date, y: number): ITransformedEntry {
  return { x, y, entries: [] };
}

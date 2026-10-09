import { calculateAverage } from "./calculateAverage";
import { GroupByTime } from "./consolidation/GroupByTime";
import { ITransformedEntry } from "./transformation/ITransformedEntry";

describe("calculateAverage", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 9, 9, 12));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  function createValue(
    x: Date,
    y: number,
    numberOfEntries = 1,
  ): ITransformedEntry {
    return {
      x,
      y,
      entries: Array.from({ length: numberOfEntries }, () => ({
        dateTime: x.toISOString(),
      })),
    };
  }

  it("should be per day when grouped by day", () => {
    const values = [
      createValue(new Date(2026, 8, 30), 12),
      createValue(new Date(2026, 9, 5), 8),
    ];

    // 30.09. until 09.10. are 10 days
    expect(calculateAverage(values, "sum", GroupByTime.Day)).toBe(2);
  });

  it("should be per day when not grouped", () => {
    const values = [
      createValue(new Date(2026, 8, 30, 8), 12),
      createValue(new Date(2026, 9, 5, 18), 8),
    ];

    expect(calculateAverage(values, "sum", GroupByTime.None)).toBe(2);
  });

  it("should be per month when grouped by month", () => {
    const values = [
      createValue(new Date(2026, 6, 1), 30),
      createValue(new Date(2026, 9, 1), 10),
    ];

    // july until october are 4 months, of which two are without entries
    expect(calculateAverage(values, "sum", GroupByTime.Month)).toBe(10);
  });

  it("should count months across years when grouped by month", () => {
    const values = [createValue(new Date(2025, 10, 1), 24)];

    expect(calculateAverage(values, "average-by-time", GroupByTime.Month)).toBe(
      2,
    );
  });

  it("should be per entry when averaging by occurrence, regardless of grouping", () => {
    const values = [
      createValue(new Date(2026, 6, 1), 30, 3),
      createValue(new Date(2026, 9, 1), 10, 2),
    ];

    expect(
      calculateAverage(values, "average-by-occurrence", GroupByTime.Month),
    ).toBe(8);
  });
});

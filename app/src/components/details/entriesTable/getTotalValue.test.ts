import { AggregationMode } from "../edit/IJournalUiSettings";
import { getTotalValue } from "./getTotalValue";
import { IEntriesTableGroup } from "./IEntriesTableGroup";

describe("getTotalValue", () => {
  function createGroup(
    totalValue: number,
    ...dates: string[]
  ): IEntriesTableGroup {
    return {
      label: "",
      totalString: "",
      totalValue,
      entries: dates.map((dateTime) => ({ dateTime })),
    };
  }

  const groups = [
    createGroup(12, "2026-10-01T12:00:00", "2026-10-02T12:00:00"),
    createGroup(8, "2026-10-05T12:00:00", "2026-10-05T18:00:00"),
  ];

  it("should sum up the totals of all groups", () => {
    const result = getTotalValue(groups, "sum", {});

    expect(result).toEqual({ value: 20, label: "Sum" });
  });

  it.each<AggregationMode>(["average", "average-by-occurrence"])(
    "should divide by the number of entries (%s)",
    (aggregationMode) => {
      const result = getTotalValue(groups, aggregationMode, {});

      expect(result).toEqual({
        value: 5,
        label: "Average from 4 occurrences",
      });
    },
  );

  it("should divide by the number of days in the date range", () => {
    const result = getTotalValue(groups, "average-by-time", {
      from: new Date(2026, 9, 1),
      to: new Date(2026, 9, 10),
    });

    expect(result).toEqual({ value: 2, label: "Average over 10 days" });
  });

  it("should start counting days at the first entry when there is no start date", () => {
    const result = getTotalValue(groups, "average-by-time", {
      to: new Date(2026, 9, 5),
    });

    expect(result).toEqual({ value: 4, label: "Average over 5 days" });
  });

  it("should throw for an unknown aggregation mode", () => {
    expect(() =>
      getTotalValue(groups, "median" as AggregationMode, {}),
    ).toThrow('Aggregation mode "median" is not supported.');
  });
});

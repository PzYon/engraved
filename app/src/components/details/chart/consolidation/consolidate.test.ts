import { consolidate } from "./consolidate";
import { ConsolidationKey } from "./ConsolidationKey";
import { GroupByTime } from "./GroupByTime";

import { IGaugeEntry } from "../../../../serverApi/IGaugeEntry";

describe("consolidate", () => {
  it("should group by month (1 entry)", () => {
    const entries: IGaugeEntry[] = [
      { value: 23, dateTime: createDate(2020, 1, 1) },
    ];

    const grouped = consolidate(entries, GroupByTime.Month);

    expect(grouped.length).toBe(1);

    const groupedEntry = grouped[0];
    expect(groupedEntry.entries.length).toBe(1);
    expect(groupedEntry.value).toBe(23);
    assertGroupKey(groupedEntry.groupKey, 2020, 1, 0);
  });

  it("should group by month (2 entries)", () => {
    const entries: IGaugeEntry[] = [
      { value: 20, dateTime: createDate(2020, 1, 1) },
      { value: 10, dateTime: createDate(2020, 1, 2) },
    ];

    const grouped = consolidate(entries, GroupByTime.Month);

    expect(grouped.length).toBe(1);

    const groupedEntry = grouped[0];
    expect(groupedEntry.entries.length).toBe(2);
    expect(groupedEntry.value).toBe(30);
    assertGroupKey(groupedEntry.groupKey, 2020, 1, 0);
  });

  it("should group by month (2 entries, different months)", () => {
    const entries: IGaugeEntry[] = [
      { value: 20, dateTime: createDate(2020, 1, 1) },
      { value: 10, dateTime: createDate(2020, 2, 1) },
    ];

    const grouped = consolidate(entries, GroupByTime.Month);

    expect(grouped.length).toBe(2);

    const firstGroupedEntry = grouped[0];
    expect(firstGroupedEntry.entries.length).toBe(1);
    expect(firstGroupedEntry.value).toBe(20);
    assertGroupKey(firstGroupedEntry.groupKey, 2020, 1, 0);

    const secondGroupedEntry = grouped[1];
    expect(secondGroupedEntry.entries.length).toBe(1);
    expect(secondGroupedEntry.value).toBe(10);
    assertGroupKey(secondGroupedEntry.groupKey, 2020, 2, 0);
  });

  it("should group by month (2 entries - first and last days of month)", () => {
    const entries: IGaugeEntry[] = [
      { value: 20, dateTime: createDate(2020, 3, 31) },
      { value: 10, dateTime: createDate(2020, 4, 1) },
    ];

    const grouped = consolidate(entries, GroupByTime.Month);

    expect(grouped.length).toBe(2);
  });

  it("should group by day (2 entries, same month)", () => {
    const entries: IGaugeEntry[] = [
      { value: 6, dateTime: createDate(2020, 6, 9) },
      { value: 7, dateTime: createDate(2020, 6, 10) },
    ];

    const grouped = consolidate(entries, GroupByTime.Day);

    expect(grouped.length).toBe(2);

    const firstGroupedEntry = grouped[0];
    expect(firstGroupedEntry.entries.length).toBe(1);
    expect(firstGroupedEntry.value).toBe(6);
    assertGroupKey(firstGroupedEntry.groupKey, 2020, 6, 9);

    const secondGroupedEntry = grouped[1];
    expect(secondGroupedEntry.entries.length).toBe(1);
    expect(secondGroupedEntry.value).toBe(7);
    assertGroupKey(secondGroupedEntry.groupKey, 2020, 6, 10);
  });

  it("should group by day (2 Entrys, same day, different month)", () => {
    const entries: IGaugeEntry[] = [
      { value: 10, dateTime: createDate(2020, 5, 3) },
      { value: 30, dateTime: createDate(2020, 6, 3) },
    ];

    const grouped = consolidate(entries, GroupByTime.Day);

    expect(grouped.length).toBe(2);

    const firstGroupedEntry = grouped[0];
    expect(firstGroupedEntry.entries.length).toBe(1);
    expect(firstGroupedEntry.value).toBe(10);
    assertGroupKey(firstGroupedEntry.groupKey, 2020, 5, 3);

    const secondGroupedEntry = grouped[1];
    expect(secondGroupedEntry.entries.length).toBe(1);
    expect(secondGroupedEntry.value).toBe(30);
    assertGroupKey(secondGroupedEntry.groupKey, 2020, 6, 3);
  });

  // todo:
  // - add test for same days in different months (e.g. 1st july vs 1st aug)
  // - add GroupBy.Week
});

function createDate(year: number, month: number, day: number): string {
  return `${year}-${ensureTrailingZero(month)}-${ensureTrailingZero(
    day,
  )}T00:00:00.0000000Z`;
}

function ensureTrailingZero(number: number): string {
  const numberAsString = number.toString();
  return numberAsString.length === 2 ? numberAsString : "0" + numberAsString;
}

function assertGroupKey(
  groupKey: ConsolidationKey,
  expectedYear: number,
  expectedMonth: number,
  expectedDay: number,
) {
  expect(groupKey.year).toBe(expectedYear);
  expect(groupKey.month).toBe(expectedMonth);
  expect(groupKey.day).toBe(expectedDay);
}

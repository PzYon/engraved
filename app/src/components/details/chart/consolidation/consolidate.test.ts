import { consolidate } from "./consolidate";
import { IMeasurement } from "../../../../serverApi/IMeasurement";
import { ConsolidationKey } from "./ConsolidationKey";
import { GroupByTime } from "./GroupByTime";

describe("consolidate should", () => {
  it(" group by month (1 measurement)", () => {
    const measurements: IMeasurement[] = [
      { value: 23, dateTime: createDate(2020, 1, 1) },
    ];

    const grouped = consolidate(measurements, GroupByTime.Month);

    expect(grouped.length).toBe(1);

    const groupedMeasurement = grouped[0];
    expect(groupedMeasurement.measurements.length).toBe(1);
    expect(groupedMeasurement.value).toBe(23);
    assertGroupKey(groupedMeasurement.groupKey, 2020, 1, 0);
  });

  it("group by month (2 measurements)", () => {
    const measurements: IMeasurement[] = [
      { value: 20, dateTime: createDate(2020, 1, 1) },
      { value: 10, dateTime: createDate(2020, 1, 2) },
    ];

    const grouped = consolidate(measurements, GroupByTime.Month);

    expect(grouped.length).toBe(1);

    const groupedMeasurement = grouped[0];
    expect(groupedMeasurement.measurements.length).toBe(2);
    expect(groupedMeasurement.value).toBe(30);
    assertGroupKey(groupedMeasurement.groupKey, 2020, 1, 0);
  });

  it("group by month (2 measurements, different months)", () => {
    const measurements: IMeasurement[] = [
      { value: 20, dateTime: createDate(2020, 1, 1) },
      { value: 10, dateTime: createDate(2020, 2, 1) },
    ];

    const grouped = consolidate(measurements, GroupByTime.Month);

    expect(grouped.length).toBe(2);

    const firstGroupedMeasurement = grouped[0];
    expect(firstGroupedMeasurement.measurements.length).toBe(1);
    expect(firstGroupedMeasurement.value).toBe(20);
    assertGroupKey(firstGroupedMeasurement.groupKey, 2020, 1, 0);

    const secondGroupedMeasurement = grouped[1];
    expect(secondGroupedMeasurement.measurements.length).toBe(1);
    expect(secondGroupedMeasurement.value).toBe(10);
    assertGroupKey(secondGroupedMeasurement.groupKey, 2020, 2, 0);
  });

  it("group by month (2 measurements - first and last days of month)", () => {
    const measurements: IMeasurement[] = [
      { value: 20, dateTime: createDate(2020, 3, 31) },
      { value: 10, dateTime: createDate(2020, 4, 1) },
    ];

    const grouped = consolidate(measurements, GroupByTime.Month);

    expect(grouped.length).toBe(2);
  });

  it("group by day (2 measurements, same month)", () => {
    const measurements: IMeasurement[] = [
      { value: 6, dateTime: createDate(2020, 6, 9) },
      { value: 7, dateTime: createDate(2020, 6, 10) },
    ];

    const grouped = consolidate(measurements, GroupByTime.Day);

    expect(grouped.length).toBe(2);

    const firstGroupedMeasurement = grouped[0];
    expect(firstGroupedMeasurement.measurements.length).toBe(1);
    expect(firstGroupedMeasurement.value).toBe(6);
    assertGroupKey(firstGroupedMeasurement.groupKey, 2020, 6, 9);

    const secondGroupedMeasurement = grouped[1];
    expect(secondGroupedMeasurement.measurements.length).toBe(1);
    expect(secondGroupedMeasurement.value).toBe(7);
    assertGroupKey(secondGroupedMeasurement.groupKey, 2020, 6, 10);
  });

  it("group by day (2 measurements, same day, different month)", () => {
    const measurements: IMeasurement[] = [
      { value: 10, dateTime: createDate(2020, 5, 3) },
      { value: 30, dateTime: createDate(2020, 6, 3) },
    ];

    const grouped = consolidate(measurements, GroupByTime.Day);

    expect(grouped.length).toBe(2);

    const firstGroupedMeasurement = grouped[0];
    expect(firstGroupedMeasurement.measurements.length).toBe(1);
    expect(firstGroupedMeasurement.value).toBe(10);
    assertGroupKey(firstGroupedMeasurement.groupKey, 2020, 5, 3);

    const secondGroupedMeasurement = grouped[1];
    expect(secondGroupedMeasurement.measurements.length).toBe(1);
    expect(secondGroupedMeasurement.value).toBe(30);
    assertGroupKey(secondGroupedMeasurement.groupKey, 2020, 6, 3);
  });

  // todo:
  // - add test for same days in different months (e.g. 1st july vs 1st aug)
  // - add GroupBy.Week
});

function createDate(year: number, month: number, day: number): string {
  return `${year}-${ensureTrailingZero(month)}-${ensureTrailingZero(
    day
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
  expectedDay: number
) {
  expect(groupKey.year).toBe(expectedYear);
  expect(groupKey.month).toBe(expectedMonth);
  expect(groupKey.day).toBe(expectedDay);
}

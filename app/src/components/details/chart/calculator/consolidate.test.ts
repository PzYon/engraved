import { consolidate, GroupBy } from "./consolidate";
import { IMeasurement } from "../../../../serverApi/IMeasurement";

const FIRST_MONTH = "1";
const SECOND_MONTH = "2";

describe("consolidate should", () => {
  it(" group by month (1 measurement)", () => {
    const measurements: IMeasurement[] = [
      { value: 23, dateTime: createDate(2020, 1, 1) },
    ];

    const grouped = consolidate(measurements, GroupBy.Month);

    expect(grouped.length).toBe(1);

    const groupedMeasurement = grouped[0];
    expect(groupedMeasurement.rawValues.length).toBe(1);
    expect(groupedMeasurement.value).toBe(23);
    expect(groupedMeasurement.label).toBe(FIRST_MONTH);
  });

  it("group by month (2 measurements)", () => {
    const measurements: IMeasurement[] = [
      { value: 20, dateTime: createDate(2020, 1, 1) },
      { value: 10, dateTime: createDate(2020, 1, 2) },
    ];

    const grouped = consolidate(measurements, GroupBy.Month);

    expect(grouped.length).toBe(1);

    const groupedMeasurement = grouped[0];
    expect(groupedMeasurement.rawValues.length).toBe(2);
    expect(groupedMeasurement.value).toBe(30);
    expect(groupedMeasurement.label).toBe(FIRST_MONTH);
  });

  it("group by month (2 measurements, different months)", () => {
    const measurements: IMeasurement[] = [
      { value: 20, dateTime: createDate(2020, 1, 1) },
      { value: 10, dateTime: createDate(2020, 2, 1) },
    ];

    const grouped = consolidate(measurements, GroupBy.Month);

    expect(grouped.length).toBe(2);

    const firstGroupedMeasurement = grouped[0];
    expect(firstGroupedMeasurement.rawValues.length).toBe(1);
    expect(firstGroupedMeasurement.value).toBe(20);
    expect(firstGroupedMeasurement.label).toBe(FIRST_MONTH);

    const secondGroupedMeasurement = grouped[1];
    expect(secondGroupedMeasurement.rawValues.length).toBe(1);
    expect(secondGroupedMeasurement.value).toBe(10);
    expect(secondGroupedMeasurement.label).toBe(SECOND_MONTH);
  });

  it("group by day (2 measurements, same month)", () => {
    const measurements: IMeasurement[] = [
      { value: 6, dateTime: createDate(2020, 6, 9) },
      { value: 7, dateTime: createDate(2020, 6, 10) },
    ];

    const grouped = consolidate(measurements, GroupBy.Day);

    expect(grouped.length).toBe(2);

    const firstGroupedMeasurement = grouped[0];
    expect(firstGroupedMeasurement.rawValues.length).toBe(1);
    expect(firstGroupedMeasurement.value).toBe(6);
    expect(firstGroupedMeasurement.label).toBe("9");

    const secondGroupedMeasurement = grouped[1];
    expect(secondGroupedMeasurement.rawValues.length).toBe(1);
    expect(secondGroupedMeasurement.value).toBe(7);
    expect(secondGroupedMeasurement.label).toBe("10");
  });

  it("group by day (2 measurements, same day, different month)", () => {
    const measurements: IMeasurement[] = [
      { value: 10, dateTime: createDate(2020, 5, 3) },
      { value: 30, dateTime: createDate(2020, 6, 3) },
    ];

    const grouped = consolidate(measurements, GroupBy.Day);

    expect(grouped.length).toBe(2);

    const firstGroupedMeasurement = grouped[0];
    expect(firstGroupedMeasurement.rawValues.length).toBe(1);
    expect(firstGroupedMeasurement.value).toBe(10);
    expect(firstGroupedMeasurement.label).toBe("3");

    const secondGroupedMeasurement = grouped[1];
    expect(secondGroupedMeasurement.rawValues.length).toBe(1);
    expect(secondGroupedMeasurement.value).toBe(30);
    expect(secondGroupedMeasurement.label).toBe("3");
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
  return numberAsString.length === 2 ? numberAsString : "0" + number;
}

import { getDurationAsHhMmSs } from "./getDurationAsHhMmSs";

describe("getDurationAsHhMmSs", () => {
  it("should parse two digit time", () => {
    expect(
      getDurationAsHhMmSs(
        createDateFromTime(10, 0, 0),
        createDateFromTime(10, 10, 12),
      ),
    ).toBe("00:10:12");
  });

  it("should parse single digit minute", () => {
    expect(
      getDurationAsHhMmSs(
        createDateFromTime(10, 0, 0),
        createDateFromTime(10, 8, 12),
      ),
    ).toBe("00:08:12");
  });

  it("should parse single digit second", () => {
    expect(
      getDurationAsHhMmSs(
        createDateFromTime(10, 0, 0),
        createDateFromTime(10, 10, 2),
      ),
    ).toBe("00:10:02");
  });

  it("should parse single digit second and minutes", () => {
    expect(
      getDurationAsHhMmSs(
        createDateFromTime(10, 0, 0),
        createDateFromTime(10, 3, 2),
      ),
    ).toBe("00:03:02");
  });

  it("should parse hours", () => {
    expect(
      getDurationAsHhMmSs(
        createDateFromTime(10, 0, 0),
        createDateFromTime(16, 17, 18),
      ),
    ).toBe("06:17:18");
  });
});

function createDateFromTime(
  hours: number,
  minutes: number,
  seconds: number,
): Date {
  const date = new Date();
  date.setHours(hours);
  date.setMinutes(minutes);
  date.setSeconds(seconds);
  date.setMilliseconds(0);
  return date;
}

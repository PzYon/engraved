import { parseDate } from "./parseDate";

const referenceDate = new Date(2017, 3, 20, 0, 0, 0, 0); // thursday

// https://github.com/wanasit/chrono

describe("parseDate", () => {
  it("should parse text with date at end (with next)", () => {
    const result = parseDate("shut up next monday 10:00", referenceDate);

    expect(result.text).toBe("shut up");
    expect(result.date.toJSON()).toBe(
      new Date(2017, 3, 24, 10, 0, 0, 0).toJSON(),
    );
  });

  it("should parse text with date at end (without next [upcoming])", () => {
    const result = parseDate("shut up monday 10:00", referenceDate);

    expect(result.text).toBe("shut up");
    expect(result.date.toJSON()).toBe(
      new Date(2017, 3, 24, 10, 0, 0, 0).toJSON(),
    );
  });

  it("should parse text with date at beginning (without next [upcoming])", () => {
    const result = parseDate("monday 10:00 shut up ", referenceDate);

    expect(result.text).toBe("shut up");
    expect(result.date.toJSON()).toBe(
      new Date(2017, 3, 24, 10, 0, 0, 0).toJSON(),
    );
  });
});

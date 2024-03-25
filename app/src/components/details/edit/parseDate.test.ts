import { parseDate } from "./parseDate";

// https://github.com/wanasit/chrono

describe("parseDate", () => {
  describe("special cases", () => {
    it("returns string", () => {
      const result = parseDate("no date here", referenceDate);
      expect(result.date).toBeUndefined();
      expect(result.text).toBe("no date here");
    });

    it("returns on null", () => {
      const result = parseDate(null, referenceDate);
      expect(result.date).toBeUndefined();
      expect(result.text).toBeUndefined();
    });

    it("returns on undefined", () => {
      const result = parseDate(undefined, referenceDate);
      expect(result.date).toBeUndefined();
      expect(result.text).toBeUndefined();
    });

    it("returns on empty", () => {
      const result = parseDate("", referenceDate);
      expect(result.date).toBeUndefined();
      expect(result.text).toBeUndefined();
    });
  });

  describe("position of date-string", () => {
    it("should parse text with date at end (with next)", () => {
      expectMonday10("shut up next monday 10:00");
    });

    it("should parse text with date at end (without next [upcoming])", () => {
      expectMonday10("shut up monday 10:00");
    });

    it("should parse text with date at beginning (without next [upcoming])", () => {
      expectMonday10("monday 10:00 shut up ");
    });

    it("should parse text with date in the middle", () => {
      expectMonday10("shut monday 10:00 up ");
    });
  });

  describe("abbreviations", () => {
    it("should allow 'mon' for 'monday'", () => {
      const result = parseDate("mon 15:00", referenceDate);
      expect(result.date.toJSON()).toBe(
        new Date(2017, 3, 24, 15, 0, 0, 0).toJSON(),
      );
    });

    it("should allow '1234' for '12:34'", () => {
      const result = parseDate("1234", referenceDate);
      expect(result.date.toJSON()).toBe(
        new Date(2017, 3, 20, 12, 34, 0, 0).toJSON(),
      );
    });

    it("should allow 'tom' for 'tomorrow'", () => {
      const result = parseDate("tom", referenceDate);
      expect(result.date.toJSON()).toBe(
        new Date(2017, 3, 21, 0, 0, 0, 0).toJSON(),
      );
    });
  });
});

const referenceDate = new Date(2017, 3, 20, 0, 0, 0, 0); // thursday

function expectMonday10(value: string) {
  const result = parseDate(value, referenceDate);
  expect(result.text).toBe("shut up");
  expect(result.date.toJSON()).toBe(
    new Date(2017, 3, 24, 10, 0, 0, 0).toJSON(),
  );
}

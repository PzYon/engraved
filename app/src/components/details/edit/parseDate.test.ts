import { parseDate } from "./parseDate";

const referenceDate = new Date(2017, 3, 20); // thursday

describe("parseDate", () => {
  it("xxx", () => {
    const result = parseDate("shut up next monday 10:00", referenceDate);

    expect(result.date).toBe(new Date(2017, 3, 24, 6));
    expect(result.text).toBe("shut up");
  });
});

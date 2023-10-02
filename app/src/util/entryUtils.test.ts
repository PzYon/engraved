import { hasValues } from "./entryUtils";

describe("hasValues", () => {
  it("match (0 selected values)", () => {
    const actual = hasValues({ unit: ["hour"], foo: ["bar"] }, {});
    expect(actual).toBe(true);
  });

  it("non-match (1 selected value, 0 applied values)", () => {
    const actual = hasValues({}, { unit: ["hour"] });
    expect(actual).toBe(false);
  });

  it("match (1 selected value)", () => {
    const actual = hasValues({ unit: ["hour"] }, { unit: ["hour"] });
    expect(actual).toBe(true);
  });

  it("non-match (1 selected value)", () => {
    const actual = hasValues({ unit: ["hour"] }, { unit: ["minute"] });
    expect(actual).toBe(false);
  });

  it("match (2 selected values)", () => {
    const actual = hasValues(
      { unit: ["hour"], duration: ["long"] },
      { unit: ["hour"], duration: ["long"] },
    );
    expect(actual).toBe(true);
  });

  it("non-match (2 selected values)", () => {
    const actual = hasValues(
      { unit: ["hour"], duration: ["long"] },
      { unit: ["hour"], duration: ["short"] },
    );
    expect(actual).toBe(false);
  });
});

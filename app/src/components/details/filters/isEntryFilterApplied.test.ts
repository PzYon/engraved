import { isEntryFilterApplied } from "./isEntryFilterApplied";

describe("isEntryFilterApplied", () => {
  it("should return false when no filters are set", () => {
    const result = isEntryFilterApplied({}, {}, undefined);

    expect(result).toBeFalsy();
  });

  it("should return false when search text is empty", () => {
    const result = isEntryFilterApplied({}, {}, "");

    expect(result).toBeFalsy();
  });

  it("should return true when date range is set", () => {
    const result = isEntryFilterApplied({ from: new Date() }, {}, undefined);

    expect(result).toBeTruthy();
  });

  it("should return true when search text is set", () => {
    const result = isEntryFilterApplied({}, {}, "abc");

    expect(result).toBeTruthy();
  });

  it("should return true when attribute filter is set", () => {
    const result = isEntryFilterApplied(
      {},
      {
        attributeA: ["value-a"],
      },
      undefined,
    );

    expect(result).toBeTruthy();
  });

  it("should return false when attribute filters contain empty selections", () => {
    const result = isEntryFilterApplied(
      {},
      {
        attributeA: [],
      },
      undefined,
    );

    expect(result).toBeFalsy();
  });
});

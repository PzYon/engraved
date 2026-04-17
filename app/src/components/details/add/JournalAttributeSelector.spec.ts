import { describe, expect, test } from "vitest";
import {
  getNextAttributeValues,
  shouldRenderAsPills,
} from "./journalAttributeSelectorUtils";

describe("JournalAttributeSelector", () => {
  test("should render as pills only for up to three options", () => {
    expect(shouldRenderAsPills(1)).toBe(true);
    expect(shouldRenderAsPills(3)).toBe(true);
    expect(shouldRenderAsPills(4)).toBe(false);
  });

  test("should toggle selected value for pills", () => {
    expect(getNextAttributeValues(undefined, "a")).toEqual(["a"]);
    expect(getNextAttributeValues(["b"], "a")).toEqual(["a"]);
    expect(getNextAttributeValues(["a"], "a")).toEqual([]);
  });
});

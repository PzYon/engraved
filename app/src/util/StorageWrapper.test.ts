import { beforeEach, describe, expect, it } from "vitest";
import { StorageWrapper } from "./StorageWrapper";

describe("StorageWrapper", () => {
  let wrapper: StorageWrapper;

  beforeEach(() => {
    localStorage.clear();
    wrapper = new StorageWrapper(localStorage);
  });

  it("round-trips a stored value", () => {
    wrapper.setValue("key", { a: 1, b: "two" });
    expect(wrapper.getValue("key")).toEqual({ a: 1, b: "two" });
  });

  it("returns undefined for a missing key", () => {
    expect(wrapper.getValue("missing")).toBeUndefined();
  });

  it("removes the key when setting null or undefined", () => {
    wrapper.setValue("key", "value");
    wrapper.setValue("key", null);
    expect(localStorage.getItem("key")).toBeNull();
  });

  it("returns undefined and drops the entry for corrupted JSON", () => {
    localStorage.setItem("key", "{ not valid json");

    expect(wrapper.getValue("key")).toBeUndefined();
    expect(localStorage.getItem("key")).toBeNull();
  });
});

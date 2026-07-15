import { movingAverage } from "./movingAverage";
import { ITransformedEntry } from "../transformation/ITransformedEntry";

describe("movingAverage", () => {
  it("should throw error if groupSize is even", () => {
    expect(() => movingAverage([getEntry(1), getEntry(2)], 2)).toThrow(
      "Group size must be an odd number.",
    );
  });

  it("should return original values for groupSize 1", () => {
    const results = movingAverage([getEntry(1), getEntry(2)], 1);

    expect(results.length).toBe(2);
    expect(results[0].y).toBe(1);
    expect(results[1].y).toBe(2);
  });

  it("should shrink window if fewer entries than groupSize", () => {
    const results = movingAverage([getEntry(1), getEntry(2)], 3);

    expect(results.length).toBe(2);
    expect(results[0].y).toBe((1 + 2) / 2);
    expect(results[1].y).toBe((1 + 2) / 2);
  });

  it("should calculate average with 3 entries and groupSize 3", () => {
    const results = movingAverage([getEntry(11), getEntry(20), getEntry(9)], 3);

    expect(results.length).toBe(3);
    expect(results[0].y).toBe((11 + 20) / 2);
    expect(results[1].y).toBe((11 + 20 + 9) / 3);
    expect(results[2].y).toBe((20 + 9) / 2);
  });

  it("should calculate average with 4 entries and groupSize 3", () => {
    const results = movingAverage(
      [getEntry(10), getEntry(20), getEntry(10), getEntry(20)],
      3,
    );

    expect(results.length).toBe(4);
    expect(results[0].y).toBe((10 + 20) / 2);
    expect(results[1].y).toBe((10 + 20 + 10) / 3);
    expect(results[2].y).toBe((20 + 10 + 20) / 3);
    expect(results[3].y).toBe((10 + 20) / 2);
  });

  it("should calculate average with 5 entries and groupSize 5", () => {
    const results = movingAverage(
      [getEntry(10), getEntry(20), getEntry(10), getEntry(20), getEntry(10)],
      5,
    );

    expect(results.length).toBe(5);
    expect(results[0].y).toBe((10 + 20 + 10) / 3);
    expect(results[1].y).toBe((10 + 20 + 10 + 20) / 4);
    expect(results[2].y).toBe((10 + 20 + 10 + 20 + 10) / 5);
    expect(results[3].y).toBe((20 + 10 + 20 + 10) / 4);
    expect(results[4].y).toBe((10 + 20 + 10) / 3);
  });
});

function getEntry(value: number): ITransformedEntry {
  return {
    x: value.toString(),
    y: value,
    entries: [],
  };
}

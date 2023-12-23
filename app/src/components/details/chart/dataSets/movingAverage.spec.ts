import { movingAverage } from "./movingAverage";
import { ITransformedEntry } from "../transformation/ITransformedEntry";

describe("movingAverage", () => {
  it("should return original values if less than size", () => {
    const results = movingAverage([getEntry(1), getEntry(2)], 3);

    expect(results.length).toBe(2);
    expect(results[0].y).toBe(1);
    expect(results[1].y).toBe(2);
  });

  it("should calculate average with 3 entries", () => {
    const results = movingAverage([getEntry(11), getEntry(20), getEntry(9)], 3);

    expect(results.length).toBe(3);
    expect(results[0].y).toBe(11);
    expect(results[1].y).toBe(40 / 3);
    expect(results[2].y).toBe(9);
  });

  it("should calculate average with 4 entries", () => {
    const results = movingAverage(
      [getEntry(10), getEntry(20), getEntry(10), getEntry(20)],
      3,
    );

    expect(results.length).toBe(4);
    expect(results[0].y).toBe(10);
    expect(results[1].y).toBe(40 / 3);
    expect(results[2].y).toBe(50 / 3);
    expect(results[3].y).toBe(20);
  });

  it("should calculate average with 5 entries and 5", () => {
    const results = movingAverage(
      [getEntry(10), getEntry(20), getEntry(10), getEntry(20), getEntry(10)],
      5,
    );

    expect(results.length).toBe(5);
    expect(results[0].y).toBe(10);
    expect(results[1].y).toBe(20);
    expect(results[2].y).toBe(70 / 5);
    expect(results[3].y).toBe(20);
    expect(results[4].y).toBe(10);
  });
});

function getEntry(value: number): ITransformedEntry {
  return {
    x: value.toString(),
    y: value,
    entries: [],
  };
}

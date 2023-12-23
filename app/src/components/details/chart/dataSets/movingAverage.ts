import { ITransformedEntry } from "../transformation/ITransformedEntry";

export function movingAverage(
  entries: ITransformedEntry[],
  size: number,
): ITransformedEntry[] {
  if (entries.length < size) {
    return entries;
  }

  return entries.map((e, i) => {
    const offset = Math.floor(size / 2);

    if (i < offset) {
      console.log("index: " + i + ": return raw");
      return e;
    }

    if (i >= entries.length - offset) {
      console.log("index: " + i + ": return raw");
      return e;
    }

    const average = (entries[i - 1].y + entries[i].y + entries[i + 1].y) / 3;
    console.log("index: " + i + ": return average");

    return {
      y: average,
      x: e.x,
      entries: e.entries,
    };
  });
}

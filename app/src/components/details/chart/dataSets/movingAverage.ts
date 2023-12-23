import { ITransformedEntry } from "../transformation/ITransformedEntry";

export function movingAverage(
  entries: ITransformedEntry[],
  groupSize: number,
): ITransformedEntry[] {
  if (groupSize % 2 !== 1) {
    throw new Error("Group size must be an odd number.");
  }

  if (entries.length < groupSize) {
    return entries;
  }

  return entries.map((e, i) => {
    const offset = Math.floor(groupSize / 2);

    if (i < offset || i >= entries.length - offset) {
      return e;
    }

    return { ...e, y: getAverage(entries, i, groupSize) };
  });
}

function getAverage(
  entries: ITransformedEntry[],
  index: number,
  groupSize: number,
): number {
  let sum = 0;
  const startIndex = index - Math.floor(groupSize / 2);

  for (let i = 0; i < groupSize; i++) {
    sum += entries[startIndex + i].y;
  }

  return sum / groupSize;
}

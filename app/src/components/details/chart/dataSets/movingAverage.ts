import { ITransformedEntry } from "../transformation/ITransformedEntry";

export function movingAverage(
  entries: ITransformedEntry[],
  groupSize: number,
): ITransformedEntry[] {
  if (groupSize % 2 !== 1) {
    throw new Error("Group size must be an odd number.");
  }

  if (groupSize <= 1) {
    return entries;
  }

  const halfWindow = (groupSize - 1) / 2;

  return entries.map((entry, index) => {
    // towards the edges the window shrinks to the points that actually
    // exist, so no value is ever counted more than once
    const startIndex = Math.max(0, index - halfWindow);
    const endIndex = Math.min(entries.length - 1, index + halfWindow);

    let sum = 0;
    for (let i = startIndex; i <= endIndex; i++) {
      sum += entries[i].y;
    }

    return { ...entry, y: sum / (endIndex - startIndex + 1) };
  });
}

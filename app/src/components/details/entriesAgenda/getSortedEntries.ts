import { IEntry } from "../../../serverApi/IEntry";
import { formatDistance, intervalToDuration } from "date-fns";

export interface ISortedEntries {
  entries: IEntry[];
  gaps: {
    valueInDays: number;
    label: string;
  }[];
}

export function getSortedEntries(entries: IEntry[]): ISortedEntries {
  const result: ISortedEntries = {
    entries: entries.sort((a, b) => {
      /* eslint-disable @typescript-eslint/no-explicit-any */
      return (
        ((new Date(a.dateTime) as any) - (new Date(b.dateTime) as any)) * -1
      );
    }),
    gaps: [],
  };

  for (let i = 0; i < result.entries.length; i++) {
    if (i < result.entries.length - 1) {
      result.gaps.push({
        valueInDays: intervalToDuration({
          start: entries[i + 1].dateTime,
          end: result.entries[i].dateTime,
        }).days,
        label: formatDistance(
          entries[i + 1].dateTime,
          result.entries[i].dateTime,
        ),
      });
    }
  }

  return result;
}

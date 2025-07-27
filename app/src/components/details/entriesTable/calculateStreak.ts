import { StreakMode } from "../edit/IJournalUiSettings";
import { ensureDate } from "../../../util/utils";
import {
  addDays,
  differenceInDays,
  isSameDay,
  isToday,
  isYesterday,
} from "date-fns";

export interface IStreak {
  isStreak: boolean;
  length: number;
  hasEntryToday: boolean;
}

export function calculateStreak(
  entries: { dateTime: string | Date }[],
  mode: StreakMode,
): IStreak {
  if (mode === "none") {
    return null;
  }

  const sorted = entries.sort(
    (a, b) =>
      ensureDate(b.dateTime).getTime() - ensureDate(a.dateTime).getTime(),
  );

  const newestEntry = sorted[0];

  const isNewestToday = isToday(newestEntry.dateTime);
  const isNewestYesterday = isYesterday(newestEntry.dateTime);

  if (mode === "positive") {
    return {
      isStreak: isNewestToday || isNewestYesterday,
      hasEntryToday: isNewestToday,
      length: getPositiveStreakLength(entries),
    };
  }

  if (mode === "negative") {
    return {
      isStreak: !isNewestToday && !isNewestYesterday,
      hasEntryToday: isNewestToday,
      length: differenceInDays(new Date(), entries[0].dateTime) - 1,
    };
  }
}

function getPositiveStreakLength(entries: { dateTime: string | Date }[]) {
  let lastDate = new Date();
  let count = 0;

  for (let i = 0; i < entries.length; i++) {
    if (
      (i === 0 && isToday(entries[0].dateTime)) ||
      isSameDay(addDays(entries[i].dateTime, 1), lastDate)
    ) {
      count++;
      lastDate = ensureDate(entries[i].dateTime);
    } else {
      break;
    }
  }

  return count;
}

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

  const newestEntry = getNewestEntry(entries);
  const isNewestToday = isToday(newestEntry.dateTime);
  const isNewestYesterday = isYesterday(newestEntry.dateTime);

  return mode === "positive"
    ? {
        isStreak: isNewestToday || isNewestYesterday,
        hasEntryToday: isNewestToday,
        length: getPositiveStreakLength(entries),
      }
    : {
        isStreak: !isNewestToday && !isNewestYesterday,
        hasEntryToday: isNewestToday,
        length: differenceInDays(new Date(), newestEntry.dateTime) - 1,
      };
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

function getNewestEntry(entries: { dateTime: string | Date }[]) {
  return entries.sort(
    (a, b) =>
      ensureDate(b.dateTime).getTime() - ensureDate(a.dateTime).getTime(),
  )[0];
}

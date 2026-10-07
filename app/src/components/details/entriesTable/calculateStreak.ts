import { StreakMode } from "../edit/IJournalUiSettings";
import { ensureDate } from "../../../util/utils";
import {
  addDays,
  differenceInDays,
  isSameDay,
  isToday,
  isYesterday,
  startOfDay,
} from "date-fns";

interface IStreak {
  isStreak: boolean;
  length: number;
  hasEntryToday: boolean;
}

export function calculateStreak(
  entries: { dateTime: string | Date }[],
  mode: StreakMode,
): IStreak | null {
  if (mode === "none") {
    return null;
  }

  const newestFirst = [...entries].sort(
    (a, b) =>
      ensureDate(b.dateTime).getTime() - ensureDate(a.dateTime).getTime(),
  );

  const newestEntry = newestFirst[0];
  const isNewestToday = isToday(newestEntry.dateTime);
  const isNewestYesterday = isYesterday(newestEntry.dateTime);

  return mode === "positive"
    ? {
        isStreak: isNewestToday || isNewestYesterday,
        hasEntryToday: isNewestToday,
        length: getPositiveStreakLength(newestFirst),
      }
    : {
        isStreak: !isNewestToday && !isNewestYesterday,
        hasEntryToday: isNewestToday,
        length:
          differenceInDays(
            startOfDay(new Date()),
            startOfDay(newestEntry.dateTime),
          ) - 1,
      };
}

function getPositiveStreakLength(newestFirst: { dateTime: string | Date }[]) {
  let lastDate = new Date();
  let count = 0;

  for (let i = 0; i < newestFirst.length; i++) {
    if (
      (i === 0 && isToday(newestFirst[0].dateTime)) ||
      isSameDay(addDays(newestFirst[i].dateTime, 1), lastDate)
    ) {
      count++;
      lastDate = ensureDate(newestFirst[i].dateTime);
    } else {
      break;
    }
  }

  return count;
}

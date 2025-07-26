import { StreakMode } from "../edit/IJournalUiSettings";
import { ensureDate } from "../../../util/utils";
import {
  addDays,
  differenceInDays,
  isSameDay,
  isToday,
  isYesterday,
} from "date-fns";

export function calculateStreak(
  entries: { dateTime: string | Date }[],
  mode: StreakMode,
): {
  isStreak: boolean;
  length: number;
  hasEntryToday: boolean;
} {
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
      length: getStreakLength(entries, mode),
    };
  }

  if (mode === "negative") {
    return {
      isStreak: !isNewestToday && !isNewestYesterday,
      hasEntryToday: isNewestToday,
      length: getStreakLength(entries, mode),
    };
  }
}

function getStreakLength(
  entries: { dateTime: string | Date }[],
  mode: StreakMode,
) {
  switch (mode) {
    case "none":
      return 0;

    case "negative":
      return differenceInDays(new Date(), entries[0].dateTime) - 1;

    case "positive": {
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

    default:
      throw new Error("This should not happen!");
  }
}

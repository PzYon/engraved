import { IEntry } from "../../../serverApi/IEntry";
import { StreakMode } from "../edit/IJournalUiSettings";
import { ensureDate } from "../../../util/utils";
import { isToday, isYesterday } from "date-fns";

export function calculateStreak(
  entries: IEntry[],
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
      length: 2,
    };
  }

  if (mode === "negative") {
    return {
      isStreak: !isNewestToday && !isNewestYesterday,
      hasEntryToday: isNewestToday,
      length: 2,
    };
  }
}
